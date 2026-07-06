document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    if (!form) return;

    function getContactRequests() {
        if (typeof readStorage === 'function') {
            return readStorage('contactRequests', []);
        }

        try {
            return JSON.parse(localStorage.getItem('contactRequests') || '[]');
        } catch (error) {
            console.warn('Unable to read contact requests.', error);
            return [];
        }
    }

    function saveContactRequests(contactRequests) {
        if (typeof writeStorage === 'function') {
            return writeStorage('contactRequests', contactRequests);
        }

        try {
            localStorage.setItem('contactRequests', JSON.stringify(contactRequests));
            return true;
        } catch (error) {
            console.warn('Unable to save contact request.', error);
            return false;
        }
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = document.getElementById('contactName').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const phone = document.getElementById('contactPhone').value.trim();
        const message = document.getElementById('contactMessage').value.trim();

        if (!name || !email || !message) {
            showToast('Please complete all required fields.', '#dc2626');
            return;
        }

        if (!validateEmail(email)) {
            showToast('Please enter a valid email address.', '#dc2626');
            return;
        }

        if (phone && phone.replace(/\D/g, '').length < 10) {
            showToast('Please enter a valid phone number.', '#dc2626');
            return;
        }

        const contactRequests = getContactRequests();
        contactRequests.push({
            id: typeof generateID === 'function' ? generateID() : Date.now(),
            name,
            email,
            phone,
            message,
            date: new Date().toISOString(),
            status: 'New'
        });

        if (!saveContactRequests(contactRequests)) {
            showToast('Unable to save your message. Please try again.', '#dc2626');
            return;
        }

        showToast('Thank you! Your message has been sent.', '#16a34a');
        form.reset();
    });
});
