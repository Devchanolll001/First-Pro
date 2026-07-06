(function () {
    function readCurrentUser() {
        try {
            const user = JSON.parse(localStorage.getItem("currentUser") || "null");
            return user && typeof user === "object" ? user : null;
        } catch (error) {
            console.warn("Unable to read current user notifications.", error);
            return null;
        }
    }

    function saveCurrentUser(user) {
        try {
            localStorage.setItem("currentUser", JSON.stringify(user));
            return true;
        } catch (error) {
            console.warn("Unable to save current user notifications.", error);
            return false;
        }
    }

    function getNotifications() {
        return readCurrentUser()?.notifications || [];
    }

    function updateNotificationBadge() {
        const badge = document.getElementById("notificationCount");
        if (!badge) return;

        const unread = getNotifications().filter(notification => !notification.read).length;
        badge.textContent = unread;
    }

    function createNotificationCard(notification) {
        const card = document.createElement("div");
        card.className = `notification-card ${notification.read ? "read" : ""}`.trim();

        const title = document.createElement("h3");
        title.textContent = notification.title || "Notification";
        card.appendChild(title);

        const message = document.createElement("p");
        message.textContent = notification.message || "";
        card.appendChild(message);

        const date = document.createElement("small");
        date.textContent = notification.createdAt ? new Date(notification.createdAt).toLocaleString() : "";
        card.appendChild(date);

        return card;
    }

    function loadNotifications() {
        const list = document.getElementById("notificationList");
        if (!list) return;

        list.replaceChildren();
        getNotifications().forEach(notification => list.appendChild(createNotificationCard(notification)));
    }

    function addNotification(title, message, type = "general") {
        const user = readCurrentUser();
        if (!user) return false;

        user.notifications = user.notifications || [];
        user.notifications.unshift({
            id: Date.now(),
            title,
            message,
            type,
            read: false,
            createdAt: new Date().toISOString()
        });

        if (!saveCurrentUser(user)) return false;
        updateNotificationBadge();
        loadNotifications();
        return true;
    }

    function markAllAsRead() {
        const user = readCurrentUser();
        if (!user) return;

        user.notifications = (user.notifications || []).map(notification => ({
            ...notification,
            read: true
        }));

        saveCurrentUser(user);
        updateNotificationBadge();
        loadNotifications();
    }

    function clearNotifications() {
        const user = readCurrentUser();
        if (!user) return;

        user.notifications = [];
        saveCurrentUser(user);
        updateNotificationBadge();
        loadNotifications();
    }

    document.addEventListener("DOMContentLoaded", () => {
        updateNotificationBadge();
        loadNotifications();
    });

    window.HomanollNotifications = {
        add: addNotification,
        all: getNotifications,
        clear: clearNotifications,
        markAllAsRead,
        render: loadNotifications,
        updateBadge: updateNotificationBadge
    };
})();
