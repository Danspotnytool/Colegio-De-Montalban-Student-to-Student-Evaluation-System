
const loginForm = document.getElementById('loginForm');
const loginButton = document.getElementById('login');

loginButton.addEventListener('click', (e) => {
    e.preventDefault();
    const warning = document.getElementById('warning');
    if (warning) {
        warning.remove();
    };

    loginButton.disabled = true;

    const studentNumber = document.getElementById('studentNumber').value;
    const password = document.getElementById('password').value;

    const postscript = document.createElement('p');
    postscript.classList.add('postscript');
    postscript.id = 'warning';

    if (studentNumber && password) {
        fetch('/api/login.php', {
            method: 'POST',
            body: JSON.stringify({
                studentNumber,
                password,
            }),
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.text())
            .then((res) => {
                console.log(res);
                loginButton.disabled = false;
                /** @type {import("../utils/types.js").Response} */
                const response = JSON.parse(res);

                if (response.code === 200) {
                    document.cookie = `token=${response.payload.token}; path=/`;
                    window.location.reload();
                } else {
                    postscript.textContent = response.message;
                    alertUser('Error', response.message, 'warning');
                    loginForm.insertBefore(postscript, loginForm.children[loginForm.children.length - 1]);
                };
            }).catch((error) => {
                console.log(error);
                loginButton.disabled = false;
                postscript.textContent = error;
                alertUser('Error', error, 'warning');
                loginForm.insertBefore(postscript, loginForm.children[loginForm.children.length - 1]);
            });
    } else {
        loginButton.disabled = false;
        postscript.textContent = 'Invalid Student Number or Password';
        alertUser('Invalid', 'Invalid Student Number or Password', 'warning');
        loginForm.insertBefore(postscript, loginForm.children[loginForm.children.length - 1]);
    };
});