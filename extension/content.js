window.addEventListener("message", (event) => {
    // Only accept messages from the same frame
    if (event.source !== window) return;

    if (event.data && event.data.type === "SYNC_EXTENSION") {
        console.log("Distraction Blocker: Dashboard updated, syncing extension instantly.");
        chrome.runtime.sendMessage({ action: "sync_blocks" });
    }
});
