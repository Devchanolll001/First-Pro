const videos = [
  "luxury-home-1.mp4",
  "luxury-home-2.mp4",
  "luxury-home-3.mp4"
];

const randomVideo = videos[Math.floor(Math.random() * videos.length)];
const backgroundVideo = document.querySelector(".background-video");
const backgroundVideoSource = document.querySelector(".background-video source");

if (backgroundVideo && backgroundVideoSource) {
  backgroundVideoSource.src = `../../assets/video/${randomVideo}`;
  backgroundVideo.load();
}

function readCurrentDashboardUser() {
    try {
        return JSON.parse(localStorage.getItem("currentUser") || "null");
    } catch (error) {
        console.warn("Unable to read current dashboard user.", error);
        return null;
    }
}

function getDashboardUserName() {
    try {
        return readCurrentDashboardUser()?.name || localStorage.getItem("homanollUser") || "Guest";
    } catch (error) {
        console.warn("Unable to read dashboard user name.", error);
        return readCurrentDashboardUser()?.name || "Guest";
    }
}

/*=========================================
    HOM-ANOLL Dashboard
==========================================*/

document.addEventListener("DOMContentLoaded", () => {

    initializeDashboard();

});

function initializeDashboard() {

    updateGreeting();

    loadUser();

    animateStatistics();

    initializeSidebar();

    initializeButtons();

    initializeNotifications();

}

// Duplicate/placeholder block removed; initializeDashboard is implemented above.

function updateGreeting() {

    const greetingTitle = document.querySelector(".welcome h1");

    const userName = getDashboardUserName();

    const hour = new Date().getHours();

    let greeting = "";

    if(hour < 12){

        greeting = "Good Morning";

    }

    else if(hour < 18){

        greeting = "Good Afternoon";

    }

    else{

        greeting = "Good Evening";

    }

    if(!greetingTitle) return;

    greetingTitle.textContent = `${greeting}, `;
    const userNameSpan = document.createElement("span");
    userNameSpan.id = "userName";
    userNameSpan.textContent = userName;
    greetingTitle.appendChild(userNameSpan);

}

function loadUser(){

    const userElement = document.getElementById("userName");

    const currentUser = getDashboardUserName();

    if(!userElement) return;

    if(currentUser){

        userElement.textContent = currentUser;

    }else{

        userElement.textContent = "Guest";

    }

}

function animateStatistics(){

    const counters = document.querySelectorAll(".counter");

    counters.forEach(counter=>{

        const updateCounter = ()=>{

            const target = Number(counter.dataset.target);

            const current = Number(counter.innerText);

            const increment = Math.ceil(target/40);

            if(current < target){

                counter.innerText = current + increment;

                setTimeout(updateCounter,40);

            }

            else{

                counter.innerText = target;

            }

        }

        updateCounter();

    });

}

function initializeSidebar(){

    const menuItems = document.querySelectorAll(".menu li");

    menuItems.forEach(item=>{

        item.addEventListener("click",()=>{

            menuItems.forEach(menu=>{

                menu.classList.remove("active");

            });

            item.classList.add("active");

        });

    });

}

function initializeButtons(){

    const buttons = document.querySelectorAll("button");

    buttons.forEach(button=>{

        button.addEventListener("click",()=>{

            button.style.transform="scale(.96)";

            setTimeout(()=>{

                button.style.transform="scale(1)";

            },120);

        });

    });

}

function initializeNotifications(){

    const bell = document.querySelector(".fa-bell");

    if(!bell) return;

    bell.addEventListener("click",()=>{

        alert("You have 5 unread notifications.");

    });

}

/*=========================================
        Dashboard Data
==========================================*/

const dashboardData = {

    notifications: 5,

    wishlist: [],

    bookings: [],

    viewedProperties: []

};

/*=========================================
        Wishlist
==========================================*/

function initializeWishlist(){

    const buttons = document.querySelectorAll(".wishlist-btn");

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    buttons.forEach(button=>{

        const property = button.dataset.property;

        if(wishlist.includes(property)){

            button.classList.add("saved");

        }

        button.addEventListener("click",()=>{

            if(wishlist.includes(property)){

                wishlist = wishlist.filter(item=>item!==property);

                button.classList.remove("saved");

            }

            else{

                wishlist.push(property);

                button.classList.add("saved");

            }

            localStorage.setItem(

                "wishlist",

                JSON.stringify(wishlist)

            );

        });

    });

}


/*
<div id="notificationMenu"
class="notification-dropdown">

    <h4>Notifications</h4>

    <p>🏡 New property available.</p>

    <p>❤️ Wishlist updated.</p>

    <p>📅 Inspection tomorrow.</p>

</div>
*/

function initializeNotifications(){

    const bell = document.querySelector(".fa-bell");

    let menu = document.getElementById("notificationMenu");

    if(!menu && bell){
        menu = document.createElement("div");
        menu.id = "notificationMenu";
        menu.className = "notification-dropdown";
        menu.innerHTML = `
            <h4>Notifications</h4>
            <p>New property available.</p>
            <p>Wishlist updated.</p>
            <p>Inspection tomorrow.</p>
        `;
        document.body.appendChild(menu);
    }

    if(!bell || !menu) return;

    bell.addEventListener("click",(event)=>{

        event.stopPropagation();

        menu.style.display =
        menu.style.display==="block"
        ? "none"
        : "block";

    });

    document.addEventListener("click",()=>{

        menu.style.display="none";

    });

}

function logout(){

    localStorage.removeItem("homanollUser");
    localStorage.removeItem("currentUser");

    window.location.href="../auth/login.html";

}

const logoutBtn = document.querySelector(".menu li:last-child");

if(logoutBtn){
    logoutBtn.addEventListener("click",logout);
}

function loadProfile(){

    const profile = document.querySelector(".profile-mini span");

    const user = getDashboardUserName();

    if(profile){
        profile.textContent=user;
    }

}

/*
<button id="themeToggle"
class="icon-btn">

<i class="fas fa-moon"></i>

</button>
*/

function initializeTheme(){

    const toggle =

    document.getElementById("themeToggle");

    if(!toggle) return;

    toggle.addEventListener("click",()=>{

        document.body.classList.toggle("dark");

    });

}

function initializeDashboard() {

    updateGreeting();

    loadUser();

    loadProfile();

    animateStatistics();

    initializeSidebar();

    initializeButtons();

    initializeNotifications();

    initializeWishlist();

    initializeTheme();

}


