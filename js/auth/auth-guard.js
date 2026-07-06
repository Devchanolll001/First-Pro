/*=========================================
        AUTH GUARD
=========================================*/

function getCurrentUser(){
    try {
        const user = JSON.parse(localStorage.getItem("currentUser") || "null");
        return user && typeof user === "object" ? user : null;
    } catch (error) {
        console.warn("Invalid current user session.", error);
        localStorage.removeItem("currentUser");
        return null;
    }

}

function isLoggedIn(){

    return getCurrentUser() !== null;

}

function logout(){
    try {
        localStorage.removeItem("currentUser");
    } catch (error) {
        console.warn("Unable to clear current user session.", error);
    }

    window.location.href="../auth/login.html";

}

function protectRoute(requiredRole){

    const user=getCurrentUser();

    if(!user){

        window.location.href="../auth/login.html";

        return;

    }

    if(requiredRole && user.role!==requiredRole){

        window.location.href="../dashboard/dashboard.html";

    }

}

