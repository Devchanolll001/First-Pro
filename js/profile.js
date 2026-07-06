const user = JSON.parse(

localStorage.getItem("currentUser")

);

if(user){

document.getElementById("displayName").textContent=

`${user.firstName} ${user.lastName}`;

document.getElementById("displayRole").textContent=

user.role.toUpperCase();

document.getElementById("firstName").value=

user.firstName || "";

document.getElementById("lastName").value=

user.lastName || "";

document.getElementById("email").value=

user.email || "";

document.getElementById("phone").value=

user.phone || "";

}

document

.getElementById("profileForm")

.addEventListener("submit",(event)=>{

event.preventDefault();

user.firstName=

document.getElementById("firstName").value;

user.lastName=

document.getElementById("lastName").value;

user.phone=

document.getElementById("phone").value;

user.address=

document.getElementById("address").value;

user.city=

document.getElementById("city").value;

user.state=

document.getElementById("state").value;

localStorage.setItem(

"currentUser",

JSON.stringify(user)

);

showToast(

"Profile Updated!",

"#16a34a"

);

});

document

.getElementById("changePassword")

.addEventListener("click",()=>{

const current=

document.getElementById(

"currentPassword"

).value;

const newPass=

document.getElementById(

"newPassword"

).value;

const confirm=

document.getElementById(

"confirmPassword"

).value;

if(current!==user.password){

showToast(

"Current password incorrect",

"#dc2626"

);

return;

}

if(newPass!==confirm){

showToast(

"Passwords don't match",

"#dc2626"

);

return;

}

user.password=newPass;

localStorage.setItem(

"currentUser",

JSON.stringify(user)

);

showToast(

"Password Updated",

"#16a34a"

);

});

document.getElementById("wishlistCount").textContent=

(user.wishlist || []).length;

document.getElementById("bookingCount").textContent=

(user.bookings || []).length;

document.getElementById("viewedCount").textContent=

(user.viewedProperties || []).length;

document

.getElementById("changePhoto")

.addEventListener("click",()=>{

document

.getElementById("avatarUpload")

.click();

});

document

.getElementById("avatarUpload")

.addEventListener("change",(event)=>{

const file=

event.target.files[0];

if(!file) return;

const reader=new FileReader();

reader.onload=(e)=>{

document

.getElementById("profileImage")

.src=e.target.result;

user.avatar=e.target.result;

localStorage.setItem(

"currentUser",

JSON.stringify(user)

);

};

reader.readAsDataURL(file);

});

