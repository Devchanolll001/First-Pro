const HOMANOLL_EMPTY_ARRAY = Object.freeze([]);

function safeJsonParse(value, fallback = null) {
	if (value === null || value === undefined || value === "") {
		return fallback;
	}

	try {
		return JSON.parse(value);
	} catch (error) {
		console.warn("Unable to parse stored data.", error);
		return fallback;
	}
}

function readStorage(key, fallback = null) {
	try {
		return safeJsonParse(localStorage.getItem(key), fallback);
	} catch (error) {
		console.warn(`Unable to read ${key} from localStorage.`, error);
		return fallback;
	}
}

function writeStorage(key, data) {
	try {
		localStorage.setItem(key, JSON.stringify(data));
		return true;
	} catch (error) {
		console.warn(`Unable to write ${key} to localStorage.`, error);
		return false;
	}
}

function removeStorage(key) {
	try {
		localStorage.removeItem(key);
		return true;
	} catch (error) {
		console.warn(`Unable to remove ${key} from localStorage.`, error);
		return false;
	}
}

function escapeHTML(value) {
	return String(value ?? "").replace(/[&<>"']/g, char => ({
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': "&quot;",
		"'": "&#39;"
	}[char]));
}

function formatCurrency(amount) {
	return new Intl.NumberFormat("en-NG").format(Number(amount) || 0);
}

function formatDate(iso) {
	const date = new Date(iso);
	return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString();
}

function generateID() {
	if (globalThis.crypto?.randomUUID) {
		return globalThis.crypto.randomUUID();
	}

	return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function showToast(message, color = "#111") {
	const toast = document.getElementById("toast");
	if (!toast) {
		alert(message);
		return;
	}

	toast.textContent = message;
	toast.style.background = color;
	toast.classList.add("show");
	window.setTimeout(() => toast.classList.remove("show"), 3000);
}

function showLoader(id = "loader") {
	const el = document.getElementById(id);
	if (el) el.style.display = "block";
}

function hideLoader(id = "loader") {
	const el = document.getElementById(id);
	if (el) el.style.display = "none";
}

function debounce(fn, wait = 250) {
	let timeoutId;
	return function debounced(...args) {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => fn.apply(this, args), wait);
	};
}

function capitalize(value) {
	if (!value) return "";
	const text = String(value);
	return text.charAt(0).toUpperCase() + text.slice(1);
}

function validateEmail(email) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

function getPublicUser(user) {
	if (!user) return null;
	const { password, ...publicUser } = user;
	return publicUser;
}
