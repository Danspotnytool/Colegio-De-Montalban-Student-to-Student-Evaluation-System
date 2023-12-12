
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
/** @type {import("../utils/types").Evaluation[]} */
const evaluationsList = [];



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



/**
 * @type {(evaluation: import("../utils/types").Evaluation, parent: Element) => Void}
 */
const displayEvaluation = (evaluation, parent) => {
    console.log(evaluation);
    const evaluationElement = document.createElement('div');
    evaluationElement.classList.add('evaluation');
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
            if (evaluation.receiverStudentNumber) {
                return `
                    <div class="users">
                        <h6><span style="font-family: unset;">To:</span> <span style="font-family: unset;">${evaluation.receiverName} [${evaluation.receiverStudentNumber}]</span></h6>
                    </div>
                `;
            } else {
                return '';
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



profileAndEvaluationsButton.addEventListener('click', () => {
    pagesButton(false, profileAndEvaluationsButton);
    main.appendChild(profileAndEvaluations);

    main.innerHTML = `
        <div id="profileAndEvaluations">
            <h2>Profile and Evaluations</h2>
            <div id="profile"></div>
            <div id="evaluations">
            </div>
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
            displayStudent(response.payload, [
                {
                    name: 'requestEdit',
                    label: 'Request Edit',
                    callback: (student, buttonElement) => {
                        buttonElement.disabled = true;
                        fetch('/api/profileAndEvaluations/requestEdit.php', {
                            method: 'POST',
                            body: JSON.stringify({
                                studentNumber: student.studentNumber
                            }),
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }).then(response => response.blob())
                            .then(blob => {
                                buttonElement.disabled = false;
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.target = '_blank';
                                a.download = 'Request Profile Edit Form.pdf';
                                document.body.appendChild(a);
                                a.click();
                                a.remove();
                                alertUser('Success', 'Request edit downloaded.<br>Please print and fill up the form.', 'success');
                            });
                    }
                },
                {
                    name: 'changePassword',
                    label: 'Change Password',
                    callback: (student, buttonElement) => {
                        window.location.href = '/passwordReset.php';
                    }
                },
                {
                    id: 'generateStatisticalReport',
                    label: 'Generate Statistical Report',
                    callback: (student, buttonElement) => {
                        buttonElement.disabled = true;

                        fetch('./api/proFileAndEvaluations/generateReport.php', {
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
        });


    fetch('/api/profileAndEvaluations/evaluations.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.text())
        .then(res => {
            console.log(res);
            /** @type {import("../utils/types").Response}*/
            const response = JSON.parse(res);
            for (const evaluation of response.payload) {
                evaluation.contents = JSON.parse(evaluation.contents);
                evaluation.receiverStudentNumber = null;
                displayEvaluation(evaluation, document.querySelector('#main > #profileAndEvaluations > #evaluations'));
                evaluationsList.push(evaluation);
            };
        });

});
submitAnEvaluationButton.addEventListener('click', () => {
    pagesButton(false, submitAnEvaluationButton);
    main.appendChild(submitAnEvaluation);
    main.innerHTML = `
        <div id="submitAnEvaluation">
            <h2>Submit an Evaluation</h2>
            <div id="students">
                <div id="search">
                    <div class="textInput">
                        <label for="searchStudent">
                            <h6>Search Student</h6>
                        </label>
                        <input required type="search" name="searchStudent" id="searchStudent" placeholder="Student">
                    </div>

                    <span>
                        <button class="button">
                            <p><b>Search</b></p>
                        </button>
                    </span>
                </div>
            </div>

            <form id="form">
                <div id="student">
                    <img src="" alt="Profile Picture">
                    <div id="studentIdentification">
                        <h5 id="fullName"></h5>
                        <h5 id="studentNumber"></h5>
                    </div>
                    <div>
                        <button type="button" class="button sub" onClick="(() => {
                            submitAnEvaluationButton.click();
                        })()">
                            <p><b>Cancel</b></p>
                        </button>
                    </div>
                </div>
                <div id="instructions">
                    <h3>Instructions</h3>
                    <p>Rate the student based on the following criteria by clicking on the radio buttons;<br> where 1 is the lowest and 5 is the highest.<br><br> Just click on the radio button to select your rating.</p>
                </div>
            </form>
        </div>
    `;



    const searchStudent = document.querySelector('#main > #submitAnEvaluation > #students > #search > .textInput > #searchStudent');
    const searchButton = document.querySelector('#main > #submitAnEvaluation > #students > #search > span > .button');
    const students = document.querySelector('#main > #submitAnEvaluation > #students');

    searchButton.addEventListener('click', () => {
        const input = searchStudent.value;
        if (input == '') {
            return;
        };
        searchButton.disabled = true;
        // Remove the previous students
        for (const student of students.querySelectorAll('.student')) {
            student.remove();
        };

        fetch(`/api/submitAnEvaluation/searchStudents.php?search=${input}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.text())
            .then(res => {
                console.log(res);
                /** @type {import("../utils/types").Response}*/
                const response = JSON.parse(res);
                searchButton.disabled = false;

                if (response.status == 'success') {
                    if (response.payload.length == 0) {
                        alertUser('404', 'No student found.', 'alert');
                        return;
                    };
                    for (const student of response.payload) {
                        const studentElement = document.createElement('div');
                        studentElement.classList.add('student');
                        studentElement.id = `student_${student.studentNumber.replace(/\-/g, '_')}`;
                        studentElement.innerHTML = `
                            <img src="${student.profilePicture}" alt="Profile Picture">
                            <div id="studentIdentification">
                                <h5>${student.firstName} ${student.lastName}</h5>
                                <h5>${student.studentNumber}</h5>
                            </div>
                        `;
                        students.appendChild(studentElement);
                        document.querySelector(`#main > #submitAnEvaluation > #students > #student_${student.studentNumber.replace(/\-/g, '_')}`).addEventListener('click', () => {
                            document.querySelector('#main > #submitAnEvaluation > #students').style.display = 'none';
                            document.querySelector('#main > #submitAnEvaluation > #form').style.display = 'flex';
                            document.querySelector('#main > #submitAnEvaluation > #form > #student > img').src = student.profilePicture;
                            document.querySelector('#main > #submitAnEvaluation > #form > #student > #studentIdentification > #fullName').innerText = `${student.firstName} ${student.lastName}`;
                            document.querySelector('#main > #submitAnEvaluation > #form > #student > #studentIdentification > #studentNumber').innerText = student.studentNumber;
                        });
                    };
                } else {
                    alertUser('Error', response.message, 'alert');
                };
            });
    });
    searchStudent.addEventListener('keyup', (e) => {
        if (e.key == 'Enter') {
            searchButton.click();
        };
    });


    /**
     * @typedef {{
     *      name: String,
     *      descriptions: String[]
     * }} Criterion
     */

    /** @type {Criterion[]} */
    const ClassBehavior = [
        {
            name: 'Participation',
            descriptions: [
                'Minimal',
                'Occasional',
                'Regular',
                'Active',
                'Proactive',
            ]
        },
        {
            name: 'Punctuality',
            descriptions: [
                'Occasionally late',
                'Mostly on time',
                'Consistently on time',
                'Always early',
                'Consistently late'
            ]
        },
        {
            name: 'Respect',
            descriptions: [
                'Occasionally Disrespectful',
                'Generally Respectful',
                'Very Respectful',
                'Exemplary Respect',
                'Disrespectful'
            ]
        },
        {
            name: 'Cooperation',
            descriptions: [
                'Rarely Cooperative',
                'Usually Cooperative',
                'Very Cooperative',
                'Exceptionally Cooperative',
                'Uncooperative'
            ]
        },
        {
            name: 'Attentiveness',
            descriptions: [
                'Occasionally Distracted',
                'Generally Attentivene',
                'Very Attentive',
                'Exceptionally Attentive',
                'Distracted'
            ]
        }
    ];

    /** @type {Criterion[]} */
    const ClassStanding = [
        {
            name: 'Academic Performance',
            descriptions: [
                'Minimal collaboration, hindering teamwork.',
                'Needs improvement in communication and contribution.',
                'Satisfactory collaboration, room for enhancement.',
                'Actively engages, communicates well, positive contribution.',
                'Excels in collaboration, strong teamwork, leadership.'
            ]
        }, {
            name: 'Adaptability ',
            descriptions: [
                'Struggles to adapt to new situations, lacks flexibility.',
                'Limited adaptability, some difficulty adjusting.',
                'Adequate adaptability, with room for improvement.',
                'Demonstrates flexibility and adjusts well.',
                'Exceptional adaptability, thrives in diverse situations.'
            ]
        }, {
            name: 'Attendance and Punctuality',
            descriptions: [
                'Minimal sense of responsibility, often neglects tasks.',
                'Limited responsibility, inconsistent in task completion.',
                'Satisfactory sense of responsibility, room for improvement.',
                'Demonstrates responsibility, completes tasks reliably.',
                'Exceptional sense of responsibility, consistently reliable.'
            ]
        }, {
            name: 'Social Interaction',
            descriptions: [
                'Struggles with social interactions, limited engagement.',
                'Limited social interaction skills, occasional difficulty.',
                'Satisfactory social interaction, with room for improvement.',
                'Good social skills, interacts well with peers.',
                'Exceptional social interaction skills, fosters positive relationships.'
            ]
        }, {
            name: 'Motivation',
            descriptions: [
                'Lacks motivation, shows little interest in tasks.',
                'Limited motivation, inconsistent engagement.',
                'Satisfactory motivation, room for increased engagement.',
                'Demonstrates good motivation, actively engages.',
                'Exceptional motivation, consistently enthusiastic and committed'
            ]
        }
    ];

    {
        const criteria = document.createElement('div');
        criteria.classList.add('criteria');
        criteria.innerHTML = `
            <h2>Class Behavior</h2>
            <div></div>
        `;
        document.querySelector('#main > #submitAnEvaluation > #form').appendChild(criteria);
        const criteriaContainer = criteria.querySelector('div');
        let i = 0;
        for (const criterion of ClassBehavior) {
            const criterionElement = document.createElement('div');
            criterionElement.id = criterion.name.replace(/ /g, '');
            criterionElement.classList.add('criterion');
            if (i % 2 == 0) {
                criterionElement.classList.add('even');
            };
            criterionElement.innerHTML = `
                <h4>${criterion.name}</h4>
                <div id="rating">
                </div>
                <p id="description"></p>
            `;
            for (let i = 0; i < criterion.descriptions.length; i++) {
                const rate = `<input required type="radio" name="${criterion.name.replace(/ /g, '')}" id="${criterion.name.replace(/ /g, '')}-${i + 1}" value="${i + 1}" onClick="(() => {
                    document
                        .querySelector('#main > #submitAnEvaluation > #form > .criteria > div > .criterion:has(#rating > #${criterion.name.replace(/ /g, '')}-${i + 1}) > #description')
                        .innerText = '${criterion.descriptions[i]}';
                })()">`;
                criterionElement.querySelector('#rating').innerHTML += rate;
            };
            criteriaContainer.appendChild(criterionElement);
            i++;
        };
    };

    {
        const criteria = document.createElement('div');
        criteria.classList.add('criteria');
        criteria.innerHTML = `
            <h2>Class Standing</h2>
            <div></div>
        `;
        document.querySelector('#main > #submitAnEvaluation > #form').appendChild(criteria);
        let i = 0;
        const criteriaContainer = criteria.querySelector('div');
        for (const criterion of ClassStanding) {
            const criterionElement = document.createElement('div');
            criterionElement.id = criterion.name.replace(/ /g, '');
            criterionElement.classList.add('criterion');
            if (i % 2 == 0) {
                criterionElement.classList.add('even');
            };
            criterionElement.innerHTML = `
                <h4>${criterion.name}</h4>
                <div id="rating">
                </div>
                <p id="description"></p>
            `;
            for (let i = 0; i < criterion.descriptions.length; i++) {
                const rate = `<input required type="radio" name="${criterion.name.replace(/ /g, '')}" id="${criterion.name.replace(/ /g, '')}-${i + 1}" value="${i + 1}" onClick="(() => {
                    document
                        .querySelector('#main > #submitAnEvaluation > #form > .criteria > div > .criterion:has(#rating > #${criterion.name.replace(/ /g, '')}-${i + 1}) > #description')
                        .innerText = '${criterion.descriptions[i]}';
                })()">`;
                criterionElement.querySelector('#rating').innerHTML += rate;
            };
            criteriaContainer.appendChild(criterionElement);
            i++;
        };
    };

    document.querySelector('#main > #submitAnEvaluation > #form').innerHTML += `
        <div class="textInput">
            <label for="additionalStatement">
                <h6>Additional Statement</h6>
            </label>
            <textarea required type="text" name="additionalStatement" id="additionalStatement"
                placeholder="Justify your rating" cols="30" rows="10"></textarea>
        </div>

        <span>
            <button type="submit" class="button">
                <p><b>Submit</b></p>
            </button>
        </span>
    `;

    document.querySelector('#main > #submitAnEvaluation > #form > span > .button').addEventListener('click', () => {
        const studentNumber = document.querySelector('#main > #submitAnEvaluation > #form > #student > #studentIdentification > #studentNumber').innerText;
        const additionalStatement = document.querySelector('#main > #submitAnEvaluation > #form > .textInput > #additionalStatement').value;
        /**
         * @type {{
         *      name: String,
         *      value: String,
         *      category: String
         * }[]}
         */
        const criteria = [];
        for (const criterion of Array.from(document.querySelectorAll('#main > #submitAnEvaluation > #form > .criteria > div > .criterion'))) {
            const name = criterion.id;
            const checked = document.querySelector(`#main > #submitAnEvaluation > #form > .criteria > div > .criterion#${name} > #rating > input:checked`);
            const value = checked ? checked.value : '';
            criteria.push({
                name,
                value,
                category: document.querySelector(`#main > #submitAnEvaluation > #form > .criteria:has(#${name}) > h2`).innerText
            });
        };
        const data = {
            /** @type {String} */
            receiverStudentNumber: studentNumber,
            /** @type {String} */
            additionalStatement,
            evaluation: criteria
        };

        for (const criterion of criteria) {
            if (criterion.value == '') {
                alertUser('Error', 'Please rate all criteria.', 'alert');
                return;
            };
        };
        if (data.additionalStatement == '') {
            alertUser('Error', 'Please justify your rating.', 'alert');
            return;
        } else if (data.additionalStatement.length > 500) {
            alertUser('Error', 'Additional statement must not exceed 500 characters.', 'alert');
            return;
        };

        document.querySelector('#main > #submitAnEvaluation > #form > span > .button').disabled = true;

        fetch('/api/submitAnEvaluation/submit.php', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.text())
            .then(res => {
                console.log(res);
                document.querySelector('#main > #submitAnEvaluation > #form > span > .button').disabled = false;
                /** @type {import("../utils/types").Response}*/
                const response = JSON.parse(res);
                if (response.status == 'success') {
                    alertUser('Success', 'Evaluation submitted.', 'success');
                    submitAnEvaluationButton.click();
                } else {
                    alertUser('Error', response.message, 'alert');
                };
            });
    });
});
yourEvaluationsButton.addEventListener('click', () => {
    pagesButton(false, yourEvaluationsButton);
    main.appendChild(yourEvaluations);
    main.innerHTML = `
        <div id="yourEvaluations">
            <h2>Your Evaluations</h2>
            <div id="search">
                <div class="textInput">
                    <label for="searchStudent">
                        <h6>Search</h6>
                    </label>
                    <input required type="search" name="searchStudent" id="searchStudent" placeholder="Student">
                </div>
                <div>
                    <button class="button" onclick="(() => {
                        event.srcElement.disabled = true;
                    })();" id="search">
                        <p><b>Search</b></p>
                    </button>
                </div>
            </div>

            <div id="evaluations"></div>
        </div>
    `;

    evaluationsList.length = 0;

    fetch('/api/yourEvaluations/retrieve.php', {
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
                    displayEvaluation(evaluation, document.querySelector('#main > #yourEvaluations > #evaluations'));
                    evaluationsList.push(evaluation);
                };
            } else {
                alertUser('Error', response.message, 'alert');
            };
        });
});



