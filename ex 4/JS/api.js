(function () {
    document.addEventListener('DOMContentLoaded', function () {
    // Call fetchRoverInformation to populate the rover dropdown when the page loads
    fetchRoverInformation();

    // Add change event listener to the rover dropdown
    document.querySelector("#roverNameInput").addEventListener("change", function () {
        // Call fetchCamerasForRover when the user selects a rover
        fetchCamerasForRover();

    });

    // Add click event listener to the search button
    document.querySelector("#search").addEventListener("click", function () {
        // Show the loading spinner
        document.getElementById("loadingSpinner").style.display = "inline-block";

        // Check if input fields are empty before calling fetchRoverInformation
        const roverName = document.getElementById("roverNameInput").value;
        const dateTimeInput = document.getElementById("dateTimeInput").value;
        const cameraInput = document.getElementById("cameraInput").value;

        const roverNameInputError = document.getElementById("roverNameInputError");
        const dateTimeInputError = document.getElementById("dateTimeInputError");
        const cameraInputError = document.getElementById("cameraInputError");

        // Reset error messages
        roverNameInputError.innerHTML = "";
        dateTimeInputError.innerHTML = "";
        cameraInputError.innerHTML = "";

        let errors = [];

        // Check if rover name is empty
        if (!roverName) {
            errors.push("Error: Rover name is required.");
            roverNameInputError.innerHTML = "Error: Rover name is required.";
        }

        // Check if date or Sol is empty
        if (!dateTimeInput) {
            errors.push("Error: Date or Sol is required.");
            dateTimeInputError.innerHTML = "Error: Date or Sol is required.";
        }

        // Check if camera is empty
        if (!cameraInput) {
            errors.push("Error: Camera is required.");
            cameraInputError.innerHTML = "Error: Camera is required.";
        }

        // If there are errors, display the messages and return
        if (errors.length > 0) {
            return;
        }

        // Call fetchRoverInformation if there are no errors
        fetchRoverInformation();

        //Call fetchAndDisplaySearchResults to fetch and display search results
        fetchAndDisplaySearchResults(roverName, dateTimeInput, cameraInput);

    });

    // Add click event listener to the reset button
    document.querySelector("#reset").addEventListener("click", function () {
        // Reset input fields
        document.getElementById("roverNameInput").value = "";
        document.getElementById("dateTimeInput").value = "";
        document.getElementById("cameraInput").value = "";

        // Reset dropdowns to their initial state
        fetchRoverInformation();

        // Clear search results and error messages
        clearSearchResults();
        document.getElementById("header").style.display = "none";

        const roverNameInputError = document.getElementById("roverNameInputError");
        const dateTimeInputError = document.getElementById("dateTimeInputError");
        const cameraInputError = document.getElementById("cameraInputError");

        roverNameInputError.innerHTML = "";
        dateTimeInputError.innerHTML = "";
        cameraInputError.innerHTML = "";
    });

    // Add event listener for the Saved Images button
    document.getElementById("savedImagesButton").addEventListener("click", function () {
        // Toggle the visibility of the form and the saved images container
        const formContainer = document.querySelector(".container.mt-5");
        const savedImagesContainer = document.getElementById("savedImagesContainer");
        if (formContainer.style.display !== "none") {
            formContainer.style.display = "none";
            savedImagesContainer.style.display = "block";
        } else {
            formContainer.style.display = "block";
            savedImagesContainer.style.display = "none";
        }
    });

    populateFavoritesTable();

});

/**
 * Function to fetch information about a Mars rover
 */
function fetchRoverInformation() {
    // API key for NASA Mars Photos API
    const API_KEY = "ryfFEKilKgQHaTNNEN3MGICQ78zchlZMIKDy6nNU";

    // Get user input values
    const roverName = document.getElementById("roverNameInput").value;
    const dateTimeInput = document.getElementById("dateTimeInput");
    const cameraInput = document.getElementById("cameraInput");

    // Fetch data from NASA Mars Photos API
    fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers?api_key=${API_KEY}`)
        .then(check_status)
        .then(response => response.json())
        .then(data => {
            const roverDropdown = document.getElementById("roverNameInput");

            // Check if the response contains rover data
            if (data.rovers && data.rovers.length > 0) {
                // Clear existing options
                roverDropdown.innerHTML = "";

                // Populate the dropdown with rover names
                data.rovers.forEach(rover => {
                    const option = document.createElement("option");
                    option.value = rover.name;
                    option.textContent = rover.name;
                    roverDropdown.appendChild(option);
                });

                // Set the selected value back to the user's input
                roverDropdown.value = roverName;

                // Find the rover with the specified name in the response
                const targetRover = data.rovers.find(rover => rover.name === roverName);

                // If the rover is found, validate date or Sol input
                if (targetRover) {
                    const landingDate = new Date(targetRover.landing_date);
                    const maxDate = new Date(targetRover.max_date);
                    const maxSol = targetRover.max_sol;

                    const cameras = targetRover.cameras;

                    let errors = [];

                    // Validate selected camera based on the rover
                    if (!cameras.map(camera => camera.name).includes(cameraInput.value)) {
                        errors.push("Selected camera is not available for the chosen rover.");
                    }

                    // Validate date or Sol input
                    if (!isNaN(dateTimeInput.value)) {
                        // Sol number is entered, validate it
                        const enteredSol = parseInt(dateTimeInput.value);

                        if (enteredSol < 0 || enteredSol > maxSol) {
                            errors.push("Entered Sol is not within the valid range for the chosen rover.");
                        }
                    } else {
                        // Date is entered, validate it
                        const enteredDateTime = new Date(dateTimeInput.value);

                        if (isNaN(enteredDateTime.getTime()) || (enteredDateTime.getTime() < landingDate.getTime() || enteredDateTime.getTime() > maxDate.getTime())) {
                            errors.push("Entered date is not within the valid range for the chosen rover.");
                        }
                    }

                    if (errors.length > 0) {
                        throw new Error(errors.join("\n"));  // Join errors with newline for better readability
                    }
                }
            }
        })
        .catch(error => {
            // Handle errors
            const roverNameInputError = document.getElementById("roverNameInputError");
            const dateTimeInputError = document.getElementById("dateTimeInputError");
            const cameraInputError = document.getElementById("cameraInputError");

            // Reset error messages
            roverNameInputError.innerHTML = "";
            dateTimeInputError.innerHTML = "";
            cameraInputError.innerHTML = "";

            // Check which inputs are missing and display the appropriate error messages
            if (!roverName) {
                roverNameInputError.innerHTML = "Error: Rover name is required.";
            }

            if (!dateTimeInput.value) {
                dateTimeInputError.innerHTML = "Error: Date or Sol is required.";
            }

            if (!cameraInput.value) {
                cameraInputError.innerHTML = "Error: Camera is required.";
            }

            // Additional specific error conditions
            if (!document.getElementById("roverNameInput")) {
                roverNameInputError.innerHTML = "Error: roverNameInput is null or undefined.";
            }

            if (!document.getElementById("dateTimeInput")) {
                dateTimeInputError.innerHTML = "Error: dateTimeInput is null or undefined.";
            }

            if (!document.getElementById("cameraInput")) {
                cameraInputError.innerHTML = "Error: cameraInput is null or undefined.";
            }

            const errorMessages = error.message.split("\n");

            for (const errorMessage of errorMessages) {
                if (errorMessage.includes("date")) {
                    dateTimeInputError.innerHTML = errorMessage;
                } else if (errorMessage.includes("camera")) {
                    cameraInputError.innerHTML = errorMessage;
                } else if (errorMessage.includes("Sol")) {
                    dateTimeInputError.innerHTML = errorMessage;
                }
            }
        });
}

/**
 * Function to fetch cameras for a specific Mars rover
 */
function fetchCamerasForRover() {
    const selectedRover = document.getElementById("roverNameInput").value;
    const camerasDropdown = document.getElementById("cameraInput");
    const camerasError = document.getElementById("cameraInputError"); // Assuming you have an error element for the camera input

    // API key for NASA Mars Photos API
    const API_KEY = "ryfFEKilKgQHaTNNEN3MGICQ78zchlZMIKDy6nNU";

    // Fetch data from NASA Mars Photos API for the selected rover
    fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${selectedRover}?api_key=${API_KEY}`)
        .then(check_status)
        .then(response => response.json())
        .then(data => {
            // Check if the response contains camera data
            if (data.rover && data.rover.cameras && data.rover.cameras.length > 0) {
                // Clear existing options
                camerasDropdown.innerHTML = "";

                // Populate the dropdown with camera names
                data.rover.cameras.forEach(camera => {
                    const option = document.createElement("option");
                    option.value = camera.name;
                    option.textContent = camera.name;
                    camerasDropdown.appendChild(option);
                });

                // Clear any previous error messages
                camerasError.innerHTML = "";

                // Set the selected index of the camera dropdown to -1 to deselect any option
                camerasDropdown.selectedIndex = -1;
            }
        })
        .catch(()=> {
            // Handle errors, for example, set an error message for the user
            camerasError.innerHTML = "Error fetching cameras for the selected rover. Please try again later.";
        });
}

/**
 * Function to fetch and display search results
 * @param roverName
 * @param dateTimeInput
 * @param cameraInput
 */
function fetchAndDisplaySearchResults(roverName, dateTimeInput, cameraInput) {
    const API_KEY = "ryfFEKilKgQHaTNNEN3MGICQ78zchlZMIKDy6nNU";
    const selectedRover = roverName;
    const selectedDate = (isNaN(dateTimeInput) ? `earth_date=${dateTimeInput}` : `sol=${dateTimeInput}`);
    const selectedCamera = `camera=${cameraInput}`;
    const searchResultsContainer = document.getElementById("searchResultsContainer");

    fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${selectedRover}/photos?${selectedDate}&${selectedCamera}&api_key=${API_KEY}`)
        .then(check_status)
        .then(response => response.json())
        .then(data => {
            if (data.photos && data.photos.length > 0) {
                clearSearchResults();
                data.photos.forEach(photo => {
                    displayImage(photo);
                });
            } else {
                searchResultsContainer.innerHTML = '<div class="p-3 mb-2 text-dark text-center d-inline-block"><h3>No images found</h3></div>';
            }
        })
        .catch(error => {
            searchResultsContainer.innerHTML = `<div class="p-3 mb-2 text-dark text-center d-inline-block"><h3>Error: ${error.message}</h3></div>`;
        })
        .finally(() => {
            // Hide the loading spinner after the response is received
            document.getElementById("loadingSpinner").style.display = "none";
        });

}

/**
 * Check the response status of the HTTP request
 * resolve if the status between 200 & 300
 * reject in other case with a new error
 * @param  response
 * @returns
 */
function check_status(response) {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response)
    } else {
        return Promise.reject(new Error("Search did not return a valid response, try again later"))
    }
}

/**
 * Function to clear existing search results
 */
function clearSearchResults() {
    const searchResultsContainer = document.getElementById("searchResultsContainer");
    searchResultsContainer.innerHTML = "";
}


/**
 * Function to display each image with information, save button, and view button
 * @param photo
 */
function displayImage(photo) {
    document.getElementById('header').style.display = 'inline-block';
    const searchResultsContainer = document.getElementById("searchResultsContainer");

    // Create a container for each image
    const imageContainer = document.createElement("div");
    imageContainer.classList.add("col-md-4", "mb-4");

    // Display the image
    const imageElement = document.createElement("img");
    imageElement.src = photo.img_src;
    imageElement.alt = `Mars Rover Image - Sol: ${photo.sol}, Camera: ${photo.camera.name}`;
    imageElement.classList.add("img-fluid");
    imageContainer.appendChild(imageElement);

    // Display information (earth date, sol, camera, rover)
    const informationDiv = document.createElement("div");
    informationDiv.innerHTML = `<p>Earth Date: ${photo.earth_date}</p> <p>Sol: ${photo.sol} </p>
 <p>Camera: ${photo.camera.name} </p> <p>Rover: ${photo.rover.name}</p> `;
    imageContainer.appendChild(informationDiv);

    // Create Save button
    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.classList.add("btn", "btn-outline-success", "mb-2");
    saveButton.addEventListener("click", function () {
        // Call a function to save the image to favorites
        saveImageToFavorites(photo);
    });
    imageContainer.appendChild(saveButton);

    // Create View button
    const viewButton = document.createElement("button");
    viewButton.textContent = "Full size";
    viewButton.classList.add("btn", "btn-outline-primary", "mb-2");
    viewButton.addEventListener("click", function () {
        // Call a function to open the image in a separate window at full resolution
        openImageInSeparateWindow(photo.img_src);
    });
    imageContainer.appendChild(viewButton);

    // Append the image container to the search results container
    searchResultsContainer.appendChild(imageContainer);

}

/**
 * Function to open the image in a separate window at full resolution
 * @param imageSrc
 */
function openImageInSeparateWindow(imageSrc) {
    // Open a new window or tab with the image
    const fullResolutionWindow = window.open(imageSrc, '_blank');
    if (fullResolutionWindow) {
        fullResolutionWindow.focus();
    } else {
        alert("Please allow pop-ups to view the image in full resolution.");
    }
}


/**
 * Function to save the image to the favorite list
 * @param photo The photo object to be saved
 */
function saveImageToFavorites(photo) {
    // Check if the photo is already saved in favorites
    if (isPhotoInFavorites(photo)) {
        // Display a toast indicating that the image is already saved
        displayToast("This image is already saved in your favorites.");
        return; // Exit the function if the photo is already saved
    }

    // Get the favorites from local storage or initialize an empty array
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    // Add the photo to the favorites array
    favorites.push(photo);

    // Save the updated favorites array back to local storage
    localStorage.setItem("favorites", JSON.stringify(favorites));

    // Notify the user about the success of the save
    displayToast("Image saved to favorites successfully!");
}

/**
 * Function to display a Bootstrap toast
 * @param message The message to be displayed in the toast
 */
function displayToast(message) {
    // Create a new toast element
    const toast = document.createElement("div");
    toast.classList.add("toast");
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "assertive");
    toast.setAttribute("aria-atomic", "true");

    // Create a toast header
    const header = document.createElement("div");
    header.classList.add("toast-header");

    const strong = document.createElement("strong");
    strong.classList.add("me-auto");
    strong.textContent = "Notification";

    const button = document.createElement("button");
    button.classList.add("btn-close");
    button.setAttribute("type", "button");
    button.setAttribute("data-bs-dismiss", "toast");
    button.setAttribute("aria-label", "Close");

    header.appendChild(strong);
    header.appendChild(button);

    // Create a toast body
    const body = document.createElement("div");
    body.classList.add("toast-body");
    body.textContent = message;

    // Append header and body to the toast
    toast.appendChild(header);
    toast.appendChild(body);

    // Append the toast to the toast container
    const toastContainer = document.getElementById("toastContainer");
    toastContainer.appendChild(toast);

    // Initialize a new Bootstrap toast
    const bootstrapToast = new bootstrap.Toast(toast);

    // Show the toast
    bootstrapToast.show();
}


/**
 * Function to check if a photo is already saved in favorites
 * @param photo The photo object to be checked
 * @returns {boolean} True if the photo is already saved, false otherwise
 */
function isPhotoInFavorites(photo) {
    // Get the favorites from local storage or initialize an empty array
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    // Check if the photo is already in favorites based on its image source
    return favorites.some(favorite => favorite.img_src === photo.img_src);
}

/**
 *  Populate and display saved images
 */
function populateFavoritesTable() {
    const favoritesTableBody = document.getElementById("favoritesTableBody");
    favoritesTableBody.innerHTML = ""; // Clear previous content

    // Retrieve favorites from local storage
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    favorites.forEach(photo => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><p><span style="color: blue; text-decoration: underline;">Image id: ${photo.id}</span></p>Earth date: ${photo.earth_date}, Sol: ${photo.sol}, Camera: ${photo.camera.name}, <button class="btn btn-danger delete-btn">Delete</button></td>
        `;
        favoritesTableBody.appendChild(row);
    });
}

