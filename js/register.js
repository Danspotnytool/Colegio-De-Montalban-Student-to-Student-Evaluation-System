
const registerForm = document.getElementById('registerForm');
const registerButton = document.getElementById('register');

registerButton.addEventListener('click', (e) => {
    e.preventDefault();
    const warning = document.getElementById('warning');
    if (warning) {
        warning.remove();
    };
    registerButton.disabled = true;

    const formData = new FormData(registerForm);

    const postscript = document.createElement('p');
    postscript.classList.add('postscript');
    postscript.id = 'warning';

    // Check if all fields are filled
    const firstName = document.getElementById('firstName');
    const middleName = document.getElementById('middleName');
    const lastName = document.getElementById('lastName');
    const studentNumber = document.getElementById('studentNumber');
    const gender = document.getElementById('gender');
    const birthday = document.getElementById('birthday');
    const profilePicture = document.getElementById('profilePicture');
    const course = document.getElementById('course');
    const yearAndSection = document.getElementById('yearAndSection');
    const emailAddress = document.getElementById('emailAddress');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');

    if (
        firstName.value !== '' &&
        lastName.value !== '' &&
        studentNumber.value !== '' &&
        gender.value !== '' &&
        birthday.value !== '' &&
        !!profilePicture.files[0] &&
        emailAddress.value !== '' &&
        password.value !== '' &&
        confirmPassword.value !== ''
    ) { } else {
        postscript.textContent = 'Please fill out all fields';
        alertUser('Invalid', 'Please fill out all fields', 'warning');
        registerForm.insertBefore(postscript, registerForm.children[registerForm.children.length - 1]);
        registerButton.disabled = false;
        return;
    };

    if (password.value !== confirmPassword.value) {
        postscript.textContent = 'Passwords do not match';
        alertUser('Invalid', 'Passwords do not match', 'warning');
        registerForm.insertBefore(postscript, registerForm.children[registerForm.children.length - 1]);
        registerButton.disabled = false;
        return;
    };

    // Limit the size of the profilePicture to 2MB
    if (profilePicture.size > 2000000) {
        postscript.textContent = 'Profile picture is too large';
        alertUser('Invalid', 'Profile picture is too large', 'warning');
        registerForm.insertBefore(postscript, registerForm.children[registerForm.children.length - 1]);
        registerButton.disabled = false;
        return;
    };

    // Validate student number
    // Example: 20-00001
    const studentNumberRegex = /^[0-9]{2}-[0-9]{5}$/;
    if (!studentNumberRegex.test(studentNumber.value)) {
        postscript.textContent = 'Invalid student number';
        alertUser('Invalid', 'Invalid student number', 'warning');
        registerForm.insertBefore(postscript, registerForm.children[registerForm.children.length - 1]);
        registerButton.disabled = false;
        return;
    };

    // Validate gender
    // Example: "male" or "female" or ""
    if (
        gender.value !== 'male' &&
        gender.value !== 'female' &&
        gender.value !== ''
    ) {
        postscript.textContent = 'Invalid Gender';
        alertUser('Invalid', 'Invalid Gender', 'warning');
        registerForm.insertBefore(postscript, registerForm.children[registerForm.children.length - 1]);
        registerButton.disabled = false;
        return;
    };

    // Validate course
    // Example: "BSIT" or "BSCS" or "BSIT" or "BSCpE" or "BSEd-SCI" or "BEEd-GEN" or "BEEd-ECED" or "BTLEd-ICT" or "BSBA-HRM" or "BSE"
    if (
        course.value !== 'BSIT' &&
        course.value !== 'BSCS' &&
        course.value !== 'BSIT' &&
        course.value !== 'BSCpE' &&
        course.value !== 'BSEd-SCI' &&
        course.value !== 'BEEd-GEN' &&
        course.value !== 'BEEd-ECED' &&
        course.value !== 'BTLEd-ICT' &&
        course.value !== 'BSBA-HRM' &&
        course.value !== 'BSE'
    ) {
        postscript.textContent = 'Invalid Course';
        alertUser('Invalid', 'Invalid Course', 'warning');
        registerForm.insertBefore(postscript, registerForm.children[registerForm.children.length - 1]);
        registerButton.disabled = false;
        return;
    };

    // Validate birthday
    // Birthday is epoch time
    // Convert birthday to Date epoch
    const birthdayDate = new Date(birthday.value);
    const birthdayEpoch = birthdayDate.getTime();
    const birthdayRegex = /^[0-9]{10,30}$/;
    if (!birthdayRegex.test(birthdayEpoch)) {
        postscript.textContent = 'Invalid birthday';
        alertUser('Invalid', 'Invalid birthday', 'warning');
        registerForm.insertBefore(postscript, registerForm.children[registerForm.children.length - 1]);
        registerButton.disabled = false;
        return;
    };

    // Validate email address
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(emailAddress.value)) {
        postscript.textContent = 'Invalid email address';
        alertUser('Invalid', 'Invalid email address', 'warning');
        registerForm.insertBefore(postscript, registerForm.children[registerForm.children.length - 1]);
        registerButton.disabled = false;
        return;
    };

    // Validate year and section
    // Example: 1A
    const yearAndSectionRegex = /^[1-4][a-zA-Z]$/;
    if (!yearAndSectionRegex.test(yearAndSection.value)) {
        console.log('a');
        postscript.textContent = 'Invalid year and section';
        alertUser('Invalid', 'Invalid year and section', 'warning');
        registerForm.insertBefore(postscript, registerForm.children[registerForm.children.length - 1]);
        registerButton.disabled = false;
        return;
    };
    // Separate year and section
    const year = yearAndSection.value.split('')[0];
    const section = yearAndSection.value.split('')[1];

    // Validate password
    // Password must be at least 8 characters long
    const passwordRegex1 = /^.{8,}$/;
    if (!passwordRegex1.test(password.value)) {
        postscript.textContent = 'Password must be at least 8 characters long';
        alertUser('Invalid', 'Password must be at least 8 characters long', 'warning');
        registerForm.insertBefore(postscript, registerForm.children[registerForm.children.length - 1]);
        registerButton.disabled = false;
        return;
    };
    // Password must contain at least one uppercase letter
    const passwordRegex2 = /[A-Z]/;
    if (!passwordRegex2.test(password.value)) {
        postscript.textContent = 'Password must contain at least one uppercase letter';
        alertUser('Invalid', 'Password must contain at least one uppercase letter', 'warning');
        registerForm.insertBefore(postscript, registerForm.children[registerForm.children.length - 1]);
        registerButton.disabled = false;
        return;
    };
    // Password must contain at least one lowercase letter
    const passwordRegex3 = /[a-z]/;
    if (!passwordRegex3.test(password.value)) {
        postscript.textContent = 'Password must contain at least one lowercase letter';
        alertUser('Invalid', 'Password must contain at least one lowercase letter', 'warning');
        registerForm.insertBefore(postscript, registerForm.children[registerForm.children.length - 1]);
        registerButton.disabled = false;
        return;
    };
    // Password must contain at least one number
    const passwordRegex4 = /[0-9]/;
    if (!passwordRegex4.test(password.value)) {
        postscript.textContent = 'Password must contain at least one number';
        alertUser('Invalid', 'Password must contain at least one number', 'warning');
        registerForm.insertBefore(postscript, registerForm.children[registerForm.children.length - 1]);
        registerButton.disabled = false;
        return;
    };
    // Password must contain at least one special character
    const passwordRegex5 = /[^a-zA-Z0-9]/;
    if (!passwordRegex5.test(password.value)) {
        postscript.textContent = 'Password must contain at least one special character';
        alertUser('Invalid', 'Password must contain at least one special character', 'warning');
        registerForm.insertBefore(postscript, registerForm.children[registerForm.children.length - 1]);
        registerButton.disabled = false;
        return;
    };

    // Convert profilePicture to base64
    const reader = new FileReader();
    reader.readAsDataURL(profilePicture.files[0]);
    reader.onload = (result) => {
        const profilePictureBase64 = result.target.result;

        console.log(
            firstName.value,
            middleName.value,
            lastName.value,
            gender.value,
            studentNumber.value,
            birthdayEpoch,
            profilePictureBase64,
            course.value,
            year,
            section,
            emailAddress.value,
            password.value
        );
        // Send data to server
        fetch('/api/register.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName: firstName.value,
                middleName: middleName.value,
                lastName: lastName.value,
                gender: gender.value,
                studentNumber: studentNumber.value,
                birthday: birthdayEpoch,
                profilePicture: profilePictureBase64,
                course: course.value,
                year: year,
                section: section,
                emailAddress: emailAddress.value,
                password: password.value
            })
        })
            .then(response => response.text())
            .then((res) => {
                console.log(res);
                registerButton.disabled = false;
                /** @type {import("../utils/types.js").Response} */
                const response = JSON.parse(res);
                if (response.code === 200) {
                    window.location = '/login.php';
                } else {
                    postscript.textContent = response.message;
                    alertUser('Invalid', response.message, 'warning');
                    registerForm.insertBefore(postscript, registerForm.children[registerForm.children.length - 1]);
                };
            }).catch((error) => {
                postscript.textContent = error;
                alertUser('Invalid', error, 'warning');
                registerForm.insertBefore(postscript, registerForm.children[registerForm.children.length - 1]);
            });
    };
});



