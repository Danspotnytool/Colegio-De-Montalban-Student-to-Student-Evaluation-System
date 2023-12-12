
const resetForm = document.getElementById('loginForm');
const resetButton = document.getElementById('reset');

resetButton.addEventListener('click', (e) => {
    e.preventDefault();
    const warning = document.getElementById('warning');
    if (warning) {
        warning.remove();
    };

    resetButton.disabled = true;

    const studentNumber = document.getElementById('studentNumber').value;
    const email = document.getElementById('emailAddress').value;

    const postscript = document.createElement('p');
    postscript.classList.add('postscript');
    postscript.id = 'warning';

    if (studentNumber && email) {
        fetch('/api/passwordReset/request.php', {
            method: 'POST',
            body: JSON.stringify({
                email,
                studentNumber
            }),
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.text())
            .then((res) => {
                console.log(res);
                resetButton.disabled = false;
                /** @type {Response} */
                const response = JSON.parse(res);
                if (response.code === 200) {
                    postscript.textContent = response.message;
                    alertUser('Success', 'Passwort reset request has been sent to your email', 'success');
                    resetForm.insertBefore(postscript, resetForm.children[resetForm.children.length - 1]);
                } else {
                    postscript.textContent = response.message;
                    alertUser('Error', response.message, 'warning');
                    resetForm.insertBefore(postscript, resetForm.children[resetForm.children.length - 1]);
                };
            });
    } else {
        resetButton.disabled = false;
        postscript.textContent = 'Invalid Student Number or Password';
        alertUser('Invalid', 'Invalid Student Number or Password', 'warning');
        resetForm.insertBefore(postscript, resetForm.children[resetForm.children.length - 1]);
    };
});