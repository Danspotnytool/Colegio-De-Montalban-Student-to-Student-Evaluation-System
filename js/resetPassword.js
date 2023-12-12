
const resetForm = document.getElementById('loginForm');
const resetButton = document.getElementById('reset');

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
    resetForm.insertBefore(postscript, resetForm.children[resetForm.children.length - 1]);
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

        resetForm.insertBefore(postscript, resetForm.children[resetForm.children.length - 1]);
    };
});



resetButton.addEventListener('click', (e) => {
    e.preventDefault();
    const warning = document.getElementById('warning');
    if (warning) {
        warning.remove();
    };
    resetButton.disabled = true;

    const postscript = document.createElement('p');
    postscript.classList.add('postscript');
    postscript.id = 'warning';

    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');

    // Validate password
    // Password must be at least 8 characters long
    const passwordRegex1 = /^.{8,}$/;
    if (!passwordRegex1.test(password.value)) {
        postscript.textContent = 'Password must be at least 8 characters long';
        alertUser('Invalid', 'Password must be at least 8 characters long', 'warning');
        resetForm.insertBefore(postscript, resetForm.children[resetForm.children.length - 1]);
        return;
    };
    // Password must contain at least one uppercase letter
    const passwordRegex2 = /[A-Z]/;
    if (!passwordRegex2.test(password.value)) {
        postscript.textContent = 'Password must contain at least one uppercase letter';
        alertUser('Invalid', 'Password must contain at least one uppercase letter', 'warning');
        resetForm.insertBefore(postscript, resetForm.children[resetForm.children.length - 1]);
        return;
    };
    // Password must contain at least one lowercase letter
    const passwordRegex3 = /[a-z]/;
    if (!passwordRegex3.test(password.value)) {
        postscript.textContent = 'Password must contain at least one lowercase letter';
        alertUser('Invalid', 'Password must contain at least one lowercase letter', 'warning');
        resetForm.insertBefore(postscript, resetForm.children[resetForm.children.length - 1]);
        return;
    };
    // Password must contain at least one number
    const passwordRegex4 = /[0-9]/;
    if (!passwordRegex4.test(password.value)) {
        postscript.textContent = 'Password must contain at least one number';
        alertUser('Invalid', 'Password must contain at least one number', 'warning');
        resetForm.insertBefore(postscript, resetForm.children[resetForm.children.length - 1]);
        return;
    };
    // Password must contain at least one special character
    const passwordRegex5 = /[^a-zA-Z0-9]/;
    if (!passwordRegex5.test(password.value)) {
        postscript.textContent = 'Password must contain at least one special character';
        alertUser('Invalid', 'Password must contain at least one special character', 'warning');
        resetForm.insertBefore(postscript, resetForm.children[resetForm.children.length - 1]);
        return;
    };

    // Validate confirm password
    if (confirmPassword.value !== password.value) {
        postscript.textContent = 'Passwords do not match';
        alertUser('Invalid', 'Passwords do not match', 'warning');
        resetForm.insertBefore(postscript, resetForm.children[resetForm.children.length - 1]);
        return;
    };

    fetch('/api/passwordReset/reset.php', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify({
            'password': password.value,
            'confirmPassword': confirmPassword.value,
            'key': key,
            'studentNumber': student.studentNumber
        })
    })
        .then(response => response.text())
        .then((res) => {
            console.log(res);
            resetButton.disabled = false;
            /** @type {import("../utils/types.js").Response} */
            const response = JSON.parse(res);

            if (response.code === 200) {
                postscript.textContent = response.message;
                alertUser('Success', response.message, 'success', () => {
                    window.location.href = '/login.php';
                });
                resetForm.insertBefore(postscript, resetForm.children[resetForm.children.length - 1]);
                setTimeout(() => {
                    window.location.href = '/login.php';
                }, 2000);
            } else {
                postscript.textContent = response.message;
                alertUser('Error', response.message, 'warning');
                resetForm.insertBefore(postscript, resetForm.children[resetForm.children.length - 1]);
            };
        })
        .catch(error => {
            console.error('Error:', error);
            alertUser('Error', 'Something went wrong', 'error');
        });
});