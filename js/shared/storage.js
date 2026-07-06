const HomanollStorage = {
	get(key, fallback = null) {
		if (typeof readStorage === "function") {
			return readStorage(key, fallback);
		}

		try {
			const item = localStorage.getItem(key);
			return item ? JSON.parse(item) : fallback;
		} catch (error) {
			console.warn(`Unable to read ${key} from localStorage.`, error);
			return fallback;
		}
	},

	set(key, data) {
		if (typeof writeStorage === "function") {
			return writeStorage(key, data);
		}

		try {
			localStorage.setItem(key, JSON.stringify(data));
			return true;
		} catch (error) {
			console.warn(`Unable to write ${key} to localStorage.`, error);
			return false;
		}
	},

	remove(key) {
		if (typeof removeStorage === "function") {
			return removeStorage(key);
		}

		try {
			localStorage.removeItem(key);
			return true;
		} catch (error) {
			console.warn(`Unable to remove ${key} from localStorage.`, error);
			return false;
		}
	}
};
