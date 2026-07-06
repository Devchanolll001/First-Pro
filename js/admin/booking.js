const inspectionForm =
document.getElementById("inspectionForm");

if (inspectionForm) {
inspectionForm.addEventListener("submit",(event)=>{

    event.preventDefault();

    const fullName = document.getElementById("fullName");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const visitDate = document.getElementById("visitDate");
    const visitTime = document.getElementById("visitTime");
    const visitors = document.getElementById("visitors");
    const message = document.getElementById("message");
    const selectedProperty = typeof property !== "undefined" ? property : null;

    const booking={

        propertyId:selectedProperty?.id,

        property:selectedProperty?.title,

        name:fullName.value,

        email:email.value,

        phone:phone.value,

        date:visitDate.value,

        time:visitTime.value,

        visitors:visitors.value,

        message:message.value

    };

    console.log(booking);

    alert(
        "Your inspection request has been submitted successfully!"
    );

    inspectionForm.reset();

});
}

function loadAdminBookings(){

const bookings=

JSON.parse(

localStorage.getItem("bookings")

)||[];

const tbody=

document.querySelector(

"#bookingTable tbody"

);

tbody.innerHTML="";

bookings.forEach(booking=>{

tbody.innerHTML+=`

<tr>

<td>${booking.customerName}</td>

<td>${booking.inspectionDate}</td>

<td>${booking.inspectionTime}</td>

<td>${booking.status}</td>

<td>

<button
onclick="approveBooking(${booking.id})">

Approve

</button>

<button
onclick="rejectBooking(${booking.id})">

Reject

</button>

</td>

</tr>

`;

});

}

function approveBooking(id){

const bookings=
JSON.parse(localStorage.getItem("bookings")) || [];

const booking=
bookings.find(b=>b.id===id);

booking.status="Approved";

localStorage.setItem(
"bookings",
JSON.stringify(bookings)
);

showToast(
"Booking Approved",
"#16a34a"
);

loadAdminBookings();

}

const payment={

bookingId:booking.id,

amount:5000,

currency:"NGN",

status:"Pending"

};

