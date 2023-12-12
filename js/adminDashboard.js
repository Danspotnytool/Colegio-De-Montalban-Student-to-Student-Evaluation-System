
const main = document.getElementById('main');

const allEvaluationsButton = document.querySelector('.page[href="#allEvaluations"]');
const allStudentsButton = document.querySelector('.page[href="#allStudents"]');
const registrationQueueButton = document.querySelector('.page[href="#registrationQueue"]');
const systemLogsButton = document.querySelector('.page[href="#systemLogs"]');



const allEvaluations = document.createElement('div');
allEvaluations.id = 'allEvaluations';
const allStudents = document.createElement('div');
allStudents.id = 'allStudents';
const registrationQueue = document.createElement('div');
registrationQueue.id = 'registrationQueue';
const systemLogs = document.createElement('div');
systemLogs.id = 'systemLogs';



/** @type {import("../utils/types").Student[]} */
const studentsList = [];
/** @type {import("../utils/types").Evaluation[]} */
const evaluationsList = [];
/** @type {import("../utils/types").SystemLogs[]} */
const systemLogsList = [];



/** @type {(click: Boolean, button: Element) => Void} */
const pagesButton = (click = true, button) => {
    main.innerHTML = '';
    allEvaluationsButton.classList.remove('active');
    allStudentsButton.classList.remove('active');
    registrationQueueButton.classList.remove('active');
    systemLogsButton.classList.remove('active');

    // Get page
    const page = window.location.hash.substring(1);
    // Check if page is empty
    if (page == '') {
        // Set page to allEvaluations
        window.location.hash = 'allEvaluations';
        // Reload page
        location.reload();
    } else {
        // Check which page is active
        switch (page) {
            case 'allEvaluations':
                if (click) {
                    allEvaluationsButton.click();
                };
                if (!button) {
                    allEvaluationsButton.classList.add('active');
                } else {
                    button.classList.add('active');
                };
                break;
            case 'allStudents':
                if (click) {
                    allStudentsButton.click();
                };
                if (!button) {
                    allStudentsButton.classList.add('active');
                } else {
                    button.classList.add('active');
                };
                break;
            case 'registrationQueue':
                if (click) {
                    registrationQueueButton.click();
                };
                if (!button) {
                    registrationQueueButton.classList.add('active');
                } else {
                    button.classList.add('active');
                };
                break;
            case 'systemLogs':
                if (click) {
                    systemLogsButton.click();
                };
                if (!button) {
                    systemLogsButton.classList.add('active');
                } else {
                    button.classList.add('active');
                };
                break;
            default:
                // Set page to allEvaluations
                window.location.hash = 'allEvaluations';
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
                    <input readonly type="text" name="middleName" id="middleName" value="${student.middleName}">
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

    document.getElementById('students').appendChild(studentInfo);
    console.log(studentInfo);
    const action = studentInfo.querySelector('#action');
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



/**
 * @type {(evaluation: import("../utils/types").Evaluation, parent: Element) => Void}
 */
const displayEvaluation = (evaluation, parent) => {
    console.log(evaluation);
    const evaluationElement = document.createElement('div');
    evaluationElement.classList.add('evaluation');
    evaluationElement.classList.add('withSender');
    evaluationElement.innerHTML = `
    <div class="date">
        <h5>${(() => {
            const date = new Date(parseInt(evaluation.timeAdded * 1000));
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const monthNames = [
                'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
                'October', 'November', 'December'
            ];
            return `${monthNames[month - 1]} ${day}, ${year}`;
        })()}</h5>
    </div>
    ${(() => {
            if (evaluation.receiverName) {
                return `
                    <div class="users">
                        <h6><span style="font-family: unset;">From:</span> <span style="font-family: unset;">${evaluation.senderName} (${evaluation.senderStudentNumber})</span></h6>
                        <h6><span style="font-family: unset;">To:</span> <span style="font-family: unset;">${evaluation.receiverName} (${evaluation.receiverStudentNumber})</span></h6>
                    </div>
                `;
            };
        })()}
    <div class="criteria">
        ${(() => {
            const categories = [];
            for (const content of evaluation.contents) {
                if (!categories.includes(content.category)) {
                    categories.push(content.category);
                };
            };

            let html = '';

            for (const category of categories) {
                html += `
                <div>
                    <h2>${category}</h2>
                `;
                for (const content of evaluation.contents) {
                    if (content.category == category) {
                        html += `
                        <div class="criterion">
                            <h6>${content.name}</h6>
                            <h6>${content.value}</h6>
                        </div>
                        `;
                    };
                };
                html += `
                </div>
                `;
            };
            return html;
        })()}
        </div>
    </div>
    <div class="additionalStatement">
        <p>${evaluation.additionalStatement}</p>
    </div>`;
    parent.appendChild(evaluationElement);
};



allEvaluationsButton.addEventListener('click', () => {
    pagesButton(false, allEvaluationsButton);
    main.appendChild(allEvaluations);

    allEvaluations.innerHTML = `
    <h2 style="width: 100%; text-align: center;">All Evaluations</h2>
    <div id="header">
        <div class="textInput" style="color: unset;">
            <label for="student">
                <h6>Search</h6>
            </label>
            <input type="text" name="student" id="student" placeholder="Student" onKeypress="(() => {
                if (event.keyCode === 3|| event.code === 'Enter') {
                    document.getElementById('search').click();
                };
            })();">
        </div>
        <div>
            <button class="button" onclick="(() => {
                event.srcElement.disabled = true;
            })();" id="search">
                <p><b>Search</b></p>
            </button>
        </div>
    </div>

    <div id="evaluations"></div>`;


    document.getElementById('search').addEventListener('click', () => {
        fetch(`/api/allEvaluations/search.php?search=${document.getElementById('student').value}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.text())
            .then(res => {
                console.log(res);
                document.getElementById('search').disabled = false;
                /** @type {import("../utils/types").Response}*/
                const response = JSON.parse(res);

                if (response.code == 200) {
                    if (response.payload.length == 0) {
                        alertUser('404', 'No evaluations found.', 'alert');
                        return;
                    };
                    document.getElementById('evaluations').innerHTML = '';
                    for (const evaluation of response.payload) {
                        evaluation.contents = JSON.parse(evaluation.contents);
                        displayEvaluation(evaluation, document.getElementById('evaluations'));
                        evaluationsList.push(evaluation);
                    };
                }
            }).catch(error => {
                console.log(error);
                alertUser('Error', 'An error occured while fetching the registrants.', 'alert');
            });
    });

    evaluationsList.length = 0;

    fetch('/api/allEvaluations/retrieve.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.text())
        .then(res => {
            console.log(res);
            /** @type {import("../utils/types").Response}*/
            const response = JSON.parse(res);
            if (response.status == 'success') {
                if (response.payload.length == 0) {
                    alertUser('404', 'No more evaluations found.', 'alert');
                    return;
                };
                for (const evaluation of response.payload) {
                    evaluation.contents = JSON.parse(evaluation.contents);
                    displayEvaluation(evaluation, document.querySelector('#main > #allEvaluations > #evaluations'));
                    evaluationsList.push(evaluation);
                };
            } else {
                alertUser('Error', response.message, 'alert');
            };
        });
});
allStudentsButton.addEventListener('click', () => {
    pagesButton(false, allStudentsButton);
    main.appendChild(allStudents);

    allStudents.innerHTML = `
    <h2 style="width: 100%; text-align: center;">All Students</h2>
    <div id="header">
        <div class="textInput" style="color: unset;">
            <label for="student">
                <h6>Search</h6>
            </label>
            <input type="text" name="student" id="student" placeholder="Student" onKeypress="(() => {
                if (event.keyCode === 3|| event.code === 'Enter') {
                    document.getElementById('search').click();
                };
            })();">
        </div>
        <div>
            <button class="button" onclick="(() => {
                event.srcElement.disabled = true;
            })();" id="search">
                <p><b>Search</b></p>
            </button>
        </div>
    </div>

    <div id="students"></div>`;


    document.getElementById('search').addEventListener('click', () => {
        document.getElementById('search').disabled = false;
        fetch(`/api/allStudents/search.php?search=${document.getElementById('student').value}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.text())
            .then(res => {
                console.log(res);
                document.getElementById('search').disabled = false;
                /** @type {import("../utils/types").Response}*/
                const response = JSON.parse(res);

                if (response.code == 200) {
                    document.getElementById('students').innerHTML = '';
                    for (const student of response.payload) {
                        studentsList.length = 0;
                        studentsList.push(student);
                        document.getElementById('students').innerHTML = '';
                        displayStudent(student, [
                            {
                                id: 'summon',
                                label: 'Summon',
                                callback: (student, buttonElement) => { }
                            },
                            {
                                id: 'editProfile',
                                label: 'Edit',
                                callback: (student, buttonElement) => {
                                    buttonElement.disabled = false;
                                    const studentInfo = buttonElement.parentElement.parentElement;
                                    const profile = studentInfo.querySelector('#profile');
                                    const profileImage = profile.querySelector('img');
                                    const profileForm = profile.querySelector('#form');
                                    const genderInput = profileForm.querySelector('.row > .textInput:has(#gender)');
                                    const courseInput = profileForm.querySelector('.row > .textInput:has(#course)');

                                    const profileContainer = document.createElement('div');
                                    profileContainer.id = 'profileContainer';
                                    profileContainer.appendChild(profileImage);
                                    profileContainer.innerHTML += `
                                        <div class="textInput fileInput" style="width: 24rem;">
                                            <label for="profilePicture">
                                                <h6>Profile Picture</h6>
                                            </label>
                                            <input required type="file" name="profilePicture" accept="image/png, image/gif, image/jpeg" id="profilePicture" placeholder="Upload">
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9.33438 0.660937C9.05495 1.02344 8.05495 2.31875 7.11303 3.53906L5.40031 5.75781L7.12402 5.76563C8.83517 5.77344 8.84615 5.77344 8.84301 5.80469C8.83988 5.82188 8.83203 5.88125 8.82261 5.9375C8.81162 6.00625 8.80691 7.21094 8.81005 9.71875C8.81633 13.7359 8.80848 13.4203 8.9011 13.6406C9.16327 14.2594 9.91366 14.5094 10.5133 14.1797C10.5808 14.1422 10.6703 14.0703 10.7567 13.9844C10.8697 13.8719 10.9042 13.8234 10.9639 13.7016C11.0942 13.4344 11.0848 13.7781 11.0785 9.60156C11.0754 7.55625 11.0675 5.85625 11.0597 5.825L11.0487 5.76563L14.2889 5.75781L13.3485 4.53906C12.8305 3.86875 11.8305 2.57344 11.1256 1.66094L9.84458 0L9.33438 0.660937Z" fill="var(--color-secondary)" />
                                                <path d="M0 20H20V8.34375H13.5479V10.4063H17.5196V17.9375H2.48038V10.4063H6.76609L6.76295 9.37813L6.75824 8.35156L0 8.34375V20Z" fill="var(--color-secondary)" />
                                            </svg>
                                        </div>
                                    `;
                                    const profileInput = profileContainer.querySelector('.textInput.fileInput > #profilePicture');
                                    profileInput.addEventListener('change', () => {
                                        /** @type {String} */
                                        const filename = profileInput.value.split('\\')[profileInput.value.split('\\').length - 1];
                                        profileInput.placeholder = `${filename.substring(0, 10)}...`;

                                        // Convert profilePicture to base64
                                        const reader = new FileReader();
                                        reader.readAsDataURL(profilePicture.files[0]);
                                        reader.onload = (result) => {
                                            const profilePictureBase64 = result.target.result;
                                            profileContainer.querySelector('img').remove();
                                            const newProfileImage = document.createElement('img');
                                            newProfileImage.src = profilePictureBase64;
                                            newProfileImage.alt = 'Student Picture';
                                            profileContainer.insertBefore(newProfileImage, profileContainer.querySelector('.textInput.fileInput'));
                                        };
                                    });
                                    profile.insertBefore(profileContainer, profileForm);

                                    genderInput.classList.add('dropdown');
                                    genderInput.classList.remove('textInput');
                                    genderInput.innerHTML = `
                                        <label for="gender">
                                            <h6>Gender</h6>
                                        </label>
        
                                        <select required name="gender" id="gender">
                                            <option value="male"${student.gender === 'male' ? ' selected' : ''}>Male</option>
                                            <option value="female"${student.gender === 'female' ? ' selected' : ''}>Female</option>
                                            <option value=""${student.gender === '' ? ' selected' : ''}>Prefer not to say</option>
                                        </select>
                                        <svg width="20" height="15" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10 15.5L0 5.5V0.5L10 10.5L20 0.5V5.5L10 15.5Z" fill="var(--color-secondary)" />
                                        </svg>
                                    `;
                                    let genderValue = student.gender;
                                    genderInput.querySelector('select').addEventListener('change', (e) => {
                                        genderValue = e.target.value;
                                    });

                                    courseInput.classList.add('dropdown');
                                    courseInput.classList.remove('textInput');
                                    courseInput.innerHTML = `
                                        <label for="course">
                                            <h6>Course</h6>
                                        </label>
        
                                        <select required name="course" id="course">
                                            <option value="BSIT"${student.course.toLocaleLowerCase() === 'BSIT'.toLocaleLowerCase()
                                            ? ' selected' : ''}>Bachelor of Science in Information Technoloty</option>
                                            <option value="BSCpE"${student.course.toLocaleLowerCase() === 'BSCpE'.toLocaleLowerCase()
                                            ? ' selected' : ''}>Bachelor of Science in Computer Engineering</option>
                
                                            <option value="BSEd-SCI"${student.course.toLocaleLowerCase() === 'BSEd-SCI'.toLocaleLowerCase()
                                            ? ' selected' : ''}>Bachelor of Secondary Education major in Science</option>
                                            <option value="BEEd-GEN"${student.course.toLocaleLowerCase() === 'BEEd-GEN'.toLocaleLowerCase()
                                            ? ' selected' : ''}>Bachelor of Elementary Education - Generalist</option>
                                            <option value="BEEd-ECED"${student.course.toLocaleLowerCase() === 'BEEd-ECED'.toLocaleLowerCase()
                                            ? ' selected' : ''}>Bachelor of Early Childhood Education</option>
                                            <option value="BTLEd-ICT"${student.course.toLocaleLowerCase() === 'BTLEd-ICT'.toLocaleLowerCase()
                                            ? ' selected' : ''}>Bachelor of Technology and Livelihood Education major in Information and Communication Technology</option>
                
                                            <option value="BSBA-HRM"${student.course.toLocaleLowerCase() === 'BSBA-HRM'.toLocaleLowerCase()
                                            ? ' selected' : ''}>Bachelor of Science in Business Administration Major in Human Resource Management</option>
                                            <option value="BSE"${student.course.toLocaleLowerCase() === 'BSE'.toLocaleLowerCase()
                                            ? ' selected' : ''
                                        }>Bachelor of Science in Entrepreneurship</option>
                                        </select>
                                        <svg width="20" height="15" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10 15.5L0 5.5V0.5L10 10.5L20 0.5V5.5L10 15.5Z" fill="var(--color-secondary)" />
                                        </svg>
                                    `;
                                    let courseValue = student.course;
                                    courseInput.querySelector('select').addEventListener('change', (e) => {
                                        courseValue = e.target.value;
                                    });

                                    for (const input of Array.from(studentInfo.querySelectorAll('#profile > #form input'))) {
                                        input.placeholder = input.value;
                                        input.readOnly = false;
                                    };
                                    const removedButtons = [];
                                    for (const button of Array.from(studentInfo.querySelectorAll('#action .button'))) {
                                        removedButtons.push(button);
                                        button.remove();
                                    };
                                    const saveButton = document.createElement('button');
                                    saveButton.classList.add('button');
                                    saveButton.innerHTML = `<p><b>Save</b></p>`;

                                    saveButton.addEventListener('click', () => {
                                        saveButton.disabled = true;
                                        // Check if all inputs are filled
                                        let allFilled = true;
                                        for (const input of Array.from(studentInfo.querySelectorAll('#profile > #form input'))) {
                                            if (input.id != 'middleName' && input.id != 'gender' && input.value == '') {
                                                allFilled = false;
                                                saveButton.disabled = false;
                                                break;
                                            };
                                        };
                                        if (!allFilled) {
                                            alertUser('Error', 'Please fill all the fields.', 'alert');
                                            saveButton.disabled = false;
                                            return;
                                        };



                                        const studentNumberRegex = /^[0-9]{2}-[0-9]{5}$/;
                                        if (!studentNumberRegex.test(studentInfo.querySelector('#profile > #form input#studentNumber').value)) {
                                            alertUser('Error', 'Please enter a valid student number.', 'alert');
                                            saveButton.disabled = false;
                                            return;
                                        };

                                        // Validate year and section
                                        // Example: 1A
                                        const yearAndSectionRegex = /^[1-4][A-Z]$/;
                                        if (!yearAndSectionRegex.test(studentInfo.querySelector('#profile > #form input#yearAndSection').value)) {
                                            alertUser('Invalid', 'Invalid year and section', 'warning');
                                            saveButton.disabled = false;
                                            return;
                                        };
                                        // Separate year and section
                                        const year = studentInfo.querySelector('#profile > #form input#yearAndSection').value.split('')[0];
                                        const section = studentInfo.querySelector('#profile > #form input#yearAndSection').value.split('')[1];

                                        // Validate email
                                        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
                                        if (!emailRegex.test(studentInfo.querySelector('#profile > #form input#emailAddress').value)) {
                                            alertUser('Invalid', 'Invalid email address', 'warning');
                                            saveButton.disabled = false;
                                            return;
                                        };

                                        // Validate birthday
                                        const birthdayDate = new Date(studentInfo.querySelector('#profile > #form input#birthday').value);
                                        const birthdayEpoch = birthdayDate.getTime();
                                        const birthdayRegex = /^[0-9]{10,30}$/;
                                        if (!birthdayRegex.test(birthdayEpoch)) {
                                            alertUser('Invalid', 'Invalid birthday', 'warning');
                                            saveButton.disabled = false;
                                            return;
                                        };



                                        // Convert base64 to blob
                                        const profilePictureBase64 = profileContainer.querySelector('img').src;
                                        const profilePictureBase64Length = profilePictureBase64.length - 'data:image/png;base64,'.length;
                                        const profilePictureBase64Bytes = Math.ceil((profilePictureBase64Length / 3)) * 0.5624896334383812;
                                        // Limit the size of the profilePicture to 2MB
                                        if (profilePictureBase64Bytes > 2000000) {
                                            alertUser('Invalid', 'Profile picture is too large', 'warning');
                                            saveButton.disabled = false;
                                            return;
                                        };



                                        fetch('/api/allStudents/edit.php', {
                                            method: 'UPDATE',
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify({
                                                studentNumber: student.studentNumber,
                                                firstName: studentInfo.querySelector('#profile > #form input#firstName').value,
                                                middleName: studentInfo.querySelector('#profile > #form input#middleName').value,
                                                lastName: studentInfo.querySelector('#profile > #form input#lastName').value,
                                                studentNumber: studentInfo.querySelector('#profile > #form input#studentNumber').value,
                                                gender: genderValue,
                                                birthday: birthdayEpoch,
                                                profilePicture: profilePictureBase64,
                                                course: courseValue,
                                                year: year,
                                                section: section,
                                                emailAddress: studentInfo.querySelector('#profile > #form input#emailAddress').value
                                            })
                                        }).then(response => response.text())
                                            .then(res => {
                                                console.log(res);
                                                saveButton.disabled = false;
                                                /** @type {import("../utils/types").Response}*/
                                                const response = JSON.parse(res);
                                                if (response.code == 200) {
                                                    cancelButton.click();
                                                    alertUser('Success', response.message, 'success');

                                                    const studentInfo = document.querySelector(`.studentInfo:has( #studentNumber[ value="${student.studentNumber}"] )`);

                                                    studentInfo.querySelector('#profile > #form input#firstName').placeholder = response.payload.firstName;
                                                    studentInfo.querySelector('#profile > #form input#firstName').value = response.payload.firstName;
                                                    studentInfo.querySelector('#profile > #form input#middleName').placeholder = response.payload.middleName;
                                                    studentInfo.querySelector('#profile > #form input#middleName').value = response.payload.middleName;
                                                    studentInfo.querySelector('#profile > #form input#lastName').placeholder = response.payload.lastName;
                                                    studentInfo.querySelector('#profile > #form input#lastName').value = response.payload.lastName;
                                                    studentInfo.querySelector('#profile > #form input#studentNumber').placeholder = response.payload.studentNumber;
                                                    studentInfo.querySelector('#profile > #form input#studentNumber').value = response.payload.studentNumber;
                                                    studentInfo.querySelector('#profile > #form input#gender').placeholder = response.payload.gender;
                                                    studentInfo.querySelector('#profile > #form input#birthday').placeholder = response.payload.birthday;
                                                    studentInfo.querySelector('#profile > #form input#birthday').value = `${(() => {
                                                        const date = new Date(parseInt(response.payload.birthday));
                                                        const year = date.getFullYear();
                                                        const month = date.getMonth() + 1;
                                                        const day = date.getDate();
                                                        return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
                                                    })()}`;
                                                    studentInfo.querySelector('#profile > #form input#course').placeholder = response.payload.course;
                                                    studentInfo.querySelector('#profile > #form input#yearAndSection').placeholder = `${response.payload.year}${response.payload.section}`;
                                                    studentInfo.querySelector('#profile > #form input#yearAndSection').value = `${response.payload.year}${response.payload.section}`;
                                                    studentInfo.querySelector('#profile > #form input#emailAddress').placeholder = response.payload.emailAddress;
                                                    studentInfo.querySelector('#profile > #form input#emailAddress').value = response.payload.emailAddress;
                                                } else {
                                                    alertUser('Error', response.message, 'alert');
                                                };
                                            }).catch(error => {
                                                console.log(error);
                                                saveButton.disabled = false;
                                                alertUser('Error', 'An error occured while editing.', 'alert');
                                            });
                                    });

                                    studentInfo.querySelector('#action').appendChild(saveButton);

                                    const cancelButton = document.createElement('button');
                                    cancelButton.classList.add('button');
                                    cancelButton.innerHTML = `<p><b>Cancel</b></p>`;

                                    cancelButton.addEventListener('click', () => {
                                        for (const input of Array.from(studentInfo.querySelectorAll('#profile > #form input'))) {
                                            input.value = input.placeholder;
                                            input.readOnly = true;
                                        };
                                        for (const button of removedButtons) {
                                            studentInfo.querySelector('#action').appendChild(button);
                                        };

                                        const profile = studentInfo.querySelector('#profile');
                                        const profileImage = profile.querySelector('#profileContainer > img');
                                        console.log(profile);
                                        console.log(profileImage);
                                        profile.insertBefore(profileImage, profile.querySelector('#form'));
                                        profile.querySelector('#profileContainer').remove();

                                        genderInput.classList.remove('dropdown');
                                        genderInput.classList.add('textInput');
                                        genderInput.innerHTML = `
                                            <label for="gender">
                                                <h6>Gender</h6>
                                            </label>
                                            <input readonly type="text" name="gender" id="gender" value="${student.gender}">
                                        `;
                                        courseInput.classList.remove('dropdown');
                                        courseInput.classList.add('textInput');
                                        courseInput.innerHTML = `
                                            <label for="course">
                                                <h6>Course</h6>
                                            </label>
                                            <input readonly type="text" name="course" id="course" value="${student.course}">
                                        `;
                                        saveButton.remove();
                                        cancelButton.remove();
                                    });

                                    studentInfo.querySelector('#action').appendChild(cancelButton);
                                }
                            },
                            {
                                id: 'generateStatisticalReport',
                                label: 'Generate Statistical Report',
                                callback: (student, buttonElement) => { }
                            },
                        ]);
                    };
                }
            }).catch(error => {
                console.log(error);
                alertUser('Error', 'An error occured while fetching the students.', 'alert');
            });
    });



    fetch('/api/allStudents/retrieve.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.text())
        .then(res => {
            /** @type {import("../utils/types").Response}*/
            const response = JSON.parse(res);

            for (const student of response.payload) {
                studentsList.push(student);
                console.log(studentsList);
                displayStudent(student, [
                    {
                        id: 'summon',
                        label: 'Summon',
                        callback: (student, buttonElement) => {
                            buttonElement.disabled = true;
                            fetch('/api/allStudents/summon.php', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    studentNumber: student.studentNumber
                                })
                            }).then(response => response.text())
                                .then(res => {
                                    console.log(res);
                                    buttonElement.disabled = false;
                                    /** @type {import("../utils/types").Response}*/
                                    const response = JSON.parse(res);
                                    if (response.code == 200) {
                                        alertUser('Success', response.message, 'success');
                                    } else {
                                        alertUser('Error', response.message, 'alert');
                                    };
                                }).catch(error => {
                                    console.log(error);
                                    alertUser('Error', 'An error occured while summoning the student.', 'alert');
                                });
                        }
                    },
                    {
                        id: 'editProfile',
                        label: 'Edit',
                        callback: (student, buttonElement) => {
                            buttonElement.disabled = false;
                            const studentInfo = buttonElement.parentElement.parentElement;
                            const profile = studentInfo.querySelector('#profile');
                            const profileImage = profile.querySelector('img');
                            const profileForm = profile.querySelector('#form');
                            const genderInput = profileForm.querySelector('.row > .textInput:has(#gender)');
                            const courseInput = profileForm.querySelector('.row > .textInput:has(#course)');

                            const profileContainer = document.createElement('div');
                            profileContainer.id = 'profileContainer';
                            profileContainer.appendChild(profileImage);
                            profileContainer.innerHTML += `
                                <div class="textInput fileInput" style="width: 24rem;">
                                    <label for="profilePicture">
                                        <h6>Profile Picture</h6>
                                    </label>
                                    <input required type="file" name="profilePicture" accept="image/png, image/gif, image/jpeg" id="profilePicture" placeholder="Upload">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.33438 0.660937C9.05495 1.02344 8.05495 2.31875 7.11303 3.53906L5.40031 5.75781L7.12402 5.76563C8.83517 5.77344 8.84615 5.77344 8.84301 5.80469C8.83988 5.82188 8.83203 5.88125 8.82261 5.9375C8.81162 6.00625 8.80691 7.21094 8.81005 9.71875C8.81633 13.7359 8.80848 13.4203 8.9011 13.6406C9.16327 14.2594 9.91366 14.5094 10.5133 14.1797C10.5808 14.1422 10.6703 14.0703 10.7567 13.9844C10.8697 13.8719 10.9042 13.8234 10.9639 13.7016C11.0942 13.4344 11.0848 13.7781 11.0785 9.60156C11.0754 7.55625 11.0675 5.85625 11.0597 5.825L11.0487 5.76563L14.2889 5.75781L13.3485 4.53906C12.8305 3.86875 11.8305 2.57344 11.1256 1.66094L9.84458 0L9.33438 0.660937Z" fill="var(--color-secondary)" />
                                        <path d="M0 20H20V8.34375H13.5479V10.4063H17.5196V17.9375H2.48038V10.4063H6.76609L6.76295 9.37813L6.75824 8.35156L0 8.34375V20Z" fill="var(--color-secondary)" />
                                    </svg>
                                </div>
                            `;
                            const profileInput = profileContainer.querySelector('.textInput.fileInput > #profilePicture');
                            profileInput.addEventListener('change', () => {
                                /** @type {String} */
                                const filename = profileInput.value.split('\\')[profileInput.value.split('\\').length - 1];
                                profileInput.placeholder = `${filename.substring(0, 10)}...`;

                                // Convert profilePicture to base64
                                const reader = new FileReader();
                                reader.readAsDataURL(profilePicture.files[0]);
                                reader.onload = (result) => {
                                    const profilePictureBase64 = result.target.result;
                                    profileContainer.querySelector('img').remove();
                                    const newProfileImage = document.createElement('img');
                                    newProfileImage.src = profilePictureBase64;
                                    newProfileImage.alt = 'Student Picture';
                                    profileContainer.insertBefore(newProfileImage, profileContainer.querySelector('.textInput.fileInput'));
                                };
                            });
                            profile.insertBefore(profileContainer, profileForm);

                            genderInput.classList.add('dropdown');
                            genderInput.classList.remove('textInput');
                            genderInput.innerHTML = `
                                <label for="gender">
                                    <h6>Gender</h6>
                                </label>

                                <select required name="gender" id="gender">
                                    <option value="male"${student.gender === 'male' ? ' selected' : ''}>Male</option>
                                    <option value="female"${student.gender === 'female' ? ' selected' : ''}>Female</option>
                                    <option value=""${student.gender === '' ? ' selected' : ''}>Prefer not to say</option>
                                </select>
                                <svg width="20" height="15" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 15.5L0 5.5V0.5L10 10.5L20 0.5V5.5L10 15.5Z" fill="var(--color-secondary)" />
                                </svg>
                            `;
                            let genderValue = student.gender;
                            genderInput.querySelector('select').addEventListener('change', (e) => {
                                genderValue = e.target.value;
                            });

                            courseInput.classList.add('dropdown');
                            courseInput.classList.remove('textInput');
                            courseInput.innerHTML = `
                                <label for="course">
                                    <h6>Course</h6>
                                </label>

                                <select required name="course" id="course">
                                    <option value="BSIT"${student.course.toLocaleLowerCase() === 'BSIT'.toLocaleLowerCase()
                                    ? ' selected' : ''}>Bachelor of Science in Information Technoloty</option>
                                    <option value="BSCpE"${student.course.toLocaleLowerCase() === 'BSCpE'.toLocaleLowerCase()
                                    ? ' selected' : ''}>Bachelor of Science in Computer Engineering</option>
        
                                    <option value="BSEd-SCI"${student.course.toLocaleLowerCase() === 'BSEd-SCI'.toLocaleLowerCase()
                                    ? ' selected' : ''}>Bachelor of Secondary Education major in Science</option>
                                    <option value="BEEd-GEN"${student.course.toLocaleLowerCase() === 'BEEd-GEN'.toLocaleLowerCase()
                                    ? ' selected' : ''}>Bachelor of Elementary Education - Generalist</option>
                                    <option value="BEEd-ECED"${student.course.toLocaleLowerCase() === 'BEEd-ECED'.toLocaleLowerCase()
                                    ? ' selected' : ''}>Bachelor of Early Childhood Education</option>
                                    <option value="BTLEd-ICT"${student.course.toLocaleLowerCase() === 'BTLEd-ICT'.toLocaleLowerCase()
                                    ? ' selected' : ''}>Bachelor of Technology and Livelihood Education major in Information and Communication Technology</option>
        
                                    <option value="BSBA-HRM"${student.course.toLocaleLowerCase() === 'BSBA-HRM'.toLocaleLowerCase()
                                    ? ' selected' : ''}>Bachelor of Science in Business Administration Major in Human Resource Management</option>
                                    <option value="BSE"${student.course.toLocaleLowerCase() === 'BSE'.toLocaleLowerCase()
                                    ? ' selected' : ''
                                }>Bachelor of Science in Entrepreneurship</option>
                                </select>
                                <svg width="20" height="15" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 15.5L0 5.5V0.5L10 10.5L20 0.5V5.5L10 15.5Z" fill="var(--color-secondary)" />
                                </svg>
                            `;
                            let courseValue = student.course;
                            courseInput.querySelector('select').addEventListener('change', (e) => {
                                courseValue = e.target.value;
                            });

                            for (const input of Array.from(studentInfo.querySelectorAll('#profile > #form input'))) {
                                input.placeholder = input.value;
                                input.readOnly = false;
                            };
                            const removedButtons = [];
                            for (const button of Array.from(studentInfo.querySelectorAll('#action .button'))) {
                                removedButtons.push(button);
                                button.remove();
                            };
                            const saveButton = document.createElement('button');
                            saveButton.classList.add('button');
                            saveButton.innerHTML = `<p><b>Save</b></p>`;

                            saveButton.addEventListener('click', () => {
                                saveButton.disabled = true;
                                // Check if all inputs are filled
                                let allFilled = true;
                                for (const input of Array.from(studentInfo.querySelectorAll('#profile > #form input'))) {
                                    if (input.id != 'middleName' && input.id != 'gender' && input.value == '') {
                                        allFilled = false;
                                        saveButton.disabled = false;
                                        break;
                                    };
                                };
                                if (!allFilled) {
                                    alertUser('Error', 'Please fill all the fields.', 'alert');
                                    saveButton.disabled = false;
                                    return;
                                };



                                const studentNumberRegex = /^[0-9]{2}-[0-9]{5}$/;
                                if (!studentNumberRegex.test(studentInfo.querySelector('#profile > #form input#studentNumber').value)) {
                                    alertUser('Error', 'Please enter a valid student number.', 'alert');
                                    saveButton.disabled = false;
                                    return;
                                };

                                // Validate year and section
                                // Example: 1A
                                const yearAndSectionRegex = /^[1-4][A-Z]$/;
                                if (!yearAndSectionRegex.test(studentInfo.querySelector('#profile > #form input#yearAndSection').value)) {
                                    alertUser('Invalid', 'Invalid year and section', 'warning');
                                    saveButton.disabled = false;
                                    return;
                                };
                                // Separate year and section
                                const year = studentInfo.querySelector('#profile > #form input#yearAndSection').value.split('')[0];
                                const section = studentInfo.querySelector('#profile > #form input#yearAndSection').value.split('')[1];

                                // Validate email
                                const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
                                if (!emailRegex.test(studentInfo.querySelector('#profile > #form input#emailAddress').value)) {
                                    alertUser('Invalid', 'Invalid email address', 'warning');
                                    saveButton.disabled = false;
                                    return;
                                };

                                // Validate birthday
                                const birthdayDate = new Date(studentInfo.querySelector('#profile > #form input#birthday').value);
                                const birthdayEpoch = birthdayDate.getTime();
                                const birthdayRegex = /^[0-9]{10,30}$/;
                                if (!birthdayRegex.test(birthdayEpoch)) {
                                    alertUser('Invalid', 'Invalid birthday', 'warning');
                                    saveButton.disabled = false;
                                    return;
                                };



                                // Convert base64 to blob
                                const profilePictureBase64 = profileContainer.querySelector('img').src;
                                const profilePictureBase64Length = profilePictureBase64.length - 'data:image/png;base64,'.length;
                                const profilePictureBase64Bytes = Math.ceil((profilePictureBase64Length / 3)) * 0.5624896334383812;
                                // Limit the size of the profilePicture to 2MB
                                if (profilePictureBase64Bytes > 2000000) {
                                    alertUser('Invalid', 'Profile picture is too large', 'warning');
                                    saveButton.disabled = false;
                                    return;
                                };



                                fetch('/api/allStudents/edit.php', {
                                    method: 'UPDATE',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        studentNumber: student.studentNumber,
                                        firstName: studentInfo.querySelector('#profile > #form input#firstName').value,
                                        middleName: studentInfo.querySelector('#profile > #form input#middleName').value,
                                        lastName: studentInfo.querySelector('#profile > #form input#lastName').value,
                                        studentNumber: studentInfo.querySelector('#profile > #form input#studentNumber').value,
                                        gender: genderValue,
                                        birthday: birthdayEpoch,
                                        profilePicture: profilePictureBase64,
                                        course: courseValue,
                                        year: year,
                                        section: section,
                                        emailAddress: studentInfo.querySelector('#profile > #form input#emailAddress').value
                                    })
                                }).then(response => response.text())
                                    .then(res => {
                                        console.log(res);
                                        saveButton.disabled = false;
                                        /** @type {import("../utils/types").Response}*/
                                        const response = JSON.parse(res);
                                        if (response.code == 200) {
                                            cancelButton.click();
                                            alertUser('Success', response.message, 'success');

                                            const studentInfo = document.querySelector(`.studentInfo:has( #studentNumber[ value="${student.studentNumber}"] )`);

                                            studentInfo.querySelector('#profile > #form input#firstName').placeholder = response.payload.firstName;
                                            studentInfo.querySelector('#profile > #form input#firstName').value = response.payload.firstName;
                                            studentInfo.querySelector('#profile > #form input#middleName').placeholder = response.payload.middleName;
                                            studentInfo.querySelector('#profile > #form input#middleName').value = response.payload.middleName;
                                            studentInfo.querySelector('#profile > #form input#lastName').placeholder = response.payload.lastName;
                                            studentInfo.querySelector('#profile > #form input#lastName').value = response.payload.lastName;
                                            studentInfo.querySelector('#profile > #form input#studentNumber').placeholder = response.payload.studentNumber;
                                            studentInfo.querySelector('#profile > #form input#studentNumber').value = response.payload.studentNumber;
                                            studentInfo.querySelector('#profile > #form input#gender').placeholder = response.payload.gender;
                                            studentInfo.querySelector('#profile > #form input#birthday').placeholder = response.payload.birthday;
                                            studentInfo.querySelector('#profile > #form input#birthday').value = `${(() => {
                                                const date = new Date(parseInt(response.payload.birthday));
                                                const year = date.getFullYear();
                                                const month = date.getMonth() + 1;
                                                const day = date.getDate();
                                                return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
                                            })()}`;
                                            studentInfo.querySelector('#profile > #form input#course').placeholder = response.payload.course;
                                            studentInfo.querySelector('#profile > #form input#yearAndSection').placeholder = `${response.payload.year}${response.payload.section}`;
                                            studentInfo.querySelector('#profile > #form input#yearAndSection').value = `${response.payload.year}${response.payload.section}`;
                                            studentInfo.querySelector('#profile > #form input#emailAddress').placeholder = response.payload.emailAddress;
                                            studentInfo.querySelector('#profile > #form input#emailAddress').value = response.payload.emailAddress;
                                        } else {
                                            alertUser('Error', response.message, 'alert');
                                        };
                                    }).catch(error => {
                                        console.log(error);
                                        saveButton.disabled = false;
                                        alertUser('Error', 'An error occured while editing.', 'alert');
                                    });
                            });

                            studentInfo.querySelector('#action').appendChild(saveButton);

                            const cancelButton = document.createElement('button');
                            cancelButton.classList.add('button');
                            cancelButton.innerHTML = `<p><b>Cancel</b></p>`;

                            cancelButton.addEventListener('click', () => {
                                for (const input of Array.from(studentInfo.querySelectorAll('#profile > #form input'))) {
                                    input.value = input.placeholder;
                                    input.readOnly = true;
                                };
                                for (const button of removedButtons) {
                                    studentInfo.querySelector('#action').appendChild(button);
                                };

                                const profile = studentInfo.querySelector('#profile');
                                const profileImage = profile.querySelector('#profileContainer > img');
                                console.log(profile);
                                console.log(profileImage);
                                profile.insertBefore(profileImage, profile.querySelector('#form'));
                                profile.querySelector('#profileContainer').remove();

                                genderInput.classList.remove('dropdown');
                                genderInput.classList.add('textInput');
                                genderInput.innerHTML = `
                                    <label for="gender">
                                        <h6>Gender</h6>
                                    </label>
                                    <input readonly type="text" name="gender" id="gender" value="${student.gender}">
                                `;
                                courseInput.classList.remove('dropdown');
                                courseInput.classList.add('textInput');
                                courseInput.innerHTML = `
                                    <label for="course">
                                        <h6>Course</h6>
                                    </label>
                                    <input readonly type="text" name="course" id="course" value="${student.course}">
                                `;
                                saveButton.remove();
                                cancelButton.remove();
                            });

                            studentInfo.querySelector('#action').appendChild(cancelButton);
                        }
                    },
                    {
                        id: 'generateStatisticalReport',
                        label: 'Generate Statistical Report',
                        callback: (student, buttonElement) => {
                            buttonElement.disabled = true;

                            fetch('/api/allStudents/generateReport.php', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    studentNumber: student.studentNumber
                                })
                            }).then(response => response.blob())
                                .then(blob => {
                                    buttonElement.disabled = false;
                                    const url = window.URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.target = '_blank';
                                    a.download = `${student.firstName} ${student.lastName} (${student.studentNumber})- Statistical Report.pdf`
                                    document.body.appendChild(a);
                                    a.click();
                                    a.remove();
                                    alertUser('Success', 'Report generated successfully.', 'success');
                                });
                        }
                    },
                ]);
            };
        }).catch(error => {
            console.log(error);
            alertUser('Error', 'An error occured while fetching the registrants.', 'alert');
        });
});
registrationQueueButton.addEventListener('click', () => {
    pagesButton(false, registrationQueueButton);
    main.appendChild(registrationQueue);

    registrationQueue.innerHTML = `
    <h2 style="width: 100%; text-align: center;">Registration Queue</h2>
    <div id="header">
        <div class="textInput" style="color: unset;">
            <label for="student">
                <h6>Search</h6>
            </label>
            <input type="text" name="student" id="student" placeholder="Student" onKeypress="(() => {
                console.log(event);
                if (event.keyCode === 3|| event.code === 'Enter') {
                    document.getElementById('search').click();
                };
            })();">
        </div>
        <div>
            <button class="button" onclick="(() => {
                event.srcElement.disabled = true;
            })();" id="search">
                <p><b>Search</b></p>
            </button>
        </div>
    </div>

    <div id="students"></div>`;


    document.getElementById('search').addEventListener('click', () => {
        fetch(`/api/registrationQueue/search.php?search=${document.getElementById('student').value}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.text())
            .then(res => {
                console.log(res);
                document.getElementById('search').disabled = false;
                /** @type {import("../utils/types").Response}*/
                const response = JSON.parse(res);

                if (response.code == 200) {
                    document.getElementById('students').innerHTML = '';
                    for (const student of response.payload) {
                        studentsList.length = 0;
                        studentsList.push(student);
                        document.getElementById('students').innerHTML = '';
                        displayStudent(student, [
                            {
                                id: 'accept',
                                label: 'Accept',
                                callback: (student) => {
                                    fetch('/api/registrationQueue/accept.php', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({
                                            studentNumber: student.studentNumber
                                        })
                                    }).then(response => response.text())
                                        .then(res => {
                                            /** @type {import("../utils/types").Response}*/
                                            const response = JSON.parse(res);
                                            if (response.code == 200) {
                                                alertUser('Success', response.message, 'success', () => {
                                                    document.querySelector(`.studentInfo:has( #studentNumber[ value="${student.studentNumber}"] )`).remove();
                                                    studentsList.splice(studentsList.indexOf(student), 1);
                                                });
                                            } else {
                                                alertUser('Error', response.message, 'alert');
                                            };
                                        }).catch(error => {
                                            console.log(error);
                                            alertUser('Error', 'An error occured while accepting.', 'alert');
                                        });
                                }
                            },
                            {
                                id: 'askForMoreInformation',
                                label: 'Ask for more information',
                                callback: (student, buttonElement) => {
                                    fetch('/api/registrationQueue/ask.php', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({
                                            studentNumber: student.studentNumber
                                        })
                                    }).then(response => response.text())
                                        .then(res => {
                                            buttonElement.disabled = false;
                                            /** @type {import("../utils/types").Response}*/
                                            const response = JSON.parse(res);
                                            if (response.code == 200) {
                                                alertUser('Success', response.message, 'success');
                                            } else {
                                                alertUser('Error', response.message, 'alert');
                                            };
                                        }).catch(error => {
                                            console.log(error);
                                            alertUser('Error', 'An error occured while asking for more information.', 'alert');
                                        });
                                }
                            },
                            {
                                id: 'editProfile',
                                label: 'Edit',
                                callback: (student, buttonElement) => {
                                    buttonElement.disabled = false;
                                    const studentInfo = buttonElement.parentElement.parentElement;
                                    const profile = studentInfo.querySelector('#profile');
                                    const profileImage = profile.querySelector('img');
                                    const profileForm = profile.querySelector('#form');
                                    const genderInput = profileForm.querySelector('.row > .textInput:has(#gender)');
                                    const courseInput = profileForm.querySelector('.row > .textInput:has(#course)');

                                    const profileContainer = document.createElement('div');
                                    profileContainer.id = 'profileContainer';
                                    profileContainer.appendChild(profileImage);
                                    profileContainer.innerHTML += `
                                        <div class="textInput fileInput" style="width: 24rem;">
                                            <label for="profilePicture">
                                                <h6>Profile Picture</h6>
                                            </label>
                                            <input required type="file" name="profilePicture" accept="image/png, image/gif, image/jpeg" id="profilePicture" placeholder="Upload">
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9.33438 0.660937C9.05495 1.02344 8.05495 2.31875 7.11303 3.53906L5.40031 5.75781L7.12402 5.76563C8.83517 5.77344 8.84615 5.77344 8.84301 5.80469C8.83988 5.82188 8.83203 5.88125 8.82261 5.9375C8.81162 6.00625 8.80691 7.21094 8.81005 9.71875C8.81633 13.7359 8.80848 13.4203 8.9011 13.6406C9.16327 14.2594 9.91366 14.5094 10.5133 14.1797C10.5808 14.1422 10.6703 14.0703 10.7567 13.9844C10.8697 13.8719 10.9042 13.8234 10.9639 13.7016C11.0942 13.4344 11.0848 13.7781 11.0785 9.60156C11.0754 7.55625 11.0675 5.85625 11.0597 5.825L11.0487 5.76563L14.2889 5.75781L13.3485 4.53906C12.8305 3.86875 11.8305 2.57344 11.1256 1.66094L9.84458 0L9.33438 0.660937Z" fill="var(--color-secondary)" />
                                                <path d="M0 20H20V8.34375H13.5479V10.4063H17.5196V17.9375H2.48038V10.4063H6.76609L6.76295 9.37813L6.75824 8.35156L0 8.34375V20Z" fill="var(--color-secondary)" />
                                            </svg>
                                        </div>
                                    `;
                                    const profileInput = profileContainer.querySelector('.textInput.fileInput > #profilePicture');
                                    profileInput.addEventListener('change', () => {
                                        /** @type {String} */
                                        const filename = profileInput.value.split('\\')[profileInput.value.split('\\').length - 1];
                                        profileInput.placeholder = `${filename.substring(0, 10)}...`;

                                        // Convert profilePicture to base64
                                        const reader = new FileReader();
                                        reader.readAsDataURL(profilePicture.files[0]);
                                        reader.onload = (result) => {
                                            const profilePictureBase64 = result.target.result;
                                            profileContainer.querySelector('img').remove();
                                            const newProfileImage = document.createElement('img');
                                            newProfileImage.src = profilePictureBase64;
                                            newProfileImage.alt = 'Student Picture';
                                            profileContainer.insertBefore(newProfileImage, profileContainer.querySelector('.textInput.fileInput'));
                                        };
                                    });
                                    profile.insertBefore(profileContainer, profileForm);

                                    genderInput.classList.add('dropdown');
                                    genderInput.classList.remove('textInput');
                                    genderInput.innerHTML = `
                                        <label for="gender">
                                            <h6>Gender</h6>
                                        </label>
        
                                        <select required name="gender" id="gender">
                                            <option value="male"${student.gender === 'male' ? ' selected' : ''}>Male</option>
                                            <option value="female"${student.gender === 'female' ? ' selected' : ''}>Female</option>
                                            <option value=""${student.gender === '' ? ' selected' : ''}>Prefer not to say</option>
                                        </select>
                                        <svg width="20" height="15" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10 15.5L0 5.5V0.5L10 10.5L20 0.5V5.5L10 15.5Z" fill="var(--color-secondary)" />
                                        </svg>
                                    `;
                                    let genderValue = student.gender;
                                    genderInput.querySelector('select').addEventListener('change', (e) => {
                                        genderValue = e.target.value;
                                    });

                                    courseInput.classList.add('dropdown');
                                    courseInput.classList.remove('textInput');
                                    courseInput.innerHTML = `
                                        <label for="course">
                                            <h6>Course</h6>
                                        </label>
        
                                        <select required name="course" id="course">
                                            <option value="BSIT"${student.course.toLocaleLowerCase() === 'BSIT'.toLocaleLowerCase()
                                            ? ' selected' : ''}>Bachelor of Science in Information Technoloty</option>
                                            <option value="BSCpE"${student.course.toLocaleLowerCase() === 'BSCpE'.toLocaleLowerCase()
                                            ? ' selected' : ''}>Bachelor of Science in Computer Engineering</option>
                
                                            <option value="BSEd-SCI"${student.course.toLocaleLowerCase() === 'BSEd-SCI'.toLocaleLowerCase()
                                            ? ' selected' : ''}>Bachelor of Secondary Education major in Science</option>
                                            <option value="BEEd-GEN"${student.course.toLocaleLowerCase() === 'BEEd-GEN'.toLocaleLowerCase()
                                            ? ' selected' : ''}>Bachelor of Elementary Education - Generalist</option>
                                            <option value="BEEd-ECED"${student.course.toLocaleLowerCase() === 'BEEd-ECED'.toLocaleLowerCase()
                                            ? ' selected' : ''}>Bachelor of Early Childhood Education</option>
                                            <option value="BTLEd-ICT"${student.course.toLocaleLowerCase() === 'BTLEd-ICT'.toLocaleLowerCase()
                                            ? ' selected' : ''}>Bachelor of Technology and Livelihood Education major in Information and Communication Technology</option>
                
                                            <option value="BSBA-HRM"${student.course.toLocaleLowerCase() === 'BSBA-HRM'.toLocaleLowerCase()
                                            ? ' selected' : ''}>Bachelor of Science in Business Administration Major in Human Resource Management</option>
                                            <option value="BSE"${student.course.toLocaleLowerCase() === 'BSE'.toLocaleLowerCase()
                                            ? ' selected' : ''
                                        }>Bachelor of Science in Entrepreneurship</option>
                                        </select>
                                        <svg width="20" height="15" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10 15.5L0 5.5V0.5L10 10.5L20 0.5V5.5L10 15.5Z" fill="var(--color-secondary)" />
                                        </svg>
                                    `;
                                    let courseValue = student.course;
                                    courseInput.querySelector('select').addEventListener('change', (e) => {
                                        courseValue = e.target.value;
                                    });

                                    for (const input of Array.from(studentInfo.querySelectorAll('#profile > #form input'))) {
                                        input.placeholder = input.value;
                                        input.readOnly = false;
                                    };
                                    const removedButtons = [];
                                    for (const button of Array.from(studentInfo.querySelectorAll('#action .button'))) {
                                        removedButtons.push(button);
                                        button.remove();
                                    };
                                    const saveButton = document.createElement('button');
                                    saveButton.classList.add('button');
                                    saveButton.innerHTML = `<p><b>Save</b></p>`;

                                    saveButton.addEventListener('click', () => {
                                        saveButton.disabled = true;
                                        // Check if all inputs are filled
                                        let allFilled = true;
                                        for (const input of Array.from(studentInfo.querySelectorAll('#profile > #form input'))) {
                                            if (input.id != 'middleName' && input.id != 'gender' && input.value == '') {
                                                allFilled = false;
                                                saveButton.disabled = false;
                                                break;
                                            };
                                        };
                                        if (!allFilled) {
                                            alertUser('Error', 'Please fill all the fields.', 'alert');
                                            saveButton.disabled = false;
                                            return;
                                        };



                                        const studentNumberRegex = /^[0-9]{2}-[0-9]{5}$/;
                                        if (!studentNumberRegex.test(studentInfo.querySelector('#profile > #form input#studentNumber').value)) {
                                            alertUser('Error', 'Please enter a valid student number.', 'alert');
                                            saveButton.disabled = false;
                                            return;
                                        };

                                        // Validate year and section
                                        // Example: 1A
                                        const yearAndSectionRegex = /^[1-4][A-Z]$/;
                                        if (!yearAndSectionRegex.test(studentInfo.querySelector('#profile > #form input#yearAndSection').value)) {
                                            alertUser('Invalid', 'Invalid year and section', 'warning');
                                            saveButton.disabled = false;
                                            return;
                                        };
                                        // Separate year and section
                                        const year = studentInfo.querySelector('#profile > #form input#yearAndSection').value.split('')[0];
                                        const section = studentInfo.querySelector('#profile > #form input#yearAndSection').value.split('')[1];

                                        // Validate email
                                        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
                                        if (!emailRegex.test(studentInfo.querySelector('#profile > #form input#emailAddress').value)) {
                                            alertUser('Invalid', 'Invalid email address', 'warning');
                                            saveButton.disabled = false;
                                            return;
                                        };

                                        // Validate birthday
                                        const birthdayDate = new Date(studentInfo.querySelector('#profile > #form input#birthday').value);
                                        const birthdayEpoch = birthdayDate.getTime();
                                        const birthdayRegex = /^[0-9]{10,30}$/;
                                        if (!birthdayRegex.test(birthdayEpoch)) {
                                            alertUser('Invalid', 'Invalid birthday', 'warning');
                                            saveButton.disabled = false;
                                            return;
                                        };



                                        // Convert base64 to blob
                                        const profilePictureBase64 = profileContainer.querySelector('img').src;
                                        const profilePictureBase64Length = profilePictureBase64.length - 'data:image/png;base64,'.length;
                                        const profilePictureBase64Bytes = Math.ceil((profilePictureBase64Length / 3)) * 0.5624896334383812;
                                        // Limit the size of the profilePicture to 2MB
                                        if (profilePictureBase64Bytes > 2000000) {
                                            alertUser('Invalid', 'Profile picture is too large', 'warning');
                                            saveButton.disabled = false;
                                            return;
                                        };



                                        fetch('/api/registrationQueue/edit.php', {
                                            method: 'UPDATE',
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify({
                                                studentNumber: student.studentNumber,
                                                firstName: studentInfo.querySelector('#profile > #form input#firstName').value,
                                                middleName: studentInfo.querySelector('#profile > #form input#middleName').value,
                                                lastName: studentInfo.querySelector('#profile > #form input#lastName').value,
                                                studentNumber: studentInfo.querySelector('#profile > #form input#studentNumber').value,
                                                gender: genderValue,
                                                birthday: birthdayEpoch,
                                                profilePicture: profilePictureBase64,
                                                course: courseValue,
                                                year: year,
                                                section: section,
                                                emailAddress: studentInfo.querySelector('#profile > #form input#emailAddress').value
                                            })
                                        }).then(response => response.text())
                                            .then(res => {
                                                console.log(res);
                                                saveButton.disabled = false;
                                                /** @type {import("../utils/types").Response}*/
                                                const response = JSON.parse(res);
                                                if (response.code == 200) {
                                                    cancelButton.click();
                                                    alertUser('Success', response.message, 'success');

                                                    const studentInfo = document.querySelector(`.studentInfo:has( #studentNumber[ value="${student.studentNumber}"] )`);

                                                    studentInfo.querySelector('#profile > #form input#firstName').placeholder = response.payload.firstName;
                                                    studentInfo.querySelector('#profile > #form input#firstName').value = response.payload.firstName;
                                                    studentInfo.querySelector('#profile > #form input#middleName').placeholder = response.payload.middleName;
                                                    studentInfo.querySelector('#profile > #form input#middleName').value = response.payload.middleName;
                                                    studentInfo.querySelector('#profile > #form input#lastName').placeholder = response.payload.lastName;
                                                    studentInfo.querySelector('#profile > #form input#lastName').value = response.payload.lastName;
                                                    studentInfo.querySelector('#profile > #form input#studentNumber').placeholder = response.payload.studentNumber;
                                                    studentInfo.querySelector('#profile > #form input#studentNumber').value = response.payload.studentNumber;
                                                    studentInfo.querySelector('#profile > #form input#gender').placeholder = response.payload.gender;
                                                    studentInfo.querySelector('#profile > #form input#birthday').placeholder = response.payload.birthday;
                                                    studentInfo.querySelector('#profile > #form input#birthday').value = `${(() => {
                                                        const date = new Date(parseInt(response.payload.birthday));
                                                        const year = date.getFullYear();
                                                        const month = date.getMonth() + 1;
                                                        const day = date.getDate();
                                                        return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
                                                    })()}`;
                                                    studentInfo.querySelector('#profile > #form input#course').placeholder = response.payload.course;
                                                    studentInfo.querySelector('#profile > #form input#yearAndSection').placeholder = `${response.payload.year}${response.payload.section}`;
                                                    studentInfo.querySelector('#profile > #form input#yearAndSection').value = `${response.payload.year}${response.payload.section}`;
                                                    studentInfo.querySelector('#profile > #form input#emailAddress').placeholder = response.payload.emailAddress;
                                                    studentInfo.querySelector('#profile > #form input#emailAddress').value = response.payload.emailAddress;
                                                } else {
                                                    alertUser('Error', response.message, 'alert');
                                                };
                                            }).catch(error => {
                                                console.log(error);
                                                saveButton.disabled = false;
                                                alertUser('Error', 'An error occured while editing.', 'alert');
                                            });
                                    });

                                    studentInfo.querySelector('#action').appendChild(saveButton);

                                    const cancelButton = document.createElement('button');
                                    cancelButton.classList.add('button');
                                    cancelButton.innerHTML = `<p><b>Cancel</b></p>`;

                                    cancelButton.addEventListener('click', () => {
                                        for (const input of Array.from(studentInfo.querySelectorAll('#profile > #form input'))) {
                                            input.value = input.placeholder;
                                            input.readOnly = true;
                                        };
                                        for (const button of removedButtons) {
                                            studentInfo.querySelector('#action').appendChild(button);
                                        };

                                        const profile = studentInfo.querySelector('#profile');
                                        const profileImage = profile.querySelector('#profileContainer > img');
                                        console.log(profile);
                                        console.log(profileImage);
                                        profile.insertBefore(profileImage, profile.querySelector('#form'));
                                        profile.querySelector('#profileContainer').remove();

                                        genderInput.classList.remove('dropdown');
                                        genderInput.classList.add('textInput');
                                        genderInput.innerHTML = `
                                            <label for="gender">
                                                <h6>Gender</h6>
                                            </label>
                                            <input readonly type="text" name="gender" id="gender" value="${student.gender}">
                                        `;
                                        courseInput.classList.remove('dropdown');
                                        courseInput.classList.add('textInput');
                                        courseInput.innerHTML = `
                                            <label for="course">
                                                <h6>Course</h6>
                                            </label>
                                            <input readonly type="text" name="course" id="course" value="${student.course}">
                                        `;
                                        saveButton.remove();
                                        cancelButton.remove();
                                    });

                                    studentInfo.querySelector('#action').appendChild(cancelButton);
                                }
                            },
                            {
                                id: 'reject',
                                label: 'Reject',
                                callback: (student) => {
                                    console.log(student);

                                    fetch('/api/registrationQueue/reject.php', {
                                        method: 'DELETE',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({
                                            studentNumber: student.studentNumber
                                        })
                                    }).then(response => response.text())
                                        .then(res => {
                                            /** @type {import("../utils/types").Response}*/
                                            const response = JSON.parse(res);
                                            if (response.code == 200) {
                                                alertUser('Success', response.message, 'success', () => {
                                                    document.querySelector(`.studentInfo:has( #studentNumber[ value="${student.studentNumber}"] )`).remove();
                                                    studentsList.splice(studentsList.indexOf(student), 1);
                                                });
                                            } else {
                                                alertUser('Error', response.message, 'alert');
                                            };
                                        }).catch(error => {
                                            console.log(error);
                                            alertUser('Error', 'An error occured while rejecting.', 'alert');
                                        });
                                }
                            }
                        ]);
                    };
                }
            }).catch(error => {
                console.log(error);
                alertUser('Error', 'An error occured while fetching the registrants.', 'alert');
            });
    });



    fetch('/api/registrationQueue/retrieve.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.text())
        .then(res => {
            /** @type {import("../utils/types").Response}*/
            const response = JSON.parse(res);

            for (const student of response.payload) {
                studentsList.push(student);
                console.log(studentsList);
                displayStudent(student, [
                    {
                        id: 'accept',
                        label: 'Accept',
                        callback: (student) => {
                            fetch('/api/registrationQueue/accept.php', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    studentNumber: student.studentNumber
                                })
                            }).then(response => response.text())
                                .then(res => {
                                    /** @type {import("../utils/types").Response}*/
                                    const response = JSON.parse(res);
                                    if (response.code == 200) {
                                        alertUser('Success', response.message, 'success', () => {
                                            document.querySelector(`.studentInfo:has( #studentNumber[ value="${student.studentNumber}"] )`).remove();
                                            studentsList.splice(studentsList.indexOf(student), 1);
                                        });
                                    } else {
                                        alertUser('Error', response.message, 'alert');
                                    };
                                }).catch(error => {
                                    console.log(error);
                                    alertUser('Error', 'An error occured while accepting.', 'alert');
                                });
                        }
                    },
                    {
                        id: 'askForMoreInformation',
                        label: 'Ask for more Information',
                        callback: (student, buttonElement) => {
                            fetch('/api/registrationQueue/ask.php', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    studentNumber: student.studentNumber
                                })
                            }).then(response => response.text())
                                .then(res => {
                                    buttonElement.disabled = false;
                                    /** @type {import("../utils/types").Response}*/
                                    const response = JSON.parse(res);
                                    if (response.code == 200) {
                                        alertUser('Success', response.message, 'success');
                                    } else {
                                        alertUser('Error', response.message, 'alert');
                                    };
                                }).catch(error => {
                                    console.log(error);
                                    alertUser('Error', 'An error occured while asking for more information.', 'alert');
                                });
                        }
                    },
                    {
                        id: 'editProfile',
                        label: 'Edit',
                        callback: (student, buttonElement) => {
                            buttonElement.disabled = false;
                            const studentInfo = buttonElement.parentElement.parentElement;
                            const profile = studentInfo.querySelector('#profile');
                            const profileImage = profile.querySelector('img');
                            const profileForm = profile.querySelector('#form');
                            const genderInput = profileForm.querySelector('.row > .textInput:has(#gender)');
                            const courseInput = profileForm.querySelector('.row > .textInput:has(#course)');

                            const profileContainer = document.createElement('div');
                            profileContainer.id = 'profileContainer';
                            profileContainer.appendChild(profileImage);
                            profileContainer.innerHTML += `
                                <div class="textInput fileInput" style="width: 24rem;">
                                    <label for="profilePicture">
                                        <h6>Profile Picture</h6>
                                    </label>
                                    <input required type="file" name="profilePicture" accept="image/png, image/gif, image/jpeg" id="profilePicture" placeholder="Upload">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.33438 0.660937C9.05495 1.02344 8.05495 2.31875 7.11303 3.53906L5.40031 5.75781L7.12402 5.76563C8.83517 5.77344 8.84615 5.77344 8.84301 5.80469C8.83988 5.82188 8.83203 5.88125 8.82261 5.9375C8.81162 6.00625 8.80691 7.21094 8.81005 9.71875C8.81633 13.7359 8.80848 13.4203 8.9011 13.6406C9.16327 14.2594 9.91366 14.5094 10.5133 14.1797C10.5808 14.1422 10.6703 14.0703 10.7567 13.9844C10.8697 13.8719 10.9042 13.8234 10.9639 13.7016C11.0942 13.4344 11.0848 13.7781 11.0785 9.60156C11.0754 7.55625 11.0675 5.85625 11.0597 5.825L11.0487 5.76563L14.2889 5.75781L13.3485 4.53906C12.8305 3.86875 11.8305 2.57344 11.1256 1.66094L9.84458 0L9.33438 0.660937Z" fill="var(--color-secondary)" />
                                        <path d="M0 20H20V8.34375H13.5479V10.4063H17.5196V17.9375H2.48038V10.4063H6.76609L6.76295 9.37813L6.75824 8.35156L0 8.34375V20Z" fill="var(--color-secondary)" />
                                    </svg>
                                </div>
                            `;
                            const profileInput = profileContainer.querySelector('.textInput.fileInput > #profilePicture');
                            profileInput.addEventListener('change', () => {
                                /** @type {String} */
                                const filename = profileInput.value.split('\\')[profileInput.value.split('\\').length - 1];
                                profileInput.placeholder = `${filename.substring(0, 10)}...`;

                                // Convert profilePicture to base64
                                const reader = new FileReader();
                                reader.readAsDataURL(profilePicture.files[0]);
                                reader.onload = (result) => {
                                    const profilePictureBase64 = result.target.result;
                                    profileContainer.querySelector('img').remove();
                                    const newProfileImage = document.createElement('img');
                                    newProfileImage.src = profilePictureBase64;
                                    newProfileImage.alt = 'Student Picture';
                                    profileContainer.insertBefore(newProfileImage, profileContainer.querySelector('.textInput.fileInput'));
                                };
                            });
                            profile.insertBefore(profileContainer, profileForm);

                            genderInput.classList.add('dropdown');
                            genderInput.classList.remove('textInput');
                            genderInput.innerHTML = `
                                <label for="gender">
                                    <h6>Gender</h6>
                                </label>

                                <select required name="gender" id="gender">
                                    <option value="male"${student.gender === 'male' ? ' selected' : ''}>Male</option>
                                    <option value="female"${student.gender === 'female' ? ' selected' : ''}>Female</option>
                                    <option value=""${student.gender === '' ? ' selected' : ''}>Prefer not to say</option>
                                </select>
                                <svg width="20" height="15" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 15.5L0 5.5V0.5L10 10.5L20 0.5V5.5L10 15.5Z" fill="var(--color-secondary)" />
                                </svg>
                            `;
                            let genderValue = student.gender;
                            genderInput.querySelector('select').addEventListener('change', (e) => {
                                genderValue = e.target.value;
                            });

                            courseInput.classList.add('dropdown');
                            courseInput.classList.remove('textInput');
                            courseInput.innerHTML = `
                                <label for="course">
                                    <h6>Course</h6>
                                </label>

                                <select required name="course" id="course">
                                    <option value="BSIT"${student.course.toLocaleLowerCase() === 'BSIT'.toLocaleLowerCase()
                                    ? ' selected' : ''}>Bachelor of Science in Information Technoloty</option>
                                    <option value="BSCpE"${student.course.toLocaleLowerCase() === 'BSCpE'.toLocaleLowerCase()
                                    ? ' selected' : ''}>Bachelor of Science in Computer Engineering</option>
        
                                    <option value="BSEd-SCI"${student.course.toLocaleLowerCase() === 'BSEd-SCI'.toLocaleLowerCase()
                                    ? ' selected' : ''}>Bachelor of Secondary Education major in Science</option>
                                    <option value="BEEd-GEN"${student.course.toLocaleLowerCase() === 'BEEd-GEN'.toLocaleLowerCase()
                                    ? ' selected' : ''}>Bachelor of Elementary Education - Generalist</option>
                                    <option value="BEEd-ECED"${student.course.toLocaleLowerCase() === 'BEEd-ECED'.toLocaleLowerCase()
                                    ? ' selected' : ''}>Bachelor of Early Childhood Education</option>
                                    <option value="BTLEd-ICT"${student.course.toLocaleLowerCase() === 'BTLEd-ICT'.toLocaleLowerCase()
                                    ? ' selected' : ''}>Bachelor of Technology and Livelihood Education major in Information and Communication Technology</option>
        
                                    <option value="BSBA-HRM"${student.course.toLocaleLowerCase() === 'BSBA-HRM'.toLocaleLowerCase()
                                    ? ' selected' : ''}>Bachelor of Science in Business Administration Major in Human Resource Management</option>
                                    <option value="BSE"${student.course.toLocaleLowerCase() === 'BSE'.toLocaleLowerCase()
                                    ? ' selected' : ''
                                }>Bachelor of Science in Entrepreneurship</option>
                                </select>
                                <svg width="20" height="15" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 15.5L0 5.5V0.5L10 10.5L20 0.5V5.5L10 15.5Z" fill="var(--color-secondary)" />
                                </svg>
                            `;
                            let courseValue = student.course;
                            courseInput.querySelector('select').addEventListener('change', (e) => {
                                courseValue = e.target.value;
                            });

                            for (const input of Array.from(studentInfo.querySelectorAll('#profile > #form input'))) {
                                input.placeholder = input.value;
                                input.readOnly = false;
                            };
                            const removedButtons = [];
                            for (const button of Array.from(studentInfo.querySelectorAll('#action .button'))) {
                                removedButtons.push(button);
                                button.remove();
                            };
                            const saveButton = document.createElement('button');
                            saveButton.classList.add('button');
                            saveButton.innerHTML = `<p><b>Save</b></p>`;

                            saveButton.addEventListener('click', () => {
                                saveButton.disabled = true;
                                // Check if all inputs are filled
                                let allFilled = true;
                                for (const input of Array.from(studentInfo.querySelectorAll('#profile > #form input'))) {
                                    if (input.id != 'middleName' && input.id != 'gender' && input.value == '') {
                                        allFilled = false;
                                        saveButton.disabled = false;
                                        break;
                                    };
                                };
                                if (!allFilled) {
                                    alertUser('Error', 'Please fill all the fields.', 'alert');
                                    saveButton.disabled = false;
                                    return;
                                };



                                const studentNumberRegex = /^[0-9]{2}-[0-9]{5}$/;
                                if (!studentNumberRegex.test(studentInfo.querySelector('#profile > #form input#studentNumber').value)) {
                                    alertUser('Error', 'Please enter a valid student number.', 'alert');
                                    saveButton.disabled = false;
                                    return;
                                };

                                // Validate year and section
                                // Example: 1A
                                const yearAndSectionRegex = /^[1-4][A-Z]$/;
                                if (!yearAndSectionRegex.test(studentInfo.querySelector('#profile > #form input#yearAndSection').value)) {
                                    alertUser('Invalid', 'Invalid year and section', 'warning');
                                    saveButton.disabled = false;
                                    return;
                                };
                                // Separate year and section
                                const year = studentInfo.querySelector('#profile > #form input#yearAndSection').value.split('')[0];
                                const section = studentInfo.querySelector('#profile > #form input#yearAndSection').value.split('')[1];

                                // Validate email
                                const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
                                if (!emailRegex.test(studentInfo.querySelector('#profile > #form input#emailAddress').value)) {
                                    alertUser('Invalid', 'Invalid email address', 'warning');
                                    saveButton.disabled = false;
                                    return;
                                };

                                // Validate birthday
                                const birthdayDate = new Date(studentInfo.querySelector('#profile > #form input#birthday').value);
                                const birthdayEpoch = birthdayDate.getTime();
                                const birthdayRegex = /^[0-9]{10,30}$/;
                                if (!birthdayRegex.test(birthdayEpoch)) {
                                    alertUser('Invalid', 'Invalid birthday', 'warning');
                                    saveButton.disabled = false;
                                    return;
                                };



                                // Convert base64 to blob
                                const profilePictureBase64 = profileContainer.querySelector('img').src;
                                const profilePictureBase64Length = profilePictureBase64.length - 'data:image/png;base64,'.length;
                                const profilePictureBase64Bytes = Math.ceil((profilePictureBase64Length / 3)) * 0.5624896334383812;
                                // Limit the size of the profilePicture to 2MB
                                if (profilePictureBase64Bytes > 2000000) {
                                    alertUser('Invalid', 'Profile picture is too large', 'warning');
                                    saveButton.disabled = false;
                                    return;
                                };



                                fetch('/api/registrationQueue/edit.php', {
                                    method: 'UPDATE',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        studentNumber: student.studentNumber,
                                        firstName: studentInfo.querySelector('#profile > #form input#firstName').value,
                                        middleName: studentInfo.querySelector('#profile > #form input#middleName').value,
                                        lastName: studentInfo.querySelector('#profile > #form input#lastName').value,
                                        studentNumber: studentInfo.querySelector('#profile > #form input#studentNumber').value,
                                        gender: genderValue,
                                        birthday: birthdayEpoch,
                                        profilePicture: profilePictureBase64,
                                        course: courseValue,
                                        year: year,
                                        section: section,
                                        emailAddress: studentInfo.querySelector('#profile > #form input#emailAddress').value
                                    })
                                }).then(response => response.text())
                                    .then(res => {
                                        console.log(res);
                                        saveButton.disabled = false;
                                        /** @type {import("../utils/types").Response}*/
                                        const response = JSON.parse(res);
                                        if (response.code == 200) {
                                            cancelButton.click();
                                            alertUser('Success', response.message, 'success');

                                            const studentInfo = document.querySelector(`.studentInfo:has( #studentNumber[ value="${student.studentNumber}"] )`);

                                            studentInfo.querySelector('#profile > #form input#firstName').placeholder = response.payload.firstName;
                                            studentInfo.querySelector('#profile > #form input#firstName').value = response.payload.firstName;
                                            studentInfo.querySelector('#profile > #form input#middleName').placeholder = response.payload.middleName;
                                            studentInfo.querySelector('#profile > #form input#middleName').value = response.payload.middleName;
                                            studentInfo.querySelector('#profile > #form input#lastName').placeholder = response.payload.lastName;
                                            studentInfo.querySelector('#profile > #form input#lastName').value = response.payload.lastName;
                                            studentInfo.querySelector('#profile > #form input#studentNumber').placeholder = response.payload.studentNumber;
                                            studentInfo.querySelector('#profile > #form input#studentNumber').value = response.payload.studentNumber;
                                            studentInfo.querySelector('#profile > #form input#gender').placeholder = response.payload.gender;
                                            studentInfo.querySelector('#profile > #form input#birthday').placeholder = response.payload.birthday;
                                            studentInfo.querySelector('#profile > #form input#birthday').value = `${(() => {
                                                const date = new Date(parseInt(response.payload.birthday));
                                                const year = date.getFullYear();
                                                const month = date.getMonth() + 1;
                                                const day = date.getDate();
                                                return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
                                            })()}`;
                                            studentInfo.querySelector('#profile > #form input#course').placeholder = response.payload.course;
                                            studentInfo.querySelector('#profile > #form input#yearAndSection').placeholder = `${response.payload.year}${response.payload.section}`;
                                            studentInfo.querySelector('#profile > #form input#yearAndSection').value = `${response.payload.year}${response.payload.section}`;
                                            studentInfo.querySelector('#profile > #form input#emailAddress').placeholder = response.payload.emailAddress;
                                            studentInfo.querySelector('#profile > #form input#emailAddress').value = response.payload.emailAddress;
                                        } else {
                                            alertUser('Error', response.message, 'alert');
                                        };
                                    }).catch(error => {
                                        console.log(error);
                                        saveButton.disabled = false;
                                        alertUser('Error', 'An error occured while editing.', 'alert');
                                    });
                            });

                            studentInfo.querySelector('#action').appendChild(saveButton);

                            const cancelButton = document.createElement('button');
                            cancelButton.classList.add('button');
                            cancelButton.innerHTML = `<p><b>Cancel</b></p>`;

                            cancelButton.addEventListener('click', () => {
                                for (const input of Array.from(studentInfo.querySelectorAll('#profile > #form input'))) {
                                    input.value = input.placeholder;
                                    input.readOnly = true;
                                };
                                for (const button of removedButtons) {
                                    studentInfo.querySelector('#action').appendChild(button);
                                };

                                const profile = studentInfo.querySelector('#profile');
                                const profileImage = profile.querySelector('#profileContainer > img');
                                console.log(profile);
                                console.log(profileImage);
                                profile.insertBefore(profileImage, profile.querySelector('#form'));
                                profile.querySelector('#profileContainer').remove();

                                genderInput.classList.remove('dropdown');
                                genderInput.classList.add('textInput');
                                genderInput.innerHTML = `
                                    <label for="gender">
                                        <h6>Gender</h6>
                                    </label>
                                    <input readonly type="text" name="gender" id="gender" value="${student.gender}">
                                `;
                                courseInput.classList.remove('dropdown');
                                courseInput.classList.add('textInput');
                                courseInput.innerHTML = `
                                    <label for="course">
                                        <h6>Course</h6>
                                    </label>
                                    <input readonly type="text" name="course" id="course" value="${student.course}">
                                `;
                                saveButton.remove();
                                cancelButton.remove();
                            });

                            studentInfo.querySelector('#action').appendChild(cancelButton);
                        }
                    },
                    {
                        id: 'reject',
                        label: 'Reject',
                        callback: (student) => {
                            console.log(student);

                            fetch('/api/registrationQueue/reject.php', {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    studentNumber: student.studentNumber
                                })
                            }).then(response => response.text())
                                .then(res => {
                                    /** @type {import("../utils/types").Response}*/
                                    const response = JSON.parse(res);
                                    if (response.code == 200) {
                                        alertUser('Success', response.message, 'success', () => {
                                            document.querySelector(`.studentInfo:has( #studentNumber[ value="${student.studentNumber}"] )`).remove();
                                            studentsList.splice(studentsList.indexOf(student), 1);
                                        });
                                    } else {
                                        alertUser('Error', response.message, 'alert');
                                    };
                                }).catch(error => {
                                    console.log(error);
                                    alertUser('Error', 'An error occured while rejecting.', 'alert');
                                });
                        }
                    }
                ]);
            };
        }).catch(error => {
            console.log(error);
            alertUser('Error', 'An error occured while fetching the registrants.', 'alert');
        });
});
systemLogsButton.addEventListener('click', () => {
    pagesButton(false, systemLogsButton);
    main.appendChild(systemLogs);

    systemLogs.innerHTML = `
    <h2 style="width: 100%; text-align: center;">System Logs</h2>
    <table>
        <thead>
            <tr>
                <th><h5>Time</h5></th>
                <th><h5>Content</h5></th>
            </tr>
        </thead>

        <tbody id="logs">
        </tbody>
    </table>
    `;

    fetch('/api/systemLogs/retrieve.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.text())
        .then(res => {
            /** @type {import("../utils/types").Response}*/
            const response = JSON.parse(res);
            /** @type {import("../utils/types").SystemLogs[]}*/
            const systemLogsPayload = response.payload;

            for (const log of systemLogsPayload) {
                systemLogsList.push(log);
                const logElement = document.createElement('tr');
                logElement.innerHTML = `
                    <td style="
                        white-space: nowrap;
                    ">${(() => {
                        const date = new Date(parseInt(log.timeAdded * 1000));
                        const year = date.getFullYear();
                        const month = date.getMonth() + 1;
                        const day = date.getDate();
                        const hour = date.getHours();
                        const minute = date.getMinutes();
                        const second = date.getSeconds();
                        return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day} ${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute}:${second < 10 ? '0' + second : second}`;
                    })()}</td>
                    <td>
                        <pre>${JSON.stringify(JSON.parse(log.content), null, 4)}</pre>
                    </td>
                `;

                systemLogs.querySelector('#logs').appendChild(logElement);
            };
        }).catch(error => {
            console.log(error);
            alertUser('Error', 'An error occured while fetching the system logs.', 'alert');
        });
});



pagesButton(true);
if (window.matchMedia('(max-width: 50rem)').matches) {
    document.querySelector('#sidebarButton').click();
};



window.addEventListener('scroll', async (e) => {
    // Check if the page is scrolled to the bottom
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        // Check which page is active
        switch (window.location.hash.substring(1)) {
            case 'allEvaluations':
                fetch(`/api/allEvaluations/retrieve.php?start=${evaluationsList[evaluationsList.length - 1].timeAdded}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(response => response.text())
                    .then(res => {
                        console.log(res);
                        /** @type {import("../utils/types").Response}*/
                        const response = JSON.parse(res);
                        if (response.status == 'success') {
                            if (response.payload.length == 0) {
                                alertUser('404', 'No more evaluations found.', 'alert');
                                return;
                            };
                            for (const evaluation of response.payload) {
                                evaluation.contents = JSON.parse(evaluation.contents);
                                displayEvaluation(evaluation, document.querySelector('#main > #allEvaluations > #evaluations'));
                                evaluationsList.push(evaluation);
                            };
                        } else {
                            alertUser('Error', response.message, 'alert');
                        };
                    }).catch(err => {
                        console.log(err);
                        alertUser('Error', 'Failed to load more evaluations.', 'alert');
                    });
                break;
            case 'allStudents':
                fetch(`/api/allStudents/retrieve.php?start=${studentsList[studentsList.length - 1].timeAdded}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(response => response.text())
                    .then(res => {
                        /** @type {import("../utils/types").Response}*/
                        const response = JSON.parse(res);

                        for (const student of response.payload) {
                            studentsList.push(student);
                            console.log(studentsList);
                            displayStudent(student, [
                                {
                                    id: 'summon',
                                    label: 'Summon',
                                    callback: (student, buttonElement) => {
                                        buttonElement.disabled = true;
                                        fetch('/api/allStudents/summon.php', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify({
                                                studentNumber: student.studentNumber
                                            })
                                        }).then(response => response.text())
                                            .then(res => {
                                                console.log(res);
                                                buttonElement.disabled = false;
                                                /** @type {import("../utils/types").Response}*/
                                                const response = JSON.parse(res);
                                                if (response.code == 200) {
                                                    alertUser('Success', response.message, 'success');
                                                } else {
                                                    alertUser('Error', response.message, 'alert');
                                                };
                                            }).catch(error => {
                                                console.log(error);
                                                alertUser('Error', 'An error occured while summoning the student.', 'alert');
                                            });
                                    }
                                },
                                {
                                    id: 'editProfile',
                                    label: 'Edit',
                                    callback: (student, buttonElement) => {
                                        buttonElement.disabled = false;
                                        const studentInfo = buttonElement.parentElement.parentElement;
                                        const profile = studentInfo.querySelector('#profile');
                                        const profileImage = profile.querySelector('img');
                                        const profileForm = profile.querySelector('#form');
                                        const genderInput = profileForm.querySelector('.row > .textInput:has(#gender)');
                                        const courseInput = profileForm.querySelector('.row > .textInput:has(#course)');

                                        const profileContainer = document.createElement('div');
                                        profileContainer.id = 'profileContainer';
                                        profileContainer.appendChild(profileImage);
                                        profileContainer.innerHTML += `
                                            <div class="textInput fileInput" style="width: 24rem;">
                                                <label for="profilePicture">
                                                    <h6>Profile Picture</h6>
                                                </label>
                                                <input required type="file" name="profilePicture" accept="image/png, image/gif, image/jpeg" id="profilePicture" placeholder="Upload">
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9.33438 0.660937C9.05495 1.02344 8.05495 2.31875 7.11303 3.53906L5.40031 5.75781L7.12402 5.76563C8.83517 5.77344 8.84615 5.77344 8.84301 5.80469C8.83988 5.82188 8.83203 5.88125 8.82261 5.9375C8.81162 6.00625 8.80691 7.21094 8.81005 9.71875C8.81633 13.7359 8.80848 13.4203 8.9011 13.6406C9.16327 14.2594 9.91366 14.5094 10.5133 14.1797C10.5808 14.1422 10.6703 14.0703 10.7567 13.9844C10.8697 13.8719 10.9042 13.8234 10.9639 13.7016C11.0942 13.4344 11.0848 13.7781 11.0785 9.60156C11.0754 7.55625 11.0675 5.85625 11.0597 5.825L11.0487 5.76563L14.2889 5.75781L13.3485 4.53906C12.8305 3.86875 11.8305 2.57344 11.1256 1.66094L9.84458 0L9.33438 0.660937Z" fill="var(--color-secondary)" />
                                                    <path d="M0 20H20V8.34375H13.5479V10.4063H17.5196V17.9375H2.48038V10.4063H6.76609L6.76295 9.37813L6.75824 8.35156L0 8.34375V20Z" fill="var(--color-secondary)" />
                                                </svg>
                                            </div>
                                        `;
                                        const profileInput = profileContainer.querySelector('.textInput.fileInput > #profilePicture');
                                        profileInput.addEventListener('change', () => {
                                            /** @type {String} */
                                            const filename = profileInput.value.split('\\')[profileInput.value.split('\\').length - 1];
                                            profileInput.placeholder = `${filename.substring(0, 10)}...`;

                                            // Convert profilePicture to base64
                                            const reader = new FileReader();
                                            reader.readAsDataURL(profilePicture.files[0]);
                                            reader.onload = (result) => {
                                                const profilePictureBase64 = result.target.result;
                                                profileContainer.querySelector('img').remove();
                                                const newProfileImage = document.createElement('img');
                                                newProfileImage.src = profilePictureBase64;
                                                newProfileImage.alt = 'Student Picture';
                                                profileContainer.insertBefore(newProfileImage, profileContainer.querySelector('.textInput.fileInput'));
                                            };
                                        });
                                        profile.insertBefore(profileContainer, profileForm);

                                        genderInput.classList.add('dropdown');
                                        genderInput.classList.remove('textInput');
                                        genderInput.innerHTML = `
                                            <label for="gender">
                                                <h6>Gender</h6>
                                            </label>
            
                                            <select required name="gender" id="gender">
                                                <option value="male"${student.gender === 'male' ? ' selected' : ''}>Male</option>
                                                <option value="female"${student.gender === 'female' ? ' selected' : ''}>Female</option>
                                                <option value=""${student.gender === '' ? ' selected' : ''}>Prefer not to say</option>
                                            </select>
                                            <svg width="20" height="15" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M10 15.5L0 5.5V0.5L10 10.5L20 0.5V5.5L10 15.5Z" fill="var(--color-secondary)" />
                                            </svg>
                                        `;
                                        let genderValue = student.gender;
                                        genderInput.querySelector('select').addEventListener('change', (e) => {
                                            genderValue = e.target.value;
                                        });

                                        courseInput.classList.add('dropdown');
                                        courseInput.classList.remove('textInput');
                                        courseInput.innerHTML = `
                                            <label for="course">
                                                <h6>Course</h6>
                                            </label>
            
                                            <select required name="course" id="course">
                                                <option value="BSIT"${student.course.toLocaleLowerCase() === 'BSIT'.toLocaleLowerCase()
                                                ? ' selected' : ''}>Bachelor of Science in Information Technoloty</option>
                                                <option value="BSCpE"${student.course.toLocaleLowerCase() === 'BSCpE'.toLocaleLowerCase()
                                                ? ' selected' : ''}>Bachelor of Science in Computer Engineering</option>
                    
                                                <option value="BSEd-SCI"${student.course.toLocaleLowerCase() === 'BSEd-SCI'.toLocaleLowerCase()
                                                ? ' selected' : ''}>Bachelor of Secondary Education major in Science</option>
                                                <option value="BEEd-GEN"${student.course.toLocaleLowerCase() === 'BEEd-GEN'.toLocaleLowerCase()
                                                ? ' selected' : ''}>Bachelor of Elementary Education - Generalist</option>
                                                <option value="BEEd-ECED"${student.course.toLocaleLowerCase() === 'BEEd-ECED'.toLocaleLowerCase()
                                                ? ' selected' : ''}>Bachelor of Early Childhood Education</option>
                                                <option value="BTLEd-ICT"${student.course.toLocaleLowerCase() === 'BTLEd-ICT'.toLocaleLowerCase()
                                                ? ' selected' : ''}>Bachelor of Technology and Livelihood Education major in Information and Communication Technology</option>
                    
                                                <option value="BSBA-HRM"${student.course.toLocaleLowerCase() === 'BSBA-HRM'.toLocaleLowerCase()
                                                ? ' selected' : ''}>Bachelor of Science in Business Administration Major in Human Resource Management</option>
                                                <option value="BSE"${student.course.toLocaleLowerCase() === 'BSE'.toLocaleLowerCase()
                                                ? ' selected' : ''
                                            }>Bachelor of Science in Entrepreneurship</option>
                                            </select>
                                            <svg width="20" height="15" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M10 15.5L0 5.5V0.5L10 10.5L20 0.5V5.5L10 15.5Z" fill="var(--color-secondary)" />
                                            </svg>
                                        `;
                                        let courseValue = student.course;
                                        courseInput.querySelector('select').addEventListener('change', (e) => {
                                            courseValue = e.target.value;
                                        });

                                        for (const input of Array.from(studentInfo.querySelectorAll('#profile > #form input'))) {
                                            input.placeholder = input.value;
                                            input.readOnly = false;
                                        };
                                        const removedButtons = [];
                                        for (const button of Array.from(studentInfo.querySelectorAll('#action .button'))) {
                                            removedButtons.push(button);
                                            button.remove();
                                        };
                                        const saveButton = document.createElement('button');
                                        saveButton.classList.add('button');
                                        saveButton.innerHTML = `<p><b>Save</b></p>`;

                                        saveButton.addEventListener('click', () => {
                                            saveButton.disabled = true;
                                            // Check if all inputs are filled
                                            let allFilled = true;
                                            for (const input of Array.from(studentInfo.querySelectorAll('#profile > #form input'))) {
                                                if (input.id != 'middleName' && input.id != 'gender' && input.value == '') {
                                                    allFilled = false;
                                                    saveButton.disabled = false;
                                                    break;
                                                };
                                            };
                                            if (!allFilled) {
                                                alertUser('Error', 'Please fill all the fields.', 'alert');
                                                saveButton.disabled = false;
                                                return;
                                            };



                                            const studentNumberRegex = /^[0-9]{2}-[0-9]{5}$/;
                                            if (!studentNumberRegex.test(studentInfo.querySelector('#profile > #form input#studentNumber').value)) {
                                                alertUser('Error', 'Please enter a valid student number.', 'alert');
                                                saveButton.disabled = false;
                                                return;
                                            };

                                            // Validate year and section
                                            // Example: 1A
                                            const yearAndSectionRegex = /^[1-4][A-Z]$/;
                                            if (!yearAndSectionRegex.test(studentInfo.querySelector('#profile > #form input#yearAndSection').value)) {
                                                alertUser('Invalid', 'Invalid year and section', 'warning');
                                                saveButton.disabled = false;
                                                return;
                                            };
                                            // Separate year and section
                                            const year = studentInfo.querySelector('#profile > #form input#yearAndSection').value.split('')[0];
                                            const section = studentInfo.querySelector('#profile > #form input#yearAndSection').value.split('')[1];

                                            // Validate email
                                            const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
                                            if (!emailRegex.test(studentInfo.querySelector('#profile > #form input#emailAddress').value)) {
                                                alertUser('Invalid', 'Invalid email address', 'warning');
                                                saveButton.disabled = false;
                                                return;
                                            };

                                            // Validate birthday
                                            const birthdayDate = new Date(studentInfo.querySelector('#profile > #form input#birthday').value);
                                            const birthdayEpoch = birthdayDate.getTime();
                                            const birthdayRegex = /^[0-9]{10,30}$/;
                                            if (!birthdayRegex.test(birthdayEpoch)) {
                                                alertUser('Invalid', 'Invalid birthday', 'warning');
                                                saveButton.disabled = false;
                                                return;
                                            };



                                            // Convert base64 to blob
                                            const profilePictureBase64 = profileContainer.querySelector('img').src;
                                            const profilePictureBase64Length = profilePictureBase64.length - 'data:image/png;base64,'.length;
                                            const profilePictureBase64Bytes = Math.ceil((profilePictureBase64Length / 3)) * 0.5624896334383812;
                                            // Limit the size of the profilePicture to 2MB
                                            if (profilePictureBase64Bytes > 2000000) {
                                                alertUser('Invalid', 'Profile picture is too large', 'warning');
                                                saveButton.disabled = false;
                                                return;
                                            };



                                            fetch('/api/allStudents/edit.php', {
                                                method: 'UPDATE',
                                                headers: {
                                                    'Content-Type': 'application/json'
                                                },
                                                body: JSON.stringify({
                                                    studentNumber: student.studentNumber,
                                                    firstName: studentInfo.querySelector('#profile > #form input#firstName').value,
                                                    middleName: studentInfo.querySelector('#profile > #form input#middleName').value,
                                                    lastName: studentInfo.querySelector('#profile > #form input#lastName').value,
                                                    studentNumber: studentInfo.querySelector('#profile > #form input#studentNumber').value,
                                                    gender: genderValue,
                                                    birthday: birthdayEpoch,
                                                    profilePicture: profilePictureBase64,
                                                    course: courseValue,
                                                    year: year,
                                                    section: section,
                                                    emailAddress: studentInfo.querySelector('#profile > #form input#emailAddress').value
                                                })
                                            }).then(response => response.text())
                                                .then(res => {
                                                    console.log(res);
                                                    saveButton.disabled = false;
                                                    /** @type {import("../utils/types").Response}*/
                                                    const response = JSON.parse(res);
                                                    if (response.code == 200) {
                                                        cancelButton.click();
                                                        alertUser('Success', response.message, 'success');

                                                        const studentInfo = document.querySelector(`.studentInfo:has( #studentNumber[ value="${student.studentNumber}"] )`);

                                                        studentInfo.querySelector('#profile > #form input#firstName').placeholder = response.payload.firstName;
                                                        studentInfo.querySelector('#profile > #form input#firstName').value = response.payload.firstName;
                                                        studentInfo.querySelector('#profile > #form input#middleName').placeholder = response.payload.middleName;
                                                        studentInfo.querySelector('#profile > #form input#middleName').value = response.payload.middleName;
                                                        studentInfo.querySelector('#profile > #form input#lastName').placeholder = response.payload.lastName;
                                                        studentInfo.querySelector('#profile > #form input#lastName').value = response.payload.lastName;
                                                        studentInfo.querySelector('#profile > #form input#studentNumber').placeholder = response.payload.studentNumber;
                                                        studentInfo.querySelector('#profile > #form input#studentNumber').value = response.payload.studentNumber;
                                                        studentInfo.querySelector('#profile > #form input#gender').placeholder = response.payload.gender;
                                                        studentInfo.querySelector('#profile > #form input#birthday').placeholder = response.payload.birthday;
                                                        studentInfo.querySelector('#profile > #form input#birthday').value = `${(() => {
                                                            const date = new Date(parseInt(response.payload.birthday));
                                                            const year = date.getFullYear();
                                                            const month = date.getMonth() + 1;
                                                            const day = date.getDate();
                                                            return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
                                                        })()}`;
                                                        studentInfo.querySelector('#profile > #form input#course').placeholder = response.payload.course;
                                                        studentInfo.querySelector('#profile > #form input#yearAndSection').placeholder = `${response.payload.year}${response.payload.section}`;
                                                        studentInfo.querySelector('#profile > #form input#yearAndSection').value = `${response.payload.year}${response.payload.section}`;
                                                        studentInfo.querySelector('#profile > #form input#emailAddress').placeholder = response.payload.emailAddress;
                                                        studentInfo.querySelector('#profile > #form input#emailAddress').value = response.payload.emailAddress;
                                                    } else {
                                                        alertUser('Error', response.message, 'alert');
                                                    };
                                                }).catch(error => {
                                                    console.log(error);
                                                    saveButton.disabled = false;
                                                    alertUser('Error', 'An error occured while editing.', 'alert');
                                                });
                                        });

                                        studentInfo.querySelector('#action').appendChild(saveButton);

                                        const cancelButton = document.createElement('button');
                                        cancelButton.classList.add('button');
                                        cancelButton.innerHTML = `<p><b>Cancel</b></p>`;

                                        cancelButton.addEventListener('click', () => {
                                            for (const input of Array.from(studentInfo.querySelectorAll('#profile > #form input'))) {
                                                input.value = input.placeholder;
                                                input.readOnly = true;
                                            };
                                            for (const button of removedButtons) {
                                                studentInfo.querySelector('#action').appendChild(button);
                                            };

                                            const profile = studentInfo.querySelector('#profile');
                                            const profileImage = profile.querySelector('#profileContainer > img');
                                            console.log(profile);
                                            console.log(profileImage);
                                            profile.insertBefore(profileImage, profile.querySelector('#form'));
                                            profile.querySelector('#profileContainer').remove();

                                            genderInput.classList.remove('dropdown');
                                            genderInput.classList.add('textInput');
                                            genderInput.innerHTML = `
                                                <label for="gender">
                                                    <h6>Gender</h6>
                                                </label>
                                                <input readonly type="text" name="gender" id="gender" value="${student.gender}">
                                            `;
                                            courseInput.classList.remove('dropdown');
                                            courseInput.classList.add('textInput');
                                            courseInput.innerHTML = `
                                                <label for="course">
                                                    <h6>Course</h6>
                                                </label>
                                                <input readonly type="text" name="course" id="course" value="${student.course}">
                                            `;
                                            saveButton.remove();
                                            cancelButton.remove();
                                        });

                                        studentInfo.querySelector('#action').appendChild(cancelButton);
                                    }
                                },
                                {
                                    id: 'generateStatisticalReport',
                                    label: 'Generate Statistical Report',
                                    callback: (student, buttonElement) => {
                                        buttonElement.disabled = true;

                                        fetch('/api/allStudents/generateReport.php', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify({
                                                studentNumber: student.studentNumber
                                            })
                                        }).then(response => response.blob())
                                            .then(blob => {
                                                buttonElement.disabled = false;
                                                const url = window.URL.createObjectURL(blob);
                                                const a = document.createElement('a');
                                                a.href = url;
                                                a.target = '_blank';
                                                a.download = `${student.firstName} ${student.lastName} (${student.studentNumber})- Statistical Report.pdf`
                                                document.body.appendChild(a);
                                                a.click();
                                                a.remove();
                                                alertUser('Success', 'Report generated successfully.', 'success');
                                            });
                                    }
                                },
                            ]);
                        };
                    }).catch(error => {
                        console.log(error);
                        alertUser('Error', 'An error occured while fetching the registrants.', 'alert');
                    });
                break;
            case 'registrationQueue':
                fetch(`/api/registrationQueue/retrieve.php?start=${studentsList[studentsList.length - 1].timeAdded}&search=${document.getElementById('student').value}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(response => response.text())
                    .then(res => {
                        /** @type {import("../utils/types").Response}*/
                        const response = JSON.parse(res);

                        for (const student of response.payload) {
                            studentsList.push(student);
                            displayStudent(student, [
                                {
                                    id: 'accept',
                                    label: 'Accept',
                                    callback: (student) => {
                                        fetch('/api/registrationQueue/accept.php', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify({
                                                studentNumber: student.studentNumber
                                            })
                                        }).then(response => response.text())
                                            .then(res => {
                                                /** @type {import("../utils/types").Response}*/
                                                const response = JSON.parse(res);
                                                if (response.code == 200) {
                                                    alertUser('Success', response.message, 'success', () => {
                                                        document.querySelector(`.studentInfo:has( #studentNumber[ value="${student.studentNumber}"] )`).remove();
                                                        studentsList.splice(studentsList.indexOf(student), 1);
                                                    });
                                                } else {
                                                    alertUser('Error', response.message, 'alert');
                                                };
                                            }).catch(error => {
                                                console.log(error);
                                                alertUser('Error', 'An error occured while accepting.', 'alert');
                                            });
                                    }
                                },
                                {
                                    id: 'askForMoreInformation',
                                    label: 'Ask for more Information',
                                    callback: (student, buttonElement) => {
                                        fetch('/api/registrationQueue/ask.php', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify({
                                                studentNumber: student.studentNumber
                                            })
                                        }).then(response => response.text())
                                            .then(res => {
                                                buttonElement.disabled = false;
                                                /** @type {import("../utils/types").Response}*/
                                                const response = JSON.parse(res);
                                                if (response.code == 200) {
                                                    alertUser('Success', response.message, 'success');
                                                } else {
                                                    alertUser('Error', response.message, 'alert');
                                                };
                                            }).catch(error => {
                                                console.log(error);
                                                alertUser('Error', 'An error occured while asking for more information.', 'alert');
                                            });
                                    }
                                },
                                {
                                    id: 'editProfile',
                                    label: 'Edit',
                                    callback: (student, buttonElement) => {
                                        buttonElement.disabled = false;
                                        console.log(student, buttonElement.parentElement.parentElement);
                                    }
                                },
                                {
                                    id: 'reject',
                                    label: 'Reject',
                                    callback: (student) => {
                                        console.log(student);

                                        fetch('/api/registrationQueue/reject.php', {
                                            method: 'DELETE',
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify({
                                                studentNumber: student.studentNumber
                                            })
                                        }).then(response => response.text())
                                            .then(res => {
                                                /** @type {import("../utils/types").Response}*/
                                                const response = JSON.parse(res);
                                                if (response.code == 200) {
                                                    alertUser('Success', response.message, 'success', () => {
                                                        document.querySelector(`.studentInfo:has( #studentNumber[ value="${student.studentNumber}"] )`).remove();
                                                        studentsList.splice(studentsList.indexOf(student), 1);
                                                    });
                                                } else {
                                                    alertUser('Error', response.message, 'alert');
                                                };
                                            }).catch(error => {
                                                console.log(error);
                                                alertUser('Error', 'An error occured while rejecting.', 'alert');
                                            });
                                    }
                                }
                            ]);
                        };
                    }).catch(error => {
                        console.log(error);
                        alertUser('Error', 'An error occured while fetching the registrants.', 'alert');
                    });
                break;
            case 'systemLogs':
                fetch(`/api/systemLogs/retrieve.php?start=${systemLogsList[systemLogsList.length - 1].timeAdded}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(response => response.text())
                    .then(res => {
                        /** @type {import("../utils/types").Response}*/
                        const response = JSON.parse(res);
                        /** @type {import("../utils/types").SystemLogs[]}*/
                        const systemLogsPayload = response.payload;

                        for (const log of systemLogsPayload) {
                            systemLogsList.push(log);
                            const logElement = document.createElement('tr');
                            logElement.innerHTML = `
                                <td style="
                                    white-space: nowrap;
                                ">${(() => {
                                    const date = new Date(parseInt(log.timeAdded * 1000));
                                    const year = date.getFullYear();
                                    const month = date.getMonth() + 1;
                                    const day = date.getDate();
                                    const hour = date.getHours();
                                    const minute = date.getMinutes();
                                    const second = date.getSeconds();
                                    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day} ${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute}:${second < 10 ? '0' + second : second}`;
                                })()}</td>
                                <td>
                                    <pre>${JSON.stringify(JSON.parse(log.content), null, 4)}</pre>
                                </td>
                            `;

                            systemLogs.querySelector('#logs').appendChild(logElement);
                        };
                    }).catch(error => {
                        console.log(error);
                        alertUser('Error', 'An error occured while fetching the system logs.', 'alert');
                    });
                break;
            default:
                break;
        };
    };
});