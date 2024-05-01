const UserRegistration = (function () {
    // Internal data structure to store users
    let users = [];

    /**
     * Function to validate first name
     * @param firstName
     * @returns {boolean}
     */
    function isValidFirstName(firstName){
        //Regular expression for validating a First Name
        const firstNameRegex = /^[a-z]+$/;
        return firstNameRegex.test(firstName);
    }

    /**
     * Function to validate last name
     * @param lastName
     * @returns {boolean}
     */
    function isValidLastName(lastName){
        //Regular expression for validating a last Name
        const lastNameRegex = /^[a-z]+$/;
        return lastNameRegex.test(lastName);
    }

    /**
     * Function to validate email address
     * @param email
     * @returns {boolean}
     */
    function isValidEmail(email) {
        // Regular expression for validating an Email ending with .ac.il
        const emailRegex = /^[a-zA-Z0-9._-]+@([a-zA-Z0-9-]+\.)+ac\.il$/;
        return emailRegex.test(email);
    }

    /**
     * Function to validate password
     * @param password
     * @returns {boolean}
     */
    function isValidPassword(password) {
        // Password must have at least one uppercase letter, one lowercase letter, one digit, and minimum eight
        // characters
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return passwordRegex.test(password);
    }

    /**
     * Function to validate date of birth
     * @param dob
     * @returns {boolean}
     */
    function isValidDOB(dob) {
        // Basic check for a valid date and age over 18
        const userDOB = new Date(dob);
        const currentDate = new Date();
        const age = currentDate.getFullYear() - userDOB.getFullYear();

        return age >= 18 && !isNaN(userDOB.getTime());
    }

    /**
     * Function to display error message
     * @param inputId
     * @param errorMessage
     */
    function displayError(inputId, errorMessage) {
        const errorElement = document.getElementById(`${inputId}Error`);
        errorElement.textContent = errorMessage;
    }

    /**
     * Function to clear error messages
     */

    function clearErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach((element) => (element.textContent = ''));
    }

    /**
     * Function to validate and process step 1 input
     */
    function validateStep1() {
        clearErrors();

        // Retrieve values from step 1
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();

        // Validation checks
        let valid = true;

        if (!isValidFirstName(firstName)) {
            displayError('firstName', 'Invalid First Name');
            valid = false;
        }

        if (!isValidLastName(lastName)) {
            displayError('lastName', 'Invalid Last Name');
            valid = false;
        }

        if (!isValidEmail(email)) {
            displayError('email', `Invalid email`);
            valid = false;
        }

        // Check if the email already exists
        if (userExists(email)) {
            displayError('email', 'Email already exists');
            valid = false;
        }

        // If validation passed, proceed to step 2
        if (valid) {
            document.getElementById('step1').style.display = 'none';
            document.getElementById('step2').style.display = 'block';
        }
    }

    /**
     * Function to navigate back to step 1
     */
    function backToStep1() {
        document.getElementById('step2').style.display = 'none';
        document.getElementById('step1').style.display = 'block';
    }

    /**
     * Function to validate and save user information
     */
    function saveUser() {
        clearErrors();

        // Retrieve values from step 2
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const dob = document.getElementById('dob').value;
        const gender = document.getElementById('gender').value;
        const comments = document.getElementById('comments').value.trim();

        // Validation checks
        let valid = true;

        if (!isValidPassword(password)) {
            displayError('password', 'Invalid password');
            valid = false;
        }

        if (password !== confirmPassword) {
            displayError('confirmPassword', 'Passwords do not match');
            valid = false;
        }

        if (!isValidDOB(dob)) {
            displayError('dob', 'Invalid date of birth');
            valid = false;
        }

        // If validation passed, add user to the list
        if (valid) {
            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            const email = document.getElementById('email').value.trim();

            const newUser = {
                firstName,
                lastName,
                email,
                password,
                dob,
                gender,
                comments,
            };

            users.push(newUser);

            // Display the updated user list
            displayUserList();

            // Reset input fields
            document.getElementById('step1Form').reset();
            document.getElementById('step2Form').reset();

            // Navigate back to step 1
            backToStep1();
        }
    }

    /**
     * Function to check if the email exists
     * @param email
     * @returns {boolean}
     */
    function userExists(email) {
        return users.some(user => user.email === email);
    }

    /**
     * Function to display the user list
     */
    function displayUserList() {
        const userListBody = document.getElementById('userListBody');
        userListBody.innerHTML = '';

        // Sort users by last name
        users.sort((a, b) => a.lastName.localeCompare(b.lastName));

        // Display users in the table
        users.forEach((user) => {
            const row = document.createElement('tr');
            const columns = ['firstName','lastName', 'email', 'password', 'dob', 'gender', 'comments'];

            columns.forEach((column) => {
                const cell = document.createElement('td');
                cell.textContent = user[column];
                row.appendChild(cell);
            });

            userListBody.appendChild(row);
        });
    }

    // Public API
    return {
        validateStep1,
        backToStep1,
        saveUser,
    };
})();


// Event listeners
document.getElementById('nextButton').addEventListener('click', UserRegistration.validateStep1);
document.getElementById('previousButton').addEventListener('click', UserRegistration.backToStep1);
document.getElementById('saveButton').addEventListener('click', UserRegistration.saveUser);