// Add event listener for the back button
document.getElementById("backToSearchForm").addEventListener("click", function () {
    // Toggle visibility of search form and favorites container
    document.querySelector(".container.mt-5").style.display = "block";
    document.getElementById("savedImagesContainer").style.display = "none";
});

// Event delegation for delete buttons in the favorites table
document.getElementById("favoritesTableBody").addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-btn")) {
        // Delete the corresponding image from favorites
        let row = event.target.closest("tr");
        let dataCell = row.querySelector("td"); // Select the first td element in the row
        let cellContent = dataCell.textContent.trim(); // Get the text content and remove leading/trailing whitespace

        // Assuming the content is in the format: "Earth date: XXX, Sol: XXX, Camera: XXX"
        let earthDate = cellContent.split(",")[0].split(":")[1].trim(); // Extract Earth date
        let sol = cellContent.split(",")[1].split(":")[1].trim(); // Extract Sol
        let camera = cellContent.split(",")[2].split(":")[1].trim(); // Extract Camera

        let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        favorites = favorites.filter(photo => !(photo.earth_date === earthDate && photo.sol === sol && photo.camera.name === camera));
        localStorage.setItem("favorites", JSON.stringify(favorites));

        // Remove the row from the HTML table
        row.remove();

        //Remove favorites from local storage
        localStorage.removeItem("favorites");
    }
});

