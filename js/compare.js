document.addEventListener("DOMContentLoaded", () => {
    renderComparison();
});

function readStoredList(key) {
    if (typeof readStorage === "function") {
        return readStorage(key, []);
    }

    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : [];
    } catch (error) {
        console.warn(`Unable to read ${key}.`, error);
        return [];
    }
}

function removeStoredValue(key) {
    if (typeof removeStorage === "function") {
        return removeStorage(key);
    }

    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.warn(`Unable to remove ${key}.`, error);
        return false;
    }
}

function createText(tagName, text, className) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    element.textContent = text;
    return element;
}

function formatPropertyPrice(price) {
    if (typeof formatCurrency === "function") {
        return `NGN ${formatCurrency(price)}`;
    }

    return `NGN ${Number(price || 0).toLocaleString("en-NG")}`;
}

function asset(path) {
    if (!path) return "../../assets/hero-image/browse-houses-hero.webp";
    if (/^(https?:)?\/\//.test(path) || path.startsWith("../") || path.startsWith("./")) {
        return path;
    }
    return `../../assets/${path}`;
}

function getPropertyList() {
    if (typeof properties !== "undefined" && Array.isArray(properties)) {
        return properties;
    }

    return readStoredList("properties");
}

function createCompareCard(property) {
    const card = document.createElement("article");
    card.className = "compare-card";

    const image = document.createElement("img");
    image.src = asset(property.image);
    image.alt = property.title || "HOM-ANOLL property";
    image.loading = "lazy";
    card.appendChild(image);

    card.appendChild(createText("h4", property.title || "Untitled Property"));
    card.appendChild(createText("p", formatPropertyPrice(property.price)));
    card.appendChild(createText("p", `${property.bedrooms || 0} Beds | ${property.bathrooms || 0} Baths`));
    card.appendChild(createText("p", [property.location, property.state].filter(Boolean).join(", ")));

    const details = document.createElement("a");
    details.className = "view-btn";
    details.href = `../property-details.html?id=${encodeURIComponent(property.id)}`;
    details.textContent = "View Details";
    card.appendChild(details);

    return card;
}

function renderComparison() {
    const table = document.getElementById("comparisonTable");
    if (!table) return;

    const compareList = readStoredList("compareList").map(Number).filter(Number.isFinite);
    const list = getPropertyList();
    table.replaceChildren();

    if (!compareList.length) {
        table.appendChild(createText("p", "No properties selected for comparison.", "empty-state"));
        return;
    }

    const selected = list.filter(property => compareList.includes(Number(property.id)));

    if (!selected.length) {
        table.appendChild(createText("p", "Compared properties could not be found. Clear the list and try again.", "empty-state"));
    } else {
        const grid = document.createElement("div");
        grid.className = "compare-grid";
        selected.forEach(property => grid.appendChild(createCompareCard(property)));
        table.appendChild(grid);
    }

    const clearButton = document.createElement("button");
    clearButton.id = "clearCompare";
    clearButton.className = "btn";
    clearButton.type = "button";
    clearButton.textContent = "Clear Comparison";
    clearButton.addEventListener("click", () => {
        removeStoredValue("compareList");
        renderComparison();
    });
    table.appendChild(clearButton);
}
