const API_URL = "https://distraction-blocker-x30r.onrender.com/api";

async function syncBlocks() {
    const { token } = await chrome.storage.local.get("token");
    if (!token) {
        return clearRules();
    }

    try {
        const canAccessRes = await fetch(`${API_URL}/blocker/can-access`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const canAccessData = await canAccessRes.json();
        
        if (canAccessData.success && canAccessData.canAccess) {
            await clearRules();
            return;
        }

        const sitesRes = await fetch(`${API_URL}/blocker/sites`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const sites = await sitesRes.json();
        await applyDNRRules(sites);
    } catch (err) {
        console.error("Extension background sync failed:", err);
    }
}

async function clearRules() {
    const oldRules = await chrome.declarativeNetRequest.getDynamicRules();
    await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: oldRules.map(r => r.id)
    });
}

function extractDomain(url) {
    if (!url) return null;
    let domain = url.replace('http://', '').replace('https://', '');
    domain = domain.split('/')[0].split('?')[0];
    return domain.startsWith('www.') ? domain.substring(4) : domain;
}

async function applyDNRRules(sites) {
    await clearRules();
    if (!sites || sites.length === 0) return;

    const rules = [];
    const extensionBlockedUrl = chrome.runtime.getURL("blocked.html");

    sites.forEach((site, index) => {
        const domain = extractDomain(site.url);
        if (domain) {
            rules.push({
                id: index + 1,
                priority: 1,
                action: { type: "redirect", redirect: { url: extensionBlockedUrl } },
                condition: { urlFilter: `*://${domain}/*`, resourceTypes: ["main_frame"] }
            });
            rules.push({
                id: sites.length + index + 1,
                priority: 1,
                action: { type: "redirect", redirect: { url: extensionBlockedUrl } },
                condition: { urlFilter: `*://www.${domain}/*`, resourceTypes: ["main_frame"] }
            });
        }
    });

    await chrome.declarativeNetRequest.updateDynamicRules({ addRules: rules });
}

chrome.alarms.create("syncTicker", { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "syncTicker") syncBlocks();
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "sync_blocks") {
        syncBlocks().then(() => sendResponse({ status: "done" }));
        return true; 
    }
    if (request.action === "clear_blocks") {
        clearRules().then(() => sendResponse({ status: "done" }));
        return true;
    }
});

syncBlocks();
