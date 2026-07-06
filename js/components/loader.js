(function () {
    const registerForm = document.getElementById("registerForm");
    const fullName = document.getElementById("fullname");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    const terms = document.getElementById("terms");
    const togglePassword = document.getElementById("togglePassword");
    const strengthBar = document.querySelector(".strength-bar");
    const strengthText = document.getElementById("strengthText");
    const submitButton = document.querySelector(".login-btn");

    if (!registerForm || !fullName || !email || !phone || !password || !confirmPassword || !submitButton) {
        return;
    }

    togglePassword?.addEventListener("click", () => {
        const isPassword = password.type === "password";
        password.type = isPassword ? "text" : "password";
        togglePassword.innerHTML = isPassword
            ? '<i class="fas fa-eye-slash"></i>'
            : '<i class="fas fa-eye"></i>';
    });

    function validateEmail(value) {
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

    function updateInputState(input, isValid) {
        const wrapper = input.closest(".input-box");
        if (wrapper) {
            wrapper.style.borderColor = isValid ? "#16a34a" : "#dc2626";
        }
    }

    function getPasswordScore(value) {
        let score = 0;
        if (value.length >= 8) score++;
        if (/[A-Z]/.test(value)) score++;
        if (/[0-9]/.test(value)) score++;
        if (/[!@#$%^&*]/.test(value)) score++;
        return score;
    }

    email.addEventListener("input", () => {
        updateInputState(email, validateEmail(email.value.trim()));
    });

    phone.addEventListener("input", () => {
        updateInputState(phone, phone.value.trim().length >= 10);
    });

    password.addEventListener("input", () => {
        const score = getPasswordScore(password.value);
        const states = [
            { width: "0", color: "#dc2626", label: "Password Strength" },
            { width: "25%", color: "#dc2626", label: "Weak Password" },
            { width: "50%", color: "#f59e0b", label: "Fair Password" },
            { width: "75%", color: "#3b82f6", label: "Good Password" },
            { width: "100%", color: "#16a34a", label: "Strong Password" }
        ];
        const state = states[score];

        if (strengthBar) {
            strengthBar.style.width = state.width;
            strengthBar.style.background = state.color;
        }
        if (strengthText) {
            strengthText.textContent = state.label;
        }
    });

    confirmPassword.addEventListener("input", () => {
        updateInputState(confirmPassword, confirmPassword.value === password.value && confirmPassword.value.length > 0);
    });

    registerForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const nameValue = fullName.value.trim();
        const emailValue = email.value.trim().toLowerCase();
        const phoneValue = phone.value.trim();
        const passwordValue = password.value;

        if (!nameValue) {
            showToast("Enter your full name.", "#dc2626");
            return;
        }

        if (!validateEmail(emailValue)) {
            showToast("Enter a valid email address.", "#dc2626");
            return;
        }

        if (phoneValue.length < 10) {
            showToast("Enter a valid phone number.", "#dc2626");
            return;
        }

        if (passwordValue.length < 6) {
            showToast("Password must be at least 6 characters.", "#dc2626");
            return;
        }

        if (passwordValue !== confirmPassword.value) {
            showToast("Passwords do not match.", "#dc2626");
            return;
        }

        if (!terms?.checked) {
            showToast("Accept the terms first.", "#dc2626");
            return;
        }

        const storedUsers = readStoredJson("users", []);
        const users = Array.isArray(storedUsers) ? storedUsers : [];
        const exists = users.some((user) => user.email?.toLowerCase() === emailValue);

        if (exists) {
            showToast("Email already exists.", "#dc2626");
            return;
        }

        const user = {
            id: typeof generateID === "function" ? generateID() : Date.now(),
            name: nameValue,
            email: emailValue,
            phone: phoneValue,
            password: passwordValue,
            role: "customer",
            verified: false,
            wishlist: [],
            bookings: [],
            createdAt: new Date().toISOString()
        };

        users.push(user);
        const savedUsers = typeof writeStorage === "function"
            ? writeStorage("users", users)
            : (() => {
                try {
                    localStorage.setItem("users", JSON.stringify(users));
                    return true;
                } catch (error) {
                    console.warn("Unable to save users.", error);
                    return false;
                }
            })();

        const publicUser = typeof getPublicUser === "function" ? getPublicUser(user) : user;
        const savedSession = typeof writeStorage === "function"
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

        if (!savedUsers || !savedSession) {
            showToast("Unable to create your account. Please try again.", "#dc2626");
            return;
        }

        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';

        setTimeout(() => {
            showToast("Account created successfully.", "#16a34a");
            submitButton.textContent = "Account Created";
            submitButton.style.background = "#16a34a";
        }, 500);

        setTimeout(() => {
            window.location.href = "../dashboard/dashboard.html";
        }, 1300);
    });
})();

