function showToast(message, type="info"){

const container=document.getElementById("toastContainer");

const toast=document.createElement("div");

toast.className=`toast ${type}`;

const icons={

success:"fa-circle-check",

error:"fa-circle-xmark",

warning:"fa-triangle-exclamation",

info:"fa-circle-info"

};

toast.innerHTML=`

<i class="fa-solid ${icons[type]}"></i>

<span>${message}</span>

`;

container.appendChild(toast);

setTimeout(()=>{

toast.style.animation="slideOut .4s forwards";

setTimeout(()=>{

toast.remove();

},400);

},3500);

}

showToast(

"Welcome back to HOM-ANOLL",

"success"

);

showToast(

"Login Successful",

"success"

);

showToast(

"Incorrect Email or Password",

"error"

);

showToast(

"Added to Wishlist",

"info"

);

showToast(

"Property Deleted",

"warning"

);

toast.innerHTML=`

<i class="fa-solid ${icons[type]}"></i>

<span>${message}</span>

<div class="toast-progress"></div>

`;

showToast(

"Profile Updated",

"success",

"top-right"

);

const activeMessages = new Set();

function showToast(message, type = "info"){

if(activeMessages.has(message)) return;

activeMessages.add(message);

// Create the toast...

setTimeout(() => {

activeMessages.delete(message);

}, 3500);

}


