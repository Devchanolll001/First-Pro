if (typeof window.toggleWishlist !== "function") {
    window.toggleWishlist = function (id) {
        const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        const index = wishlist.indexOf(id);

        if (index > -1) {
            wishlist.splice(index, 1);
        } else {
            wishlist.push(id);
        }

        localStorage.setItem("wishlist", JSON.stringify(wishlist));
    };
}

function toggleWishlist(propertyId){

if(!currentUser){

showToast(

"Please login first.",

"#dc2626"

);

return;

}

if(!currentUser.wishlist)

currentUser.wishlist=[];

const exists=

currentUser.wishlist.includes(propertyId);

if(exists){

currentUser.wishlist=

currentUser.wishlist.filter(

id=>id!==propertyId

);

}else{

currentUser.wishlist.push(propertyId);

}

saveCurrentUser(currentUser);

updateWishlistIcons();

updateWishlistCounter();

}

function updateWishlistIcons(){

document

.querySelectorAll(".wishlist-btn")

.forEach(button=>{

const id=

Number(

button.dataset.id

);

button.classList.toggle(

"saved",

currentUser.wishlist.includes(id)

);

button.innerHTML=

currentUser.wishlist.includes(id)

?

'<i class="fas fa-heart"></i>'

:

'<i class="far fa-heart"></i>';

});

}

function updateWishlistCounter(){

document.getElementById(

"wishlistTotal"

).textContent=

currentUser.wishlist.length;

}

function loadWishlist(){

const grid=

document.getElementById(

"wishlistGrid"

);

if(!grid) return;

const properties=

JSON.parse(

localStorage.getItem(

"properties"

)

)||[];

const favourites=

properties.filter(property=>

currentUser.wishlist.includes(

property.id

)

);

grid.innerHTML="";

favourites.forEach(property=>{

grid.innerHTML+=`

<div class="property-card">

<h3>

${property.title}

</h3>

<p>

${property.location}

</p>

<h2>

₦${Number(

property.price

).toLocaleString()}

</h2>

<button

onclick="toggleWishlist(${property.id})">

Remove

</button>

</div>

`;

});

}

function addRecentlyViewed(propertyId){

if(!currentUser) return;

if(!currentUser.viewedProperties)

currentUser.viewedProperties=[];

currentUser.viewedProperties=

currentUser.viewedProperties.filter(

id=>id!==propertyId

);

currentUser.viewedProperties.unshift(

propertyId

);

currentUser.viewedProperties=

currentUser.viewedProperties.slice(0,10);

saveCurrentUser(currentUser);

}

addRecentlyViewed(property.id);

function loadRecent(){

const grid=

document.getElementById(

"recentGrid"

);

if(!grid) return;

const properties=

JSON.parse(

localStorage.getItem(

"properties"

)

)||[];

const recent=

properties.filter(property=>

currentUser.viewedProperties.includes(

property.id

)

);

grid.innerHTML="";

recent.forEach(property=>{

grid.innerHTML+=`

<div class="property-card">

<h3>

${property.title}

</h3>

<p>

${property.location}

</p>

</div>

`;

});

}

document.getElementById(

"wishlistCount"

).textContent=

currentUser.wishlist.length;

document.getElementById(

"viewedCount"

).textContent=

currentUser.viewedProperties.length;

