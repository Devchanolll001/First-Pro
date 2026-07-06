const heroBg = document.querySelector(".hero-bg");
const heroBgFade = document.querySelector(".hero-bg.hero-bg--fade");

const slideshowImages = [
    "../assets/hero-image/browse-houses-hero.webp",
    "../assets/hero-image/photo-1600585154340-be6161a56a0c.jpg",
    "../assets/hero-image/premium-housing-development-usa-expensive-260nw-2599826849.webp",
    "../assets/hero-image/069e5f20b7d4d3-5-bedroom-detached-duplex-with-pool-detached-duplexes-for-sale-lekki-lagos.jpg"
];

let currentSlide = 0;

function setBackground(element, imageUrl) {
    if (element) {
        element.style.backgroundImage = `url(${imageUrl})`;
    }
}

function nextSlide() {
    if (!heroBg || !heroBgFade) {
        return;
    }

    const nextIndex = (currentSlide + 1) % slideshowImages.length;
    const nextImage = slideshowImages[nextIndex];

    setBackground(heroBgFade, nextImage);
    heroBgFade.style.opacity = "1";

    setTimeout(() => {
        heroBg.style.opacity = "0";

        setTimeout(() => {
            setBackground(heroBg, nextImage);
            heroBg.style.opacity = "1";
            heroBgFade.style.opacity = "0";
            currentSlide = nextIndex;
        }, 1000);
    }, 20);
}

if (heroBg && heroBgFade && slideshowImages.length) {
    setBackground(heroBg, slideshowImages[0]);
    setInterval(nextSlide, 6500);
}
