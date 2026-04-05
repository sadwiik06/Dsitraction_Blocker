const API_URL = "https://distraction-blocker-x30r.onrender.com/api";

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const { token } = await chrome.storage.local.get("token");
        if (!token) return;

        const res = await fetch(`${API_URL}/users/stats`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        
        // When there are no tasks pending but the user is blocked
        if (data.success !== false) {
            // data might be the stats object directly if successful
            const user = data.user || data;
            if (user && user.incompleteTasks === 0) {
                document.getElementById("main-quote").textContent = "GO TOUCH GRASS.";
                document.getElementById("sub-quote").textContent = "You have completely cleared your task list. Step away from the computer.";
            }
        }
    } catch (err) {
        console.error("Error fetching stats in blocked page:", err);
    }
});
