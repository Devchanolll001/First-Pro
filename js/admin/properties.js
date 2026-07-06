const properties = [
    {
        id: 1,
        title: "Luxury Villa",
        location: "Abuja",
        type: "House",
        price: "NGN 350,000,000",
        bedrooms: 5,
        bathrooms: 6,
        parking: 4,
        area: "850 sqm",
        status: "FOR SALE",
        image: "../assets/properties/villa-001/cover2.jpg",
        description: "A spacious luxury villa with premium finishes, generous living areas, and private outdoor spaces designed for comfortable family living.",
        amenities: [
            "Swimming Pool",
            "Gym",
            "CCTV",
            "Smart Home",
            "Private Cinema",
            "Garden",
            "24/7 Security",
            "Children's Playground"
        ],
        media: [
            { type: "image", src: "../assets/properties/villa-001/cover2.jpg", label: "Cover" },
            { type: "image", src: "../assets/properties/villa-001/living-room.jpg.jpg", label: "Living Room" },
            { type: "image", src: "../assets/properties/villa-001/kitchen.jpg.jpg", label: "Kitchen" },
            { type: "image", src: "../assets/properties/villa-001/bedroom.jpg.jpg", label: "Bedroom" },
            {
                type: "video",
                src: "../assets/properties/villa-001/video.mp4.mp4",
                poster: "../assets/properties/villa-001/cover2.jpg",
                label: "Video Tour"
            }
        ]
    },
    {
        id: 2,
        title: "Modern Apartment",
        location: "Lugbe",
        type: "Apartment",
        price: "NGN 8,500,000 / Year",
        bedrooms: 3,
        bathrooms: 3,
        parking: 2,
        area: "320 sqm",
        status: "FOR RENT",
        image: "../assets/properties/onebed-002/cover.jpeg",
        description: "A modern apartment with bright rooms, practical finishes, and convenient access to key facilities around Lugbe.",
        amenities: [
            "CCTV",
            "Modern Kitchen",
            "Secure Parking",
            "24/7 Security",
            "Water Supply",
            "Balcony"
        ],
        media: [
            { type: "image", src: "../assets/properties/onebed-002/cover.jpeg", label: "Cover" },
            { type: "image", src: "../assets/properties/onebed-002/livinroom.jpg", label: "Living Room" },
            { type: "image", src: "../assets/properties/onebed-002/kitchen.jpg", label: "Kitchen" },
            { type: "image", src: "../assets/properties/onebed-002/bedroom.jpg.jpg", label: "Bedroom" },
            {
                type: "video",
                src: "../assets/properties/onebed-002/video.mp4.mp4",
                poster: "../assets/properties/onebed-002/cover.jpeg",
                label: "Video Tour"
            }
        ]
    }
];

const propertyGrid = document.getElementById("propertyGrid");
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
let currentPropertyList = properties;

function displayProperties(propertyList) {
    if (!propertyGrid) {
        return;
    }

    currentPropertyList = propertyList;
    propertyGrid.innerHTML = "";

    if (!propertyList.length) {
        propertyGrid.innerHTML = '<p class="empty-state">No properties match your search.</p>';
        return;
    }

    propertyList.forEach(property => {
        const isWishlisted = wishlist.includes(property.id);
        const heartIcon = isWishlisted
            ? "fa-solid fa-heart"
            : "fa-regular fa-heart";

        propertyGrid.innerHTML += `
            <div class="property-card" data-location="${property.location}" data-type="${property.type}">
                <button
                    class="wishlist-btn ${isWishlisted ? "active" : ""}"
                    type="button"
                    aria-label="Save ${property.title} to wishlist"
                    aria-pressed="${isWishlisted}"
                    onclick="toggleWishlist(${property.id})">
                    <i class="${heartIcon}"></i>
                </button>

                <div class="property-image">
                    <img src="${property.image}" alt="${property.title}">
                    <span class="badge ${property.status === "FOR RENT" ? "rent" : ""}">${property.status}</span>
                </div>

                <div class="property-info">
                    <h3>${property.title}</h3>
                    <h4>${property.price}</h4>
                    <p>${property.location}</p>

                    <div class="details">
                        <span>${property.bedrooms} Beds</span>
                        <span>${property.bathrooms} Baths</span>
                        <span>${property.area}</span>
                    </div>

                    <button class="view-btn" type="button" onclick="openProperty(${property.id})">
                        View Details
                    </button>
                </div>
            </div>
        `;
    });
}

function toggleWishlist(id) {
    const index = wishlist.indexOf(id);

    if (index > -1) {
        wishlist.splice(index, 1);
    } else {
        wishlist.push(id);
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    displayProperties(currentPropertyList);
}

function openProperty(id) {
    window.location.href = `../pages/property-details.html?id=${id}`;
}

displayProperties(properties);
