// data.js - sample property data

const properties = [
	{
		id: 1,
		title: "Luxury Villa",
		location: "Maitama",
		state: "Abuja",
		type: "Villa",
		price: 350000000,
		bedrooms: 5,
		bathrooms: 5,
		parking: 4,
		area: "850 sqm",
		status: "For Sale",
		image: "properties/villa-001/cover2.jpg",
		description: "A private luxury villa with generous living spaces, warm finishes, a chef-ready kitchen, elegant bedrooms, secure parking, and a quiet premium address for family living or long-term investment.",
		amenities: ["Private compound", "Fitted kitchen", "Family lounge", "Modern security", "Premium finishes", "Large parking area"],
		media: [
			{ type: "video", src: "video/video.mp4.mp4", poster: "properties/villa-001/cover2.jpg", label: "Villa Film" },
			{ type: "image", src: "properties/villa-001/cover2.jpg", label: "Exterior" },
			{ type: "image", src: "properties/villa-001/living-room.jpg.jpg", label: "Living Room" },
			{ type: "image", src: "properties/villa-001/bedroom.jpg.jpg", label: "Bedroom Suite" },
			{ type: "image", src: "properties/villa-001/kitchen.jpg.jpg", label: "Kitchen" },
			{ type: "video", src: "video/video1.mp4.mp4", poster: "properties/villa-001/living-room.jpg.jpg", label: "Interior Tour" }
		]
	},
	{
		id: 2,
		title: "Modern Apartment",
		location: "Ikoyi",
		state: "Lagos",
		type: "Apartment",
		price: 85000000,
		bedrooms: 3,
		bathrooms: 3,
		parking: 2,
		area: "240 sqm",
		status: "For Rent",
		image: "properties/onebed-002/cover.jpeg",
		description: "A refined apartment designed for comfortable city living, with bright interiors, functional room planning, modern fittings, and quick access to lifestyle and business districts.",
		amenities: ["Serviced access", "Fitted kitchen", "Bright bedroom", "Steady water supply", "Secure estate", "Visitor parking"],
		media: [
			{ type: "video", src: "video/2 bedroom.mp4", poster: "properties/onebed-002/cover.jpeg", label: "Apartment Film" },
			{ type: "image", src: "properties/onebed-002/cover.jpeg", label: "Exterior" },
			{ type: "image", src: "properties/onebed-002/livinroom.jpg", label: "Living Area" },
			{ type: "image", src: "properties/onebed-002/bedroom.jpg.jpg", label: "Bedroom" },
			{ type: "image", src: "properties/onebed-002/kitchen.jpg", label: "Kitchen" },
			{ type: "video", src: "video/onebed room.mp4", poster: "properties/onebed-002/bedroom.jpg.jpg", label: "Room Tour" }
		]
	},
	{
		id: 3,
		title: "Cozy Bungalow",
		location: "Port Harcourt",
		state: "Rivers",
		type: "Bungalow",
		price: 45000000,
		bedrooms: 2,
		bathrooms: 2,
		parking: 2,
		area: "420 sqm",
		status: "For Sale",
		image: "hero-image/housesduplex-for-sale-in-gra-port-harcourt-i7jM5iARDTnUag1zT4Qj.jpeg",
		description: "A welcoming bungalow with simple, practical spaces, a calm neighborhood feel, and strong value for buyers looking for a personal home or compact rental investment.",
		amenities: ["Easy road access", "Compact compound", "Quiet location", "Good ventilation", "Flexible layout", "Investment value"],
		media: [
			{ type: "video", src: "video/selfcon room.mp4", poster: "hero-image/housesduplex-for-sale-in-gra-port-harcourt-i7jM5iARDTnUag1zT4Qj.jpeg", label: "Walkthrough" },
			{ type: "image", src: "hero-image/housesduplex-for-sale-in-gra-port-harcourt-i7jM5iARDTnUag1zT4Qj.jpeg", label: "Exterior" },
			{ type: "image", src: "hero-image/images (1).jpg", label: "Street View" },
			{ type: "image", src: "hero-image/images (2).jpg", label: "Interior" },
			{ type: "image", src: "hero-image/images (3).jpg", label: "Room Detail" },
			{ type: "image", src: "hero-image/photo-1600585154340-be6161a56a0c.jpg", label: "Inspiration" }
		]
	}
];

window.properties = properties;

// Ensure properties are available in localStorage for other scripts.
try {
	const hasStoredProperties = typeof readStorage === "function"
		? Array.isArray(readStorage("properties", null))
		: Boolean(localStorage.getItem("properties"));

	if (!hasStoredProperties) {
		if (typeof writeStorage === "function") {
			writeStorage("properties", properties);
		} else {
			localStorage.setItem("properties", JSON.stringify(properties));
		}
	}
} catch (error) {
	console.warn("Failed to persist properties to localStorage", error);
}
