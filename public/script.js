const usernameInput = document.getElementById('username-input');
const passwordInput = document.getElementById('password-input');
const form = document.getElementById('form');
const errorMsg = document.getElementById('error-message');

let errors = [];

form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent form submission by default

    // Run form validation
    errors = formValidation(usernameInput.value, passwordInput.value);
    if (errors.length > 0) {
        errorMsg.innerText = errors.join('. ');
        return; // Stop further execution if validation errors are present
    }

    try {
        // Make the POST request to login or register the user
        const result = await fetch('http://localhost:8000/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ studentId: usernameInput.value })
        });

        // Check if the request was successful
        if (!result.ok) {
            throw new Error('Login failed. Please try again.');
        }

        const resultData = await result.json();
        console.log(resultData.message); // Optional: log server response

        // Fetch user data to validate user ID
        // const userId = usernameInput.value;
        // const userId = resultData.ID;
        // console.log(resultData.ID)
        // const getId = await fetch(`http://localhost:8000/user/${userId}`, {
        //     method: 'GET',
        //     headers: { 'Content-Type': 'application/json' }
        // });

        // localStorage.setItem('userId', resultData.ID); //Storage userId to other JS files
        // if (!getId.ok) {
        //     throw new Error('Failed to fetch user data.');
        // }

        // const getIdData = await getId.json();

        // Uncomment and adjust the following if-else condition as needed
        // if (usernameInput.value !== getIdData.studentId) {
        //     alert("Student ID Not Correct");
        //     return;
        // }

        // Redirect on successful login and validation
        window.location.href = "homepage.html";

    } catch (error) {
        // Display error message if fetch or validation fails
        errorMsg.innerText = error.message;
    }
});

function formValidation(username, password) {
    let errors = [];

    if (username === '' || username == null) {
        errors.push('Username is required');
        usernameInput.parentElement.classList.add('incorrect');
    }

    if (password === '' || password == null) {
        errors.push('Password is required');
        passwordInput.parentElement.classList.add('incorrect');
    }

    return errors;
}

// Clear error styles when user starts typing
const allInputs = [usernameInput, passwordInput];
allInputs.forEach(input => {
    input.addEventListener('input', () => {
        if (input.parentElement.classList.contains('incorrect')) {
            input.parentElement.classList.remove('incorrect');
            errorMsg.innerText = '';
        }
    });
});
