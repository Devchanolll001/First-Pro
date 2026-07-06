(function () {
    const loginForm = document.getElementById("loginForm");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const remember = document.getElementById("remember");
    const togglePassword = document.getElementById("togglePassword");
    const loginButton = document.querySelector(".login-btn");

    const demoUsers = [
        {
            email: "admin@homanoll.com",
            password: "admin123",
            role: "admin",
            name: "Administrator"
        },
        {
            email: "staff@homanoll.com",
            password: "staff123",
            role: "staff",
            name: "Property Manager"
        },
        {
            email: "customer@homanoll.com",
            password: "customer123",
            role: "customer",
            name: "Francis"
        }
    ];

    if (!loginForm || !email || !password || !loginButton) {
        return;
    }

    let savedEmail = "";
    try {
        savedEmail = localStorage.getItem("savedEmail") || "";
    } catch (error) {
        console.warn("Unable to read saved email.", error);
    }

    if (savedEmail) {
        email.value = savedEmail;
        if (remember) remember.checked = true;
    }

    togglePassword?.addEventListener("click", () => {
        const isPassword = password.type === "password";
        password.type = isPassword ? "text" : "password";
        togglePassword.innerHTML = isPassword
            ? '<i class="fas fa-eye-slash"></i>'
            : '<i class="fas fa-eye"></i>';
    });

    function validEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function readStoredJson(key, fallback) {
        if (typeof readStorage === "function") {
            return readStorage(key, fallback);
        }

        try {
            return safeJsonParse(localStorage.getItem(key), fallback);
        } catch (error) {
            console.warn(`Unable to read ${key}.`, error);
            return fallback;
        }
    }

    function getUsers() {
        const storedUsers = readStoredJson("users", []);
        const registeredUsers = Array.isArray(storedUsers) ? storedUsers : [];
        const legacyUser = readStoredJson("homAnollUser", null);

        if (legacyUser?.email) {
            registeredUsers.push({
                ...legacyUser,
                password: legacyUser.password || password.value,
                role: "customer"
            });
        }

        return [...registeredUsers, ...demoUsers];
    }

    function redirectUser(user) {
        const routes = {
            admin: "../admin/admin-dashboard.html",
            staff: "../dashboard/dashboard.html",
            customer: "../dashboard/dashboard.html"
        };

        window.location.href = routes[user.role] || routes.customer;
    }

    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const emailValue = email.value.trim().toLowerCase();
        const passwordValue = password.value;

        if (!validEmail(emailValue)) {
            showToast("Enter a valid email address.", "#dc2626");
            return;
        }

        if (passwordValue.length < 6) {
            showToast("Password must be at least 6 characters.", "#dc2626");
            return;
        }

        loginButton.disabled = true;
        loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';

        const user = getUsers().find((item) => {
            return item.email?.toLowerCase() === emailValue && item.password === passwordValue;
        });

        setTimeout(() => {
            if (!user) {
                loginButton.disabled = false;
                loginButton.textContent = "Sign In";
                showToast("Invalid email or password.", "#dc2626");
                return;
            }

            try {
                if (remember?.checked) {
                    localStorage.setItem("savedEmail", emailValue);
                } else {
                    localStorage.removeItem("savedEmail");
                }
            } catch (error) {
                console.warn("Unable to update remembered email.", error);
            }

            const publicUser = typeof getPublicUser === "function" ? getPublicUser(user) : user;
            const saved = typeof writeStorage === "function"
                ? writeStorage("currentUser", publicUser)
                : (() => {
                    try {
                        localStorage.setItem("currentUser", JSON.stringify(publicUser));
                        return true;
                    } catch (error) {
                        console.warn("Unable to save current user.", error);
                        return false;
                    }
                })();

            if (!saved) {
                loginButton.disabled = false;
                loginButton.textContent = "Sign In";
                showToast("Unable to start your session. Please try again.", "#dc2626");
                return;
            }

            showToast("Login successful.", "#16a34a");

            setTimeout(() => redirectUser(user), 700);
        }, 600);
    });
})();
