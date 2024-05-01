/**
 * Performs logout functionality by redirecting the user to the landing page.
 * Clears session or performs any other necessary tasks related to logout.
 * Redirects to the landing page ("/").
 */
function logout() {
    // Perform logout functionality

    // Redirect to the landing page
    window.location.href = "/";
}

showSpinner();
/**
 * Fetches ads from the server and displays them in the UI.
 * Creates HTML elements for each ad and appends them to the ads container.
 * Each ad element includes title, description, price, contact information, and buttons for deleting or approving the ad.
 */
fetch('/ads')
    .then(response =>{
        hideSpinner();
        return response.json()
    })
    .then(ads => {
        const adsContainer = document.getElementById('ads-container');
        ads.forEach(ad => {
            const adElement = document.createElement('div');
            adElement.innerHTML = `
            <br>
            <fieldset>
            <h2>${ad.title}</h2>
            <p>${ad.description}</p>
            <p>Price: ${ad.price}</p>
            <p>Contact: ${ad.phoneNumber} | ${ad.email}</p>
            <button onclick="deleteAd(${ad.id})">Delete</button>
            <button id="approveButton${ad.id}" onclick="approveAd(${ad.id})">Approve</button>
            </fieldset>
          `;
            adsContainer.appendChild(adElement);
        });
    })
    .catch(error =>{
        hideSpinner();
     console.error('Error fetching ads:', error)});

/**
 * Deletes the specified ad from the server.
 * Removes the ad element from the UI if deletion is successful.
 * @param {number} adId - The ID of the ad to be deleted.
 */
function deleteAd(adId) {
    showSpinner();
    fetch(`/ads/${adId}`, { method: 'DELETE' })
        .then(response => {
            hideSpinner();
            if (response.ok) {
                // If deletion is successful, remove the ad element from the UI
                const adElement = document.getElementById(`ad-${adId}`);
                if (adElement) {
                    adElement.parentNode.removeChild(adElement);
                }
            } else {
                console.error('Error deleting ad:', response.statusText);
            }
        })
        .catch(error => {
            hideSpinner();
            console.error('Error deleting ad:', error)
        });
}

/**
 * Approves the specified ad by sending a PUT request to the server.
 * @param {number} adId - The ID of the ad to be approved.
 */
function approveAd(adId) {
    showSpinner();
    fetch(`/ads/${adId}/approve`, { method: 'PUT' })
        .then(response => {
            hideSpinner();
            // Hide the approval button after successful approval
            const approveButton = document.getElementById(`approveButton${adId}`);
            if (approveButton) {
                approveButton.parentNode.removeChild(approveButton);
            }
            return response.text()
        })
        .catch(error => {
            hideSpinner();
            console.error('Error approving ad:', error)
        });
}


/**
 *  display the spinner while loading
 */
function showSpinner() {
    document.getElementById('spinner').style.display = 'block';
}

/**
 * hide the spinner after loading
 */
function hideSpinner() {
    document.getElementById('spinner').style.display = 'none';
}