const profilePicture = document.getElementById('profilePicture');
profilePicture.addEventListener('change', () => {
    /** @type {String} */
    const filename = profilePicture.value.split('\\')[profilePicture.value.split('\\').length - 1];
    profilePicture.placeholder = `${filename.substring(0, 10)}...`;
});



const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');

password.addEventListener('keyup', (e) => {
    const warning = document.getElementById('warning');
    if (warning) {
        warning.remove();
    };
    const value = e.target.value;

    let postscriptContent = '';

    const postscript = document.createElement('p');
    postscript.classList.add('postscript');
    postscript.id = 'warning';

    // Validate password
    // Password must be at least 8 characters long
    const passwordRegex1 = /^.{8,}$/;
    if (!passwordRegex1.test(value)) {
        postscriptContent += 'Password must be at least 8 characters long<br>';
    };
    // Password must contain at least one uppercase letter
    const passwordRegex2 = /[A-Z]/;
    if (!passwordRegex2.test(value)) {
        postscriptContent += 'Password must contain at least one uppercase letter<br>';
    };
    // Password must contain at least one lowercase letter
    const passwordRegex3 = /[a-z]/;
    if (!passwordRegex3.test(value)) {
        postscriptContent += 'Password must contain at least one lowercase letter<br>';
    };
    // Password must contain at least one number
    const passwordRegex4 = /[0-9]/;
    if (!passwordRegex4.test(value)) {
        postscriptContent += 'Password must contain at least one number<br>';
    };
    // Password must contain at least one special character
    const passwordRegex5 = /[^a-zA-Z0-9]/;
    if (!passwordRegex5.test(value)) {
        postscriptContent += 'Password must contain at least one special character<br>';
    };
    postscript.innerHTML = postscriptContent;
    registerForm.insertBefore(postscript, registerForm.children[registerForm.children.length - 1]);
});

confirmPassword.addEventListener('keyup', (e) => {
    const warning = document.getElementById('warning');
    if (warning) {
        warning.remove();
    };
    const value = e.target.value;
    if (value !== password.value) {
        const postscript = document.createElement('p');
        postscript.classList.add('postscript');
        postscript.id = 'warning';

        postscript.textContent = 'Passwords do not match';

        registerForm.insertBefore(postscript, registerForm.children[registerForm.children.length - 1]);
    };
});