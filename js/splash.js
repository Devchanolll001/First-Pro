// ==========================================
// HOM-ANOLL Splash Screen
// ==========================================

const percentage = document.getElementById("percentage");
const loadingText = document.getElementById("loading-text");

const splash = document.getElementById("splash-screen");
const main = document.getElementById("main-content");

let count = 0;

// Loading messages
const messages = [
    "Loading Assets...",
    "Connecting...",
    "Finding Properties...",
    "Preparing Dashboard...",
    "Welcome Home!"
];

// Update percentage every 40ms
const timer = setInterval(() => {

    count++;

    percentage.innerHTML = count + "%";

    if (count < 20) {

        loadingText.innerHTML = messages[0];

    } else if (count < 40) {

        loadingText.innerHTML = messages[1];

    } else if (count < 65) {

        loadingText.innerHTML = messages[2];

    } else if (count < 90) {

        loadingText.innerHTML = messages[3];

    } else {

        loadingText.innerHTML = messages[4];

    }

    if (count >= 100) {

        clearInterval(timer);

        setTimeout(() => {

            splash.style.opacity = "0";
            splash.style.transition = "opacity .8s ease";

            setTimeout(() => {

                splash.style.display = "none";

                document.body.style.overflow = "auto";

                main.style.display = "block";

                main.style.animation = "fadePage 1s ease";

            }, 800);

        }, 400);

    }

}, 40);