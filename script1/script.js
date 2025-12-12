document.addEventListener("DOMContentLoaded", function() {
    const uploadBtn = document.getElementById('upload-btn');
    const mouFileInput = document.getElementById('mou-file');
    const mouExpiryDateInput = document.getElementById('mou-expiry-date');
    const mouList = document.getElementById('mou-list');

    // Function to handle the upload and reminder system
    uploadBtn.addEventListener('click', function() {
        const file = mouFileInput.files[0];
        const expiryDate = mouExpiryDateInput.value;

        if (!file || !expiryDate) {
            alert("Please upload a MoU file and set an expiration date.");
            return;
        }

        const expirationDateObj = new Date(expiryDate);
        const currentDate = new Date();

        const timeDifference = expirationDateObj - currentDate;
        const daysRemaining = Math.ceil(timeDifference / (1000 * 3600 * 24));

        // Create a list item
        const li = document.createElement('li');
        li.textContent = `${file.name} - Expiry Date: ${expiryDate}`;

        // Add renewal alert if less than 30 days remaining
        if (daysRemaining <= 30) {
            const alertSpan = document.createElement('span');
            alertSpan.classList.add('renewal-alert');
            alertSpan.textContent = `Renewal Reminder: ${daysRemaining} days left`;
            li.appendChild(alertSpan);
        }

        mouList.appendChild(li);

        // Clear inputs after upload
        mouFileInput.value = '';
        mouExpiryDateInput.value = '';
    });
});