pagesButton(true);



window.addEventListener('scroll', async (e) => {
    // Check if the page is scrolled to the bottom
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        // Check which page is active
        switch (window.location.hash.substring(1)) {
            case 'profileAndEvaluations':
                fetch(`./api/profileAndEvaluations/evaluations.php?start=${evaluationsList[evaluationsList.length - 1].timeAdded}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(response => response.text())
                    .then(res => {
                        console.log(res);
                        /** @type {import("../utils/types").Response}*/
                        const response = JSON.parse(res);
                        for (const evaluation of response.payload) {
                            evaluation.contents = JSON.parse(evaluation.contents);
                            evaluation.receiverStudentNumber = null;
                            displayEvaluation(evaluation, document.querySelector('#main > #profileAndEvaluations > #evaluations'));
                            evaluationsList.push(evaluation);
                        };
                    }).catch(err => {
                        console.log(err);
                        alertUser('Error', 'Failed to load more evaluations.', 'alert');
                    });
                break;
            case 'submitAnEvaluation':
                break;
            case 'yourEvaluations':
                fetch(`./api/yourEvaluations/retrieve.php?start=${evaluationsList[evaluationsList.length - 1].timeAdded}`, {
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
                                displayEvaluation(evaluation, document.querySelector('#main > #yourEvaluations > #evaluations'));
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
            default:
                break;
        };
    };
});