function protectRoute(allowedRoles=[]){

    const user=getCurrentUser();

    if(!user){

        window.location.href="../auth/login.html";

        return;

    }

    if(

        allowedRoles.length &&

        !allowedRoles.includes(user.role)

    ){

        window.location.href="../dashboard/dashboard.html";

    }

}

protectRoute(["admin"]);

protectRoute(["admin","staff"]);

protectRoute([]);

document

.getElementById("logoutBtn")

?.addEventListener("click",()=>{

    const confirmLogout=

    confirm(

        "Logout from HOM-ANOLL?"

    );

    if(confirmLogout){

        logout();

    }

});

function displayUser(){

const user=getCurrentUser();

if(!user) return;

const fullName=

user.firstName

?

`${user.firstName} ${user.lastName}`

:

user.name;

document.getElementById(

"userName"

).innerHTML=fullName;

}

document.addEventListener(

"DOMContentLoaded",

()=>{

displayUser();

});

document.getElementById(

"userRole"

).innerHTML=

getCurrentUser().role;

const current=getCurrentUser();

if(current){

switch(current.role){

case "admin":

window.location.href=

"../admin/admin-dashboard.html";

break;

case "staff":

window.location.href=

"../staff/dashboard.html";

break;

default:

window.location.href=

"../dashboard/dashboard.html";

}

}

