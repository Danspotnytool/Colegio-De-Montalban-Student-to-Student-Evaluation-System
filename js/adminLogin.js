
const loginForm = document.getElementById('loginForm');
const loginButton = document.getElementById('login');

loginButton.addEventListener('click', (e) => {
    e.preventDefault();
    const warning = document.getElementById('warning');
    if (warning) {
        warning.remove();
    };

    const adminID = document.getElementById('adminID').value;
    const adminKey = document.getElementById('adminKey').value;

    const postscript = document.createElement('p');
    postscript.classList.add('postscript');
    postscript.id = 'warning';

    if (adminID && adminKey) {
        fetch('/api/adminLogin.php', {
            method: 'POST',
            body: JSON.stringify({
                adminID,
                adminKey,
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
                    const postscript = document.createElement('p');
                    postscript.classList.add('postscript');
                    postscript.textContent = response.message;
                    loginForm.insertBefore(postscript, loginForm.children[loginForm.children.length - 1]);
                };
            }).catch((error) => {
                postscript.textContent = error;
                loginForm.insertBefore(postscript, loginForm.children[loginForm.children.length - 1]);
            });
    } else {
        postscript.textContent = 'Invalid Admin ID or Admin Key';
        loginForm.insertBefore(postscript, loginForm.children[loginForm.children.length - 1]);
    };
});