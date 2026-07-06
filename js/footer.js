const backTop = document.getElementById("backTop");

window.addEventListener("scroll", () => {

    backTop.style.display =
        window.scrollY > 300 ? "block" : "none";

});

backTop.addEventListener("click", () => {

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

});

const links = document.querySelectorAll("nav a");

links.forEach(link => {

    if(link.href === window.location.href){

        link.classList.add("active");

    }

});

