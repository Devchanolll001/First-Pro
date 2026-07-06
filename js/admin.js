(function () {
    function readList(key) {
        try {
            const value = JSON.parse(localStorage.getItem(key) || "[]");
            return Array.isArray(value) ? value : [];
        } catch (error) {
            console.warn(`Unable to read ${key}.`, error);
            return [];
        }
    }

    function writeList(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.warn(`Unable to save ${key}.`, error);
            alert("Unable to save changes. Please try again.");
            return false;
        }
    }

    function readValue(key) {
        try {
            return localStorage.getItem(key);
        } catch (error) {
            console.warn(`Unable to read ${key}.`, error);
            return null;
        }
    }

    function setValue(key, value) {
        try {
            localStorage.setItem(key, value);
            return true;
        } catch (error) {
            console.warn(`Unable to save ${key}.`, error);
            return false;
        }
    }

    function removeValue(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.warn(`Unable to remove ${key}.`, error);
        }
    }

    function getCurrentUser() {
        try {
            return JSON.parse(localStorage.getItem("currentUser") || "null");
        } catch (error) {
            console.warn("Invalid current user session.", error);
            return null;
        }
    }

    function getInputValue(id) {
        return document.getElementById(id)?.value.trim() || "";
    }

    function setInputValue(id, value) {
        const input = document.getElementById(id);
        if (input) input.value = value ?? "";
    }

    function formatMoney(value) {
        return `NGN ${Number(value || 0).toLocaleString("en-NG")}`;
    }

    function animateCounters() {
        document.querySelectorAll(".counter").forEach(counter => {
            const target = Number(counter.dataset.target || 0);
            const step = Math.max(1, Math.ceil(target / 40));
            let count = 0;
            const timer = setInterval(() => {
                count += step;
                if (count >= target) {
                    counter.textContent = target;
                    clearInterval(timer);
                    return;
                }
                counter.textContent = count;
            }, 35);
        });
    }

    function initializeAdmin() {
        document.getElementById("addProperty")?.addEventListener("click", () => {
            window.location.href = "add-property.html";
        });

        document.getElementById("logoutBtn")?.addEventListener("click", () => {
            removeValue("currentUser");
            window.location.href = "../auth/login.html";
        });

        const user = getCurrentUser();
        const userName = document.getElementById("userName");
        const userRole = document.getElementById("userRole");
        if (userName) userName.textContent = user?.name || "Admin";
        if (userRole) userRole.textContent = user?.role || "admin";
    }

    function collectAmenities() {
        return [...document.querySelectorAll(".amenities-grid label")]
            .filter(label => label.querySelector("input")?.checked)
            .map(label => label.textContent.trim())
            .filter(Boolean);
    }

    function setAmenities(amenities = []) {
        document.querySelectorAll(".amenities-grid label").forEach(label => {
            const input = label.querySelector("input");
            if (input) input.checked = amenities.includes(label.textContent.trim());
        });
    }

    function getPropertyFromForm(existingProperty = {}) {
        const price = Number(getInputValue("price")) || 0;
        const size = getInputValue("size");
        return {
            ...existingProperty,
            id: existingProperty.id || Date.now(),
            title: getInputValue("title"),
            type: getInputValue("propertyType"),
            listingType: getInputValue("listingType"),
            status: getInputValue("listingType"),
            price,
            location: getInputValue("location"),
            bedrooms: Number(getInputValue("bedrooms")) || 0,
            bathrooms: Number(getInputValue("bathrooms")) || 0,
            parking: Number(getInputValue("parking")) || 0,
            size,
            area: size ? `${size} sqm` : existingProperty.area || "",
            description: getInputValue("description"),
            featured: Boolean(document.getElementById("featured")?.checked),
            amenities: collectAmenities(),
            image: existingProperty.image || "hero-image/browse-houses-hero.webp",
            updatedAt: new Date().toISOString()
        };
    }

    function fillPropertyForm(property) {
        setInputValue("title", property.title);
        setInputValue("propertyType", property.type || property.propertyType);
        setInputValue("listingType", property.listingType || property.status);
        setInputValue("price", property.price);
        setInputValue("location", property.location);
        setInputValue("bedrooms", property.bedrooms);
        setInputValue("bathrooms", property.bathrooms);
        setInputValue("parking", property.parking);
        setInputValue("size", property.size || property.area);
        setInputValue("description", property.description);
        const featured = document.getElementById("featured");
        if (featured) featured.checked = Boolean(property.featured);
        setAmenities(property.amenities || []);
    }

    function initializePropertyForm() {
        const form = document.getElementById("propertyForm");
        if (!form) return;

        const properties = readList("properties");
        const editingIndex = Number(readValue("editingProperty"));
        const isEditing = Number.isInteger(editingIndex) && editingIndex >= 0 && properties[editingIndex];

        if (isEditing) {
            fillPropertyForm(properties[editingIndex]);
        }

        form.addEventListener("submit", event => {
            event.preventDefault();

            const nextProperties = readList("properties");
            const nextEditingIndex = Number(readValue("editingProperty"));
            const existingProperty = Number.isInteger(nextEditingIndex) ? nextProperties[nextEditingIndex] : null;
            const property = getPropertyFromForm(existingProperty || {});

            if (!property.title) {
                alert("Property title is required.");
                return;
            }

            if (existingProperty) {
                nextProperties[nextEditingIndex] = property;
            } else {
                property.createdAt = new Date().toISOString();
                nextProperties.push(property);
            }

            if (!writeList("properties", nextProperties)) return;

            removeValue("editingProperty");
            alert(existingProperty ? "Property updated successfully!" : "Property saved successfully!");
            form.reset();
        });
    }

    function createCell(text) {
        const cell = document.createElement("td");
        cell.textContent = text;
        return cell;
    }

    function createActionButton(label, className, action, index) {
        const button = document.createElement("button");
        button.className = className;
        button.type = "button";
        button.dataset.action = action;
        button.dataset.index = index;
        button.textContent = label;
        return button;
    }

    function loadProperties() {
        const tableBody = document.querySelector("#propertyTable tbody");
        if (!tableBody) return;

        const properties = readList("properties");
        tableBody.replaceChildren();

        properties.forEach((property, index) => {
            const row = document.createElement("tr");
            row.appendChild(createCell(property.title || "Untitled Property"));
            row.appendChild(createCell(property.type || property.propertyType || "Property"));
            row.appendChild(createCell(formatMoney(property.price)));
            row.appendChild(createCell(property.location || ""));
            row.appendChild(createCell(property.featured ? "Yes" : "No"));

            const actionCell = document.createElement("td");
            const actions = document.createElement("div");
            actions.className = "action-buttons";
            actions.appendChild(createActionButton("Edit", "edit-btn", "edit", index));
            actions.appendChild(createActionButton("Preview", "preview-btn", "preview", index));
            actions.appendChild(createActionButton("Delete", "delete-btn", "delete", index));
            actionCell.appendChild(actions);
            row.appendChild(actionCell);
            tableBody.appendChild(row);
        });
    }

    function deleteProperty(index) {
        if (!confirm("Delete this property?")) return;
        const properties = readList("properties");
        if (!properties[index]) return;
        properties.splice(index, 1);
        if (writeList("properties", properties)) loadProperties();
    }

    function previewProperty(index) {
        const properties = readList("properties");
        const property = properties[index];
        if (!property) return;
        setValue("selectedProperty", String(index));
        window.location.href = `../properties/property-details.html?id=${encodeURIComponent(property.id || index)}`;
    }

    function editProperty(index) {
        setValue("editingProperty", String(index));
        window.location.href = "add-property.html";
    }

    function initializePropertyTable() {
        const tableBody = document.querySelector("#propertyTable tbody");
        tableBody?.addEventListener("click", event => {
            const button = event.target.closest("button[data-action]");
            if (!button) return;

            const index = Number(button.dataset.index);
            if (button.dataset.action === "edit") editProperty(index);
            if (button.dataset.action === "preview") previewProperty(index);
            if (button.dataset.action === "delete") deleteProperty(index);
        });

        loadProperties();
    }

    function initializeSearch() {
        const search = document.getElementById("searchProperty");
        if (!search) return;

        search.addEventListener("input", () => {
            const keyword = search.value.toLowerCase();
            document.querySelectorAll("#propertyTable tbody tr").forEach(row => {
                row.style.display = row.textContent.toLowerCase().includes(keyword) ? "" : "none";
            });
        });
    }

    function createStatus(status) {
        const span = document.createElement("span");
        const safeStatus = status || "Pending";
        span.className = safeStatus.toLowerCase();
        span.textContent = safeStatus;
        return span;
    }

    function loadBookings() {
        const table = document.querySelector("#bookingTable tbody");
        if (!table) return;

        const bookings = readList("bookings");
        table.replaceChildren();

        bookings.forEach((booking, index) => {
            const row = document.createElement("tr");
            row.appendChild(createCell(booking.customer || booking.name || "Guest"));
            row.appendChild(createCell(booking.email || ""));
            row.appendChild(createCell(booking.propertyTitle || booking.property || "Property"));
            row.appendChild(createCell(booking.date || ""));
            row.appendChild(createCell(booking.time || ""));

            const statusCell = document.createElement("td");
            statusCell.appendChild(createStatus(booking.status));
            row.appendChild(statusCell);

            const actionCell = document.createElement("td");
            const actions = document.createElement("div");
            actions.className = "action-buttons";
            actions.appendChild(createActionButton("Approve", "edit-btn", "approve", index));
            actions.appendChild(createActionButton("Complete", "preview-btn", "complete", index));
            actions.appendChild(createActionButton("Cancel", "delete-btn", "cancel", index));
            actionCell.appendChild(actions);
            row.appendChild(actionCell);
            table.appendChild(row);
        });

        updateBookingStats(bookings);
    }

    function updateBookingStatus(index, status) {
        const bookings = readList("bookings");
        if (!bookings[index]) return;
        bookings[index].status = status;
        if (writeList("bookings", bookings)) loadBookings();
    }

    function initializeBookingTable() {
        const table = document.querySelector("#bookingTable tbody");
        table?.addEventListener("click", event => {
            const button = event.target.closest("button[data-action]");
            if (!button) return;

            const index = Number(button.dataset.index);
            const statusByAction = {
                approve: "Approved",
                complete: "Completed",
                cancel: "Cancelled"
            };
            updateBookingStatus(index, statusByAction[button.dataset.action]);
        });

        loadBookings();
    }

    function updateBookingStats(bookings) {
        const count = status => bookings.filter(booking => booking.status === status).length;
        const values = {
            pendingCount: count("Pending"),
            approvedCount: count("Approved"),
            completedCount: count("Completed"),
            cancelledCount: count("Cancelled")
        };

        Object.entries(values).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });
    }

    document.addEventListener("DOMContentLoaded", () => {
        animateCounters();
        initializeAdmin();
        initializePropertyForm();
        initializePropertyTable();
        initializeSearch();
        initializeBookingTable();
    });

    window.editProperty = editProperty;
    window.previewProperty = previewProperty;
    window.deleteProperty = deleteProperty;
    window.approveBooking = index => updateBookingStatus(index, "Approved");
    window.completeBooking = index => updateBookingStatus(index, "Completed");
    window.cancelBooking = index => updateBookingStatus(index, "Cancelled");
})();
