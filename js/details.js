const params = new URLSearchParams(window.location.search);
const propertyId = Number(params.get("id"));
const property = properties.find(item => item.id === propertyId);

const mainMedia = document.getElementById("mainMedia");
const thumbnails = document.getElementById("thumbnailGallery");
const propertyInfo = document.getElementById("propertyInfo");
let currentMediaIndex = 0;

if (!property) {
    const detailsContainer = document.querySelector(".property-details");

    if (detailsContainer) {
        detailsContainer.innerHTML = `
            <section class="not-found">
                <h1>Property not found</h1>
                <p>The property you selected is not available.</p>
                <a href="../Hom-Anolll/index.html">Back to properties</a>
            </section>
        `;
    }
} else {
    renderPropertyInfo(property);
    displayMedia(property.media[0]);
    renderThumbnails(property.media);
}

function renderPropertyInfo(item) {
    if (!propertyInfo) return;

    propertyInfo.innerHTML = `
        <div class="property-heading">
            <span class="badge ${item.status === "FOR RENT" ? "rent" : ""}">${item.status}</span>
            <h1>${item.title}</h1>
            <h2>${item.price}</h2>
            <p>${item.location}</p>
        </div>

        <div class="property-stats">
            <span>${item.bedrooms} Beds</span>
            <span>${item.bathrooms} Baths</span>
            <span>${item.area}</span>
            <span>${item.type}</span>
        </div>
    `;
}

function renderThumbnails(mediaList) {
    if (!thumbnails) return;

    thumbnails.innerHTML = "";

    mediaList.forEach((media, index) => {
        const thumb = document.createElement("button");
        thumb.className = "thumbnail-card";
        thumb.type = "button";

        if (media.type === "image") {
            thumb.innerHTML = `
                <img src="${media.src}" alt="${media.label}">
                <span>${media.label}</span>
            `;
        } else {
            thumb.innerHTML = `
                <div class="video-thumb">
                    <img src="${media.poster}" alt="${media.label}">
                    <div class="play-icon">Play</div>
                </div>
                <span>${media.label}</span>
            `;
        }

        thumb.addEventListener("click", () => {
            currentMediaIndex = index;
            displayMedia(media);
        });
        thumbnails.appendChild(thumb);
    });
}

function displayMedia(media) {
    if (!mainMedia || !property) return;

    currentMediaIndex = property.media.indexOf(media);

    if (currentMediaIndex < 0) {
        currentMediaIndex = 0;
    }

    mainMedia.style.opacity = 0;

    setTimeout(() => {
        if (media.type === "image") {
            mainMedia.innerHTML = `
                <img src="${media.src}" alt="${media.label}" class="main-image">
            `;
        } else {
            mainMedia.innerHTML = `
                <video class="main-video" controls autoplay poster="${media.poster}">
                    <source src="${media.src}" type="video/mp4">
                </video>
            `;
        }

        mainMedia.style.opacity = 1;
    }, 250);
}

if (mainMedia) {
    mainMedia.addEventListener("click", () => {
        if (property && property.media.length) {
            openLightbox(currentMediaIndex);
        }
    });
}

function openLightbox(index) {
    currentMediaIndex = index;
    renderLightbox();

    const lightbox = document.getElementById("lightbox");

    if (lightbox) {
        lightbox.classList.add("active");
    }
}

function renderLightbox() {
    const lightboxContent = document.getElementById("lightboxContent");

    if (!property || !lightboxContent) return;

    const media = property.media[currentMediaIndex];

    if (!media) return;

    if (media.type === "image") {
        lightboxContent.innerHTML = `<img src="${media.src}" alt="${media.label}">`;
    } else {
        lightboxContent.innerHTML = `
            <video controls autoplay>
                <source src="${media.src}" type="video/mp4">
            </video>
        `;
    }
}

const prevMediaButton = document.getElementById("prevMedia");
const nextMediaButton = document.getElementById("nextMedia");
const closeLightboxButton = document.getElementById("closeLightbox");

if (prevMediaButton) {
    prevMediaButton.onclick = () => {
        if (!property) return;

        currentMediaIndex--;

        if (currentMediaIndex < 0) {
            currentMediaIndex = property.media.length - 1;
        }

        renderLightbox();
    };
}

if (nextMediaButton) {
    nextMediaButton.onclick = () => {
        if (!property) return;

        currentMediaIndex++;

        if (currentMediaIndex >= property.media.length) {
            currentMediaIndex = 0;
        }

        renderLightbox();
    };
}

if (closeLightboxButton) {
    closeLightboxButton.onclick = () => {
        const lightbox = document.getElementById("lightbox");

        if (lightbox) {
            lightbox.classList.remove("active");
        }
    };
}

document.addEventListener("keydown", (event) => {
    const lightbox = document.getElementById("lightbox");

    if (!lightbox || !lightbox.classList.contains("active")) return;

    if (event.key === "ArrowRight") {
        nextMediaButton?.click();
    }

    if (event.key === "ArrowLeft") {
        prevMediaButton?.click();
    }

    if (event.key === "Escape") {
        closeLightboxButton?.click();
    }
});

const propertyContent = document.getElementById("propertyContent");

if (property && propertyContent) {
    const amenities = property.amenities || [];

    propertyContent.innerHTML = `
        <div class="property-header">
            <div>
                <h1>${property.title}</h1>
                <p class="location">${property.location}</p>
            </div>

            <div class="price">
                ${property.price}
            </div>
        </div>

        <div class="spec-grid">
            <div class="spec-card">
                <i class="fa-solid fa-bed"></i>
                <h3>${property.bedrooms}</h3>
                <p>Bedrooms</p>
            </div>

            <div class="spec-card">
                <i class="fa-solid fa-bath"></i>
                <h3>${property.bathrooms}</h3>
                <p>Bathrooms</p>
            </div>

            <div class="spec-card">
                <i class="fa-solid fa-car"></i>
                <h3>${property.parking || 0}</h3>
                <p>Parking</p>
            </div>

            <div class="spec-card">
                <i class="fa-solid fa-ruler-combined"></i>
                <h3>${property.area}</h3>
                <p>Area</p>
            </div>
        </div>

        <div class="description">
            <h2>Description</h2>
            <p>${property.description || "No description available."}</p>
        </div>

        <div class="amenities">
            <h2>Amenities</h2>
            <div class="amenity-grid">
                ${amenities.map(item => `
                    <div class="amenity">
                        <i class="fa-solid fa-check"></i>
                        ${item}
                    </div>
                `).join("")}
            </div>
        </div>
    `;
}
