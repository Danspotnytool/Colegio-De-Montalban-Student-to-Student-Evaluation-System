

/** @type {(title: String, message: String, level: 'alert' | 'warning' | 'success', callback: () => void) => Void} */
const alertUser = (title, message, level, callback) => {
    const alertCardBackground = document.createElement('div');
    alertCardBackground.classList.add('alertCardBackground');
    const alertCard = document.createElement('div');
    alertCard.classList.add('alert');
    if (level) {
        alertCard.classList.add('alert', level.toLocaleLowerCase());
    }
    alertCard.innerHTML = `
        <h3 class="title">${title}</h3>
        <p class="message">${message}</p>
        <div>
            <button type="submit" class="button" id="okay">
                <p><b>Okay</b></p>
            </button>
        </div>
    `;



    document.body.appendChild(alertCardBackground);
    document.body.appendChild(alertCard);

    /** @type {() => void} */
    const click = () => {
        alertCardBackground.remove();
        alertCard.remove();
        if (callback) {
            callback();
        };
    };

    document.querySelector(`.alert #okay`).addEventListener('click', () => {
        click();
    });
    alertCardBackground.addEventListener('click', () => {
        click();
    });


    setTimeout(() => {
        alertCardBackground.style.opacity = '0.5';
        alertCard.style.top = '50%';
    }, 10);
};
