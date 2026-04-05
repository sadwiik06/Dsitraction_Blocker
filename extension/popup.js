const API_URL = "https://distraction-blocker-x30r.onrender.com/api";

document.addEventListener("DOMContentLoaded", async () => {
    const { token } = await chrome.storage.local.get("token");
    if (token) {
        showLoggedIn();
    }

    document.getElementById("login-btn").addEventListener("click", async () => {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const errorDiv = document.getElementById("error");

        try {
            document.getElementById("login-btn").textContent = "LOADING...";
            const res = await fetch(`${API_URL}/users/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            document.getElementById("login-btn").textContent = "LOGIN TO SYNC";
            
            if (data.success && data.token) {
                await chrome.storage.local.set({ token: data.token });
                errorDiv.style.display = "none";
                showLoggedIn();
                chrome.runtime.sendMessage({ action: "sync_blocks" });
            } else {
                errorDiv.textContent = data.message || "Invalid credentials";
                errorDiv.style.display = "block";
            }
        } catch (err) {
            document.getElementById("login-btn").textContent = "LOGIN TO SYNC";
            errorDiv.textContent = "Network error. Try again.";
            errorDiv.style.display = "block";
        }
    });

    document.getElementById("sync-btn").addEventListener("click", () => {
        const btn = document.getElementById("sync-btn");
        btn.textContent = "SYNCING...";
        chrome.runtime.sendMessage({ action: "sync_blocks" }, () => {
            setTimeout(() => { btn.textContent = "FORCE SYNC BLOCKS"; }, 800);
        });
    });

    document.getElementById("dashboard-btn").addEventListener("click", () => {
        chrome.tabs.create({ url: "https://distraction-blocker-4hqd.vercel.app/" });
    });

    document.getElementById("register-link").addEventListener("click", (e) => {
        e.preventDefault();
        chrome.tabs.create({ url: "https://distraction-blocker-4hqd.vercel.app/register" });
    });

    document.getElementById("logout-btn").addEventListener("click", async () => {
        await chrome.storage.local.remove("token");
        chrome.runtime.sendMessage({ action: "clear_blocks" });
        showLoggedOut();
    });
});

function showLoggedIn() {
    document.getElementById("login-view").style.display = "none";
    document.getElementById("logged-in-view").style.display = "block";
}

function showLoggedOut() {
    document.getElementById("login-view").style.display = "block";
    document.getElementById("logged-in-view").style.display = "none";
}