/**
 * Function to start the carousel
 */
function startCarousel() {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    // Clear existing carousel items
    const carouselInner = document.querySelector(".carousel-inner");
    carouselInner.innerHTML = "";

    // Create and append carousel items for each favorite image
    favorites.forEach((photo, index) => {
        const carouselItem = document.createElement("div");
        carouselItem.classList.add("carousel-item");

        // Set the first image as active
        if (index === 0) {
            carouselItem.classList.add("active");
        }

        // Image
        const imageContainer = document.createElement("div");
        imageContainer.classList.add("position-relative"); // Add position-relative class for positioning child elements
        carouselItem.appendChild(imageContainer);

        const image = document.createElement("img");
        image.src = photo.img_src;
        image.alt = `Mars Rover Image - Sol: ${photo.sol}, Camera: ${photo.camera.name}`;
        image.classList.add("d-block", "w-100", "img-fluid");
        imageContainer.appendChild(image);

        // Image caption
        const caption = document.createElement("div");
        caption.classList.add("carousel-caption", "text-center"); // Center align text within the caption
        imageContainer.appendChild(caption);

        const cameraName = document.createElement("h5");
        cameraName.textContent = `${photo.camera.name}`;
        caption.appendChild(cameraName);

        const earthDate = document.createElement("p");
        earthDate.textContent = `${photo.earth_date}`;
        caption.appendChild(earthDate);

        const viewButton = document.createElement("button");
        viewButton.textContent = "Full size";
        viewButton.classList.add("btn", "btn-primary", "btn-sm", "mt-2");
        viewButton.addEventListener("click", function () {
            openImageInSeparateWindow(photo.img_src);
        });
        caption.appendChild(viewButton);

        carouselInner.appendChild(carouselItem);
    });

    // Display the carousel
    const carousel = document.getElementById("carousel");
    carousel.style.display = "block";
}

// Add event listener to the Start Carousel button
document.getElementById("carouselStart").addEventListener("click", startCarousel);

/**
 * Function to stop the carousel
 */
function stopCarousel() {

    // Get the carousel element
    const carousel = document.getElementById("carousel");

    // Hide the carousel
    carousel.style.display = "none";
}

// Add event listener to the Stop Carousel button
document.getElementById("carouselStop").addEventListener("click", stopCarousel);

})();