document
.getElementById("bookingForm")
?.addEventListener("submit", createBooking);

function createBooking(event){

event.preventDefault();

const currentUser = typeof getCurrentUser === "function" ? getCurrentUser() : null;

const propertyId = Number(
localStorage.getItem("selectedPropertyId")
);

const booking={

id:Date.now(),

propertyId,

customerId:currentUser?.id || "guest",

customerName:
document.getElementById("customerName").value,

customerEmail:
document.getElementById("customerEmail").value,

customerPhone:
document.getElementById("customerPhone").value,

inspectionDate:
document.getElementById("inspectionDate").value,

inspectionTime:
document.getElementById("inspectionTime").value,

message:
document.getElementById("message").value,

status:"Pending",

paymentStatus:"Unpaid",

amount:5000,

createdAt:new Date().toISOString()

};

saveBooking(booking);

}

function saveBooking(booking){

const bookings=

JSON.parse(

localStorage.getItem("bookings")

)||[];

bookings.push(booking);

localStorage.setItem(

"bookings",

JSON.stringify(bookings)

);

if(typeof addNotification === "function"){

addNotification(

"Inspection Booked",

"Your booking has been submitted successfully.",

"booking"

);

}

window.location.href=

"booking-success.html";

}

function loadBookings(){

const currentUser=getCurrentUser();

const bookings=

JSON.parse(

localStorage.getItem("bookings")

)||[];

const mine=

bookings.filter(

booking=>

booking.customerId===currentUser.id

);

const grid=

document.getElementById("bookingGrid");

grid.innerHTML="";

mine.forEach(booking=>{

grid.innerHTML+=`

<div class="booking-card">

<h3>

Inspection

</h3>

<p>

${booking.inspectionDate}

</p>

<p>

${booking.inspectionTime}

</p>

<p>

Status:
${booking.status}

</p>

<p>

Payment:
${booking.paymentStatus}

</p>

</div>

`;

});

}

