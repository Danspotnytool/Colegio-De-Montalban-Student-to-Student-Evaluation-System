
const main = document.getElementById('main');

const profileAndEvaluationsButton = document.querySelector('.page[href="#profileAndEvaluations"]');
const submitAnEvaluationButton = document.querySelector('.page[href="#submitAnEvaluation"]');
const yourEvaluationsButton = document.querySelector('.page[href="#yourEvaluations"]');



const profileAndEvaluations = document.createElement('div');
profileAndEvaluations.id = 'profileAndEvaluations';
const submitAnEvaluation = document.createElement('div');
submitAnEvaluation.id = 'submitAnEvaluation';
const yourEvaluations = document.createElement('div');
yourEvaluations.id = 'yourEvaluations';



/** @type {import("../utils/types").Student[]} */
const studentsList = [];



/** @type {(click: Boolean, button: Element) => Void} */
const pagesButton = (click = true, button) => {
    main.innerHTML = '';
    profileAndEvaluationsButton.classList.remove('active');
    submitAnEvaluationButton.classList.remove('active');
    yourEvaluationsButton.classList.remove('active');
    // Get page
    const page = window.location.hash.substring(1);
    // Check if page is empty
    if (page == '') {
        // Set page to profileAndEvaluations
        window.location.hash = 'profileAndEvaluations';
        // Reload page
        location.reload();
    } else {
        // Check which page is active
        switch (page) {
            case 'profileAndEvaluations':
                if (click) {
                    profileAndEvaluationsButton.click();
                };
                if (!button) {
                    profileAndEvaluationsButton.classList.add('active');
                } else {
                    button.classList.add('active');
                };
                break;
            case 'submitAnEvaluation':
                if (click) {
                    submitAnEvaluationButton.click();
                };
                if (!button) {
                    submitAnEvaluationButton.classList.add('active');
                } else {
                    button.classList.add('active');
                };
                break;
            case 'yourEvaluations':
                if (click) {
                    yourEvaluationsButton.click();
                };
                if (!button) {
                    yourEvaluationsButton.classList.add('active');
                } else {
                    button.classList.add('active');
                };
                break;
            default:
                // Set page to profileAndEvaluations
                window.location.hash = 'profileAndEvaluations';
                // Reload page
                location.reload();
                break;
        };
    };
};



/** 
 * @type {(
 *      student: import("../utils/types").Student,
 *      buttons: {
 *              id: String,
 *              label: String,
 *              callback: (
 *                  student: import("../utils/types").Student,
 *                  buttonElement: Element
 *              ) => Void
 *      }[]
 * ) => Void}
 */
const displayStudent = (student, buttons) => {
    const studentInfo = document.createElement('div');
    studentInfo.classList.add('studentInfo');
    studentInfo.innerHTML = `
    <div id="profile">
        <img src="${student.profilePicture}" alt="Student Picture">

        <div id="form">
            <div class="row" id="fullName">
                <div class="textInput">
                    <label for="firstName">
                        <h6>First Name</h6>
                    </label>
                    <input readonly type="text" name="firstName" id="firstName" value="${student.firstName}">
                </div>

                <div class="textInput">
                    <label for="middleName">
                        <h6>Middle Name</h6>
                    </label>
                    <input type="text" name="middleName" id="middleName" value="${student.middleName}">
                </div>

                <div class="textInput">
                    <label for="lastName">
                        <h6>Last Name</h6>
                    </label>
                    <input readonly type="text" name="lastName" id="lastName" value="${student.lastName}">
                </div>
            </div>
            <div class="textInput">
                <label for="studentNumber">
                    <h6>Student Number</h6>
                </label>
                <input readonly type="text" name="studentNumber" id="studentNumber" value="${student.studentNumber}">
            </div>

            <div class="row">
                <div class="textInput">
                    <label for="gender">
                        <h6>Gender</h6>
                    </label>
                    <input readonly type="text" name="gender" id="gender" value="${student.gender}">
                </div>

                <div class="textInput">
                    <label for="birthday">
                        <h6>Birthday</h6>
                    </label>
                    <input readonly type="date" name="birthday" id="birthday" value="${(() => {
            const date = new Date(parseInt(student.birthday));
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
        })()}">
                </div>
            </div>

            <div class="row">
                <div class="textInput">
                    <label for="course">
                        <h6>Course</h6>
                    </label>
                    <input readonly type="text" name="course" id="course" value="${student.course}">
                </div>

                <div class="textInput">
                    <label for="yearAndSection">
                        <h6>Year and Section</h6>
                    </label>
                    <input readonly type="text" name="yearAndSection" id="yearAndSection" value="${student.year}${student.section}">
                </div>
            </div>

            <div class="textInput">
                <label for="emailAddress">
                    <h6>Email</h6>
                </label>
                <input readonly type="email" name="emailAddress" id="emailAddress" value="${student.email}">
            </div>
        </div>
    </div>

    ${buttons.length > 0 ? `<div id="action"></div>` : ''}`;

    document.getElementById('profile').appendChild(studentInfo);

    const action = document.querySelector(`.studentInfo:has( #studentNumber[ value="${student.studentNumber}"] ) #action`);
    for (const button of buttons) {
        const buttonElement = document.createElement('button');
        buttonElement.classList.add('button');
        buttonElement.id = button.id;
        buttonElement.innerHTML = `<p><b>${button.label}</b></p>`;
        buttonElement.addEventListener('click', () => {
            buttonElement.disabled = true;
            button.callback(student, buttonElement);
        });
        action.appendChild(buttonElement);
    };
};



profileAndEvaluationsButton.addEventListener('click', () => {
    pagesButton(false, profileAndEvaluationsButton);
    main.appendChild(profileAndEvaluations);

    main.innerHTML = `
        <div id="profileAndEvaluations">
            <div id="profile"></div>
            <div id="evaluations"></div>
        </div>
    `;


    fetch('/api/profileAndEvaluations/profile.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.text())
        .then(res => {
            console.log(res);
            /** @type {import("../utils/types").Response}*/
            const response = JSON.parse(res);
            displayStudent(response.payload, []);
        });
});
submitAnEvaluationButton.addEventListener('click', () => {
    pagesButton(false, submitAnEvaluationButton);
    main.appendChild(submitAnEvaluation);
});
yourEvaluationsButton.addEventListener('click', () => {
    pagesButton(false, yourEvaluationsButton);
    main.appendChild(yourEvaluations);
});



pagesButton(true);



window.addEventListener('scroll', (e) => {
});