/*
// Legacy property-detail renderer retained for reference.
// The premium renderer below now owns the page output.
// property-details.js - render property based on `id` query param

function qs(key) {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
}

function renderMedia(property, mainMediaEl, thumbnailEl) {
    if (!mainMediaEl || !thumbnailEl) return;
    mainMediaEl.innerHTML = "";
    thumbnailEl.innerHTML = "";
    if (property.media && property.media.length) {
        property.media.forEach((m, idx) => {
            if (m.type === 'image') {
                const img = document.createElement('img');
                img.src = m.src;
                img.alt = m.label || property.title;
                if (idx === 0) mainMediaEl.appendChild(img);
                thumbnailEl.innerHTML += `<img src="${m.src}" data-src="${m.src}" alt="${m.label||''}">`;
            } else if (m.type === 'video') {
                mainMediaEl.innerHTML += `<video controls poster="${m.poster||''}"><source src="${m.src}"></video>`;
                thumbnailEl.innerHTML += `<div class="video-thumb" data-video="${m.src}">▶</div>`;
            }
        });
    } else if (property.image) {
        mainMediaEl.innerHTML = `<img src="${property.image}" alt="${property.title}">`;
    }
}

function renderProperty(property) {
    const propertyContent = document.getElementById('propertyContent');
    const mainMedia = document.getElementById('mainMedia');
    const thumbnailGallery = document.getElementById('thumbnailGallery');
    if (!propertyContent) return;

    propertyContent.innerHTML = `
        <h1>${property.title}</h1>
        <p class="price">₦${(property.price||0).toLocaleString()}</p>
        <p class="location">${property.location || ''} - ${property.state || ''}</p>
        <p>${property.description || ''}</p>
        <div class="details">
            <span>${property.bedrooms} Beds</span>
            <span>${property.bathrooms} Baths</span>
            <span>${property.area || property.size || ''}</span>
        </div>
    `;

    renderMedia(property, mainMedia, thumbnailGallery);

    // booking form
    const inspectionForm = document.getElementById('inspectionForm');
    if (inspectionForm) {
        inspectionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const booking = {
                id: generateID(),
                propertyId: property.id,
                customer: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                date: document.getElementById('visitDate').value,
                time: document.getElementById('visitTime').value,
                message: document.getElementById('message').value,
                status: 'Pending'
            };
            const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
            bookings.push(booking);
            localStorage.setItem('bookings', JSON.stringify(bookings));
            showToast('Inspection booked successfully!', '#16a34a');
            inspectionForm.reset();
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const id = Number(qs('id')) || null;
    const list = (typeof properties !== 'undefined') ? properties : (JSON.parse(localStorage.getItem('properties') || '[]'));
    const prop = list.find(p => Number(p.id) === Number(id)) || list[0];
    if (!prop) {
        document.getElementById('propertyContent').innerText = 'Property not found.';
        return;
    }
    renderProperty(prop);
});
*/

