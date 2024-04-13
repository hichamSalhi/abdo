document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registrationForm');

    registrationForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;

        // Send registration details via email (you need to implement this)
        sendEmail(email, 'Registration', `Name: ${name}, Email: ${email}`);

        // Clear form inputs
        registrationForm.reset();

        // Optionally, show a success message or redirect to a thank you page
        alert('Thank you for registering! We will contact you soon.');
    });
});
