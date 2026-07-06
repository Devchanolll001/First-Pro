(function () {
    const selectors = ["keyword", "state", "type", "minPrice", "maxPrice", "bedrooms", "sort"];
    const pagePath = window.location.pathname.replace(/\\/g, "/").toLowerCase();
    const isPropertiesPage = pagePath.includes("/pages/properties/");
    const isHomeFolderPage = pagePath.includes("/hom-anolll/");
    const assetPrefix = isPropertiesPage ? "../../assets/" : "../assets/";
    const detailsHref = isPropertiesPage ? "../property-details.html" : "../pages/property-details.html";
    const propertiesHref = isPropertiesPage
        ? "listings.html"
        : `${isHomeFolderPage ? "../" : ""}pages/properties/listings.html`;

    function storageGet(key, fallback) {
        if (typeof readStorage === "function") {
            return readStorage(key, fallback);
        }

        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : fallback;
        } catch (error) {
            console.warn(`Unable to read ${key}.`, error);
            return fallback;
        }
    }

    function storageSet(key, value) {
        if (typeof writeStorage === "function") {
            return writeStorage(key, value);
        }

        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.warn(`Unable to save ${key}.`, error);
            return false;
        }
    }

    function getProperties() {
        if (Array.isArray(window.properties) && window.properties.length) {
            return window.properties;
        }

        if (typeof properties !== "undefined" && Array.isArray(properties)) {
            return properties;
        }

        return storageGet("properties", []);
    }

    function notify(message, color = "#111") {
        if (typeof showToast === "function") {
            showToast(message, color);
            return;
        }

        alert(message);
    }

    function asset(path) {
        if (!path) return `${assetPrefix}hero-image/browse-houses-hero.webp`;
        if (/^(https?:)?\/\//.test(path) || path.startsWith("../") || path.startsWith("./")) {
            return path;
        }
        return `${assetPrefix}${path}`;
    }

    function getValue(id) {
        return document.getElementById(id)?.value.trim() || "";
    }

    function getFilterQuery() {
        const params = new URLSearchParams();
        selectors.forEach(id => {
            const value = getValue(id);
            if (value) params.set(id, value);
        });
        return params.toString();
    }

    function applyQueryFilters() {
        const params = new URLSearchParams(window.location.search);
        selectors.forEach(id => {
            const el = document.getElementById(id);
            if (el && params.has(id)) {
                el.value = params.get(id);
            }
        });
    }

    function propertyMatchesKeyword(property, keyword) {
        if (!keyword) return true;
        const haystack = [
            property.title,
            property.location,
            property.state,
            property.type,
            property.status
        ].join(" ").toLowerCase();
        return haystack.includes(keyword);
    }

    function getFilteredProperties(propertiesData) {
        const keyword = getValue("keyword").toLowerCase();
        const state = getValue("state");
        const type = getValue("type");
        const min = Number(getValue("minPrice")) || 0;
        const maxValue = Number(getValue("maxPrice"));
        const max = maxValue > 0 ? maxValue : Infinity;
        const bedrooms = getValue("bedrooms");

        return propertiesData.filter(property => {
            const price = Number(property.price) || 0;
            return propertyMatchesKeyword(property, keyword)
                && (!state || property.state === state)
                && (!type || property.type === type)
                && price >= min
                && price <= max
                && (!bedrooms || String(property.bedrooms) === bedrooms);
        });
    }

    function sortProperties(list) {
        const sort = getValue("sort");
        return [...list].sort((a, b) => {
            if (sort === "priceLow") return (Number(a.price) || 0) - (Number(b.price) || 0);
            if (sort === "priceHigh") return (Number(b.price) || 0) - (Number(a.price) || 0);
            if (sort === "title") return String(a.title || "").localeCompare(String(b.title || ""));
            return (Number(b.id) || 0) - (Number(a.id) || 0);
        });
    }

    function createText(tagName, text, className) {
        const element = document.createElement(tagName);
        if (className) element.className = className;
        element.textContent = text;
        return element;
    }

    function createPropertyCard(property) {
        const card = document.createElement("article");
        card.className = "property-card";

        const imageWrap = document.createElement("div");
        imageWrap.className = "property-image";

        const img = document.createElement("img");
        img.src = asset(property.image);
        img.alt = property.title || "HOM-ANOLL property";
        img.loading = "lazy";
        imageWrap.appendChild(img);

        const badge = createText("span", property.status || property.type || "Featured", "badge");
        if (String(property.status || "").toLowerCase().includes("rent")) {
            badge.classList.add("rent");
        }
        imageWrap.appendChild(badge);
        card.appendChild(imageWrap);

        const info = document.createElement("div");
        info.className = "property-info";
        info.appendChild(createText("h3", property.title || "Untitled Property"));
        info.appendChild(createText("h4", `NGN ${formatCurrency(Number(property.price) || 0)}`));
        info.appendChild(createText("p", [property.location, property.state].filter(Boolean).join(", ")));

        const details = document.createElement("div");
        details.className = "details";
        details.appendChild(createText("span", `${property.bedrooms || 0} Beds`));
        details.appendChild(createText("span", `${property.bathrooms || 0} Baths`));
        details.appendChild(createText("span", property.type || "Home"));
        info.appendChild(details);

        const actions = document.createElement("div");
        actions.className = "property-actions";

        const detailLink = document.createElement("a");
        detailLink.className = "view-btn";
        detailLink.href = `${detailsHref}?id=${encodeURIComponent(property.id)}`;
        detailLink.textContent = "View Details";
        actions.appendChild(detailLink);

        const compareButton = document.createElement("button");
        compareButton.className = "view-btn compare-btn";
        compareButton.type = "button";
        compareButton.textContent = "Compare";
        compareButton.addEventListener("click", () => addToCompare(property.id));
        actions.appendChild(compareButton);

        info.appendChild(actions);
        card.appendChild(info);
        return card;
    }

    function renderProperties(list) {
        const grid = document.getElementById("propertyGrid");
        if (!grid) return;

        grid.replaceChildren();

        if (!list.length) {
            const empty = createText("div", "No properties match your search yet. Try changing the filters.", "empty-state");
            grid.appendChild(empty);
            return;
        }

        const fragment = document.createDocumentFragment();
        list.forEach(property => fragment.appendChild(createPropertyCard(property)));
        grid.appendChild(fragment);
    }

    function applyFilters() {
        const propertiesData = getProperties();
        renderProperties(sortProperties(getFilteredProperties(propertiesData)));
    }

    let compareList = storageGet("compareList", []).map(Number).filter(Number.isFinite);

    window.addToCompare = function addToCompare(propertyId) {
        const id = Number(propertyId);
        if (!Number.isFinite(id)) return;

        if (compareList.includes(id)) {
            notify("This property is already in your comparison list.");
            return;
        }

        if (compareList.length >= 3) {
            notify("Maximum of 3 properties.", "#dc2626");
            return;
        }

        compareList.push(id);
        if (storageSet("compareList", compareList)) {
            notify("Added to comparison", "#16a34a");
        }
    };

    const handleFilterChange = typeof debounce === "function" ? debounce(applyFilters, 150) : applyFilters;

    document.querySelectorAll(selectors.map(id => `#${id}`).join(",")).forEach(input => {
        input.addEventListener("input", handleFilterChange);
        input.addEventListener("change", applyFilters);
    });

    document.getElementById("searchBtn")?.addEventListener("click", () => {
        const query = getFilterQuery();
        window.location.href = query ? `${propertiesHref}?${query}` : propertiesHref;
    });

    applyQueryFilters();
    applyFilters();
})();