// Premium Netflix-style property viewing experience.
(function () {
    const pagePath = window.location.pathname.replace(/\\/g, "/");
    const assetPrefix = pagePath.includes("/pages/properties/") ? "../../assets/" : "../assets/";
    const listingsHref = pagePath.includes("/pages/properties/") ? "listings.html" : "properties/listings.html";
    const aboutHref = pagePath.includes("/pages/properties/") ? "../about.html" : "about.html";
    const contactHref = pagePath.includes("/pages/properties/") ? "../contact.html" : "contact.html";
    const loginHref = pagePath.includes("/pages/properties/") ? "../auth/login.html" : "auth/login.html";
    const homeHref = pagePath.includes("/pages/properties/") ? "../../hom-anolll/index.html" : "../hom-anolll/index.html";
    let activeProperty = null;
    let activeMediaIndex = 0;

    function getQuery(key) {
        return new URLSearchParams(window.location.search).get(key);
    }

    function money(value) {
        return `NGN ${Number(value || 0).toLocaleString("en-NG")}`;
    }

    function asset(path) {
        if (!path) return `${assetPrefix}hero-image/browse-houses-hero.webp`;
        if (/^(https?:)?\/\//.test(path) || path.startsWith("../")) return path;
        return `${assetPrefix}${path}`;
    }

    function readList(key) {
        if (typeof readStorage === "function") {
            const value = readStorage(key, []);
            return Array.isArray(value) ? value : [];
        }

        try {
            const value = JSON.parse(localStorage.getItem(key) || "[]");
            return Array.isArray(value) ? value : [];
        } catch (error) {
            console.warn(`Unable to read ${key}.`, error);
            return [];
        }
    }

    function saveList(key, value) {
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

    function getMedia(property) {
        if (property.media && property.media.length) return property.media;
        return [{ type: "image", src: property.image, label: property.title }];
    }

    function safe(value) {
        return String(value || "").replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[char]));
    }

    function mediaCard(item, index) {
        const poster = safe(asset(item.poster || item.src));
        return `
            <button class="media-card" type="button" data-media-index="${index}">
                <img src="${poster}" alt="${safe(item.label || "Property media")}">
                <span>${item.type === "video" ? '<i class="fas fa-play"></i>' : '<i class="fas fa-image"></i>'}</span>
                <strong>${safe(item.label || "Property view")}</strong>
            </button>
        `;
    }

    function relatedCard(item) {
        return `
            <a class="related-card" href="property-details.html?id=${item.id}">
                <img src="${safe(asset(item.image))}" alt="${safe(item.title)}">
                <div>
                    <span>${safe(item.status || item.type)}</span>
                    <h3>${safe(item.title)}</h3>
                    <p>${money(item.price)}</p>
                </div>
            </a>
        `;
    }

    function renderPremiumView(property, related) {
        const root = document.querySelector(".property-details") || document.body;
        const media = getMedia(property);
        const hero = media[0];
        const heroPoster = safe(asset(hero.poster || property.image || hero.src));
        const heroSource = safe(asset(hero.src || property.image));

        document.title = `${property.title} | HOM-ANOLL`;
        root.className = "property-details netflix-property-view";
        root.innerHTML = `
            <nav class="stream-nav">
                <a class="stream-brand" href="${homeHref}">
                    <img src="${safe(`${assetPrefix}assets/logo.png`)}" alt="HOM-ANOLL Logo">
                    <span>HOM-ANOLL</span>
                </a>
                <div class="stream-links">
                    <a href="${homeHref}">Home</a>
                    <a href="${listingsHref}">Properties</a>
                    <a href="${aboutHref}">About</a>
                    <a href="${contactHref}">Contact</a>
                    <a class="stream-login-link" href="${loginHref}">Login</a>
                </div>
            </nav>

            <header class="stream-hero" id="top">
                <div class="hero-media">
                    ${hero.type === "video"
                        ? `<video autoplay muted loop playsinline poster="${heroPoster}"><source src="${heroSource}" type="video/mp4"></video>`
                        : `<img src="${heroSource}" alt="${safe(hero.label || property.title)}">`
                    }
                </div>
                <div class="hero-shade"></div>
                <div class="hero-content">
                    <div class="hero-meta">
                        <span>${safe(property.status || "Featured")}</span>
                        <span>${safe(property.type || "Property")}</span>
                        <span>${safe(property.location || "")}, ${safe(property.state || "")}</span>
                    </div>
                    <h1>${safe(property.title)}</h1>
                    <p>${safe(property.description || "Explore this professionally curated HOM-ANOLL property with rich media, verified features, and guided inspection support.")}</p>
                    <div class="hero-actions">
                        <button class="play-action" type="button" id="playTourBtn"><i class="fas fa-play"></i> Play Tour</button>
                        <a class="ghost-action" href="#inspection"><i class="fas fa-calendar-check"></i> Book Inspection</a>
                        <button class="round-action" type="button" id="savePropertyBtn" aria-label="Save property"><i class="fas fa-heart"></i></button>
                    </div>
                    <div class="hero-facts">
                        <div><strong>${property.bedrooms || 0}</strong><span>Bedrooms</span></div>
                        <div><strong>${property.bathrooms || 0}</strong><span>Bathrooms</span></div>
                        <div><strong>${property.parking || 0}</strong><span>Parking</span></div>
                        <div><strong>${safe(property.area || "Open")}</strong><span>Area</span></div>
                    </div>
                </div>
                <aside class="price-panel">
                    <span>Asking Price</span>
                    <strong>${money(property.price)}</strong>
                    <small>${safe(property.status || "Available")}</small>
                </aside>
            </header>

            <main class="stream-main">
                <section class="media-row-section">
                    <div class="row-heading">
                        <div>
                            <span>Now Showing</span>
                            <h2>Property Media</h2>
                        </div>
                        <button type="button" id="openGalleryBtn">Open Gallery</button>
                    </div>
                    <div class="media-row" id="mediaRow">
                        ${media.map(mediaCard).join("")}
                    </div>
                </section>

                <section class="overview-grid">
                    <article class="overview-panel">
                        <span class="section-label">Overview</span>
                        <h2>A premium property experience, curated for confident decisions.</h2>
                        <p>${safe(property.description || "")}</p>
                        <div class="amenity-list">
                            ${(property.amenities || []).map(item => `<span><i class="fas fa-check"></i>${safe(item)}</span>`).join("")}
                        </div>
                    </article>
                    <aside class="agent-panel">
                        <span class="section-label">Property Advisor</span>
                        <h3>HOM-ANOLL Concierge</h3>
                        <p>Get guided answers, schedule a private tour, and review next steps with a dedicated advisor.</p>
                        <a href="#inspection">Schedule Tour</a>
                    </aside>
                </section>

                <section class="inspection-section" id="inspection">
                    <div class="inspection-copy">
                        <span class="section-label">Private Viewing</span>
                        <h2>Book an inspection</h2>
                        <p>Choose a convenient date and time. HOM-ANOLL will prepare the property, confirm availability, and guide your visit.</p>
                    </div>
                    <form class="inspection-form" id="inspectionForm">
                        <input id="fullName" type="text" placeholder="Full name" required>
                        <input id="email" type="email" placeholder="Email address" required>
                        <input id="phone" type="tel" placeholder="Phone number" required>
                        <input id="visitDate" type="date" required>
                        <input id="visitTime" type="time" required>
                        <textarea id="message" placeholder="Additional notes"></textarea>
                        <button type="submit"><i class="fas fa-calendar-plus"></i> Confirm Booking</button>
                    </form>
                </section>

                <section class="media-row-section">
                    <div class="row-heading">
                        <div>
                            <span>More Like This</span>
                            <h2>Related Properties</h2>
                        </div>
                    </div>
                    <div class="related-row">
                        ${related.map(relatedCard).join("")}
                    </div>
                </section>
            </main>
        `;
    }

    function renderLightbox() {
        const stage = document.getElementById("lightboxStage");
        const item = getMedia(activeProperty)[activeMediaIndex];
        if (!stage || !item) return;

        if (item.type === "video") {
            stage.innerHTML = `<video controls autoplay poster="${safe(asset(item.poster || activeProperty.image))}"><source src="${safe(asset(item.src))}" type="video/mp4"></video>`;
        } else {
            stage.innerHTML = `<img src="${safe(asset(item.src))}" alt="${safe(item.label || activeProperty.title)}">`;
        }
    }

    function openLightbox(index) {
        activeMediaIndex = index;
        renderLightbox();
        const lightbox = document.getElementById("propertyLightbox");
        lightbox?.classList.add("active");
        lightbox?.setAttribute("aria-hidden", "false");
    }

    function closeLightbox() {
        const lightbox = document.getElementById("propertyLightbox");
        const stage = document.getElementById("lightboxStage");
        lightbox?.classList.remove("active");
        lightbox?.setAttribute("aria-hidden", "true");
        if (stage) stage.innerHTML = "";
    }

    function stepMedia(direction) {
        const media = getMedia(activeProperty);
        activeMediaIndex = (activeMediaIndex + direction + media.length) % media.length;
        renderLightbox();
    }

    function bindPremiumEvents() {
        document.querySelectorAll("[data-media-index]").forEach(card => {
            card.addEventListener("click", () => openLightbox(Number(card.dataset.mediaIndex)));
        });
        document.getElementById("playTourBtn")?.addEventListener("click", () => openLightbox(0));
        document.getElementById("openGalleryBtn")?.addEventListener("click", () => openLightbox(0));
        document.getElementById("closeLightbox")?.addEventListener("click", closeLightbox);
        document.getElementById("prevMedia")?.addEventListener("click", () => stepMedia(-1));
        document.getElementById("nextMedia")?.addEventListener("click", () => stepMedia(1));

        document.getElementById("savePropertyBtn")?.addEventListener("click", event => {
            event.currentTarget.classList.toggle("saved");
            showToast("Property saved to wishlist", "#111");
        });

        document.getElementById("inspectionForm")?.addEventListener("submit", event => {
            event.preventDefault();
            const booking = {
                id: typeof generateID === "function" ? generateID() : Date.now(),
                propertyId: activeProperty.id,
                propertyTitle: activeProperty.title,
                customer: document.getElementById("fullName").value,
                email: document.getElementById("email").value,
                phone: document.getElementById("phone").value,
                date: document.getElementById("visitDate").value,
                time: document.getElementById("visitTime").value,
                message: document.getElementById("message").value,
                status: "Pending"
            };
            const bookings = readList("bookings");
            bookings.push(booking);
            if (!saveList("bookings", bookings)) {
                showToast("Unable to save your booking. Please try again.", "#dc2626");
                return;
            }
            showToast("Inspection booked successfully", "#16a34a");
            event.currentTarget.reset();
        });

        document.addEventListener("keydown", event => {
            const lightbox = document.getElementById("propertyLightbox");
            if (!lightbox?.classList.contains("active")) return;
            if (event.key === "Escape") closeLightbox();
            if (event.key === "ArrowLeft") stepMedia(-1);
            if (event.key === "ArrowRight") stepMedia(1);
        });
    }

    document.addEventListener("DOMContentLoaded", () => {
        const list = (typeof properties !== "undefined" && Array.isArray(properties)) ? properties : readList("properties");
        const id = Number(getQuery("id"));
        activeProperty = list.find(item => Number(item.id) === id) || list[0];

        if (!activeProperty) {
            document.body.innerHTML = `<main class="not-found"><h1>Property not found</h1><a href="${listingsHref}">Back to listings</a></main>`;
            return;
        }

        const related = list.filter(item => item.id !== activeProperty.id).slice(0, 4);
        renderPremiumView(activeProperty, related);
        document.body.insertAdjacentHTML("beforeend", `
            <div class="property-lightbox" id="propertyLightbox" aria-hidden="true">
                <button class="lightbox-close" id="closeLightbox" type="button" aria-label="Close gallery"><i class="fas fa-xmark"></i></button>
                <button class="lightbox-step lightbox-prev" id="prevMedia" type="button" aria-label="Previous media"><i class="fas fa-chevron-left"></i></button>
                <div class="lightbox-stage" id="lightboxStage"></div>
                <button class="lightbox-step lightbox-next" id="nextMedia" type="button" aria-label="Next media"><i class="fas fa-chevron-right"></i></button>
            </div>
            <div id="toast" class="toast">Saved</div>
        `);
        bindPremiumEvents();
    });
})();

