
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

    document.getElementById('students').appendChild(studentInfo);

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
        fetch(`./api/allEvaluations/search.php?search=${document.getElementById('student').value}`, {
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
                    alertUser('404', 'No evaluations more found.', 'alert');
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
        fetch(`./api/allStudents/search.php?search=${document.getElementById('student').value}`, {
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
                        displayStudent(student, []);
                    };
                }
            }).catch(error => {
                console.log(error);
                alertUser('Error', 'An error occured while fetching the students.', 'alert');
            });
    });



    fetch('./api/allStudents/retrieve.php', {
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
                displayStudent(student, []);
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
    <h2 style="width: 100%; text-align: center;">Rgistration Queue</h2>
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
        fetch(`./api/registrationQueue/search.php?search=${document.getElementById('student').value}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.text())
            .then(res => {
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
                                    fetch('./api/registrationQueue/accept.php', {
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
                                    fetch('./api/registrationQueue/ask.php', {
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
                                id: 'reject',
                                label: 'Reject',
                                callback: (student) => {
                                    console.log(student);

                                    fetch('./api/registrationQueue/reject.php', {
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



    fetch('./api/registrationQueue/retrieve.php', {
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
                            fetch('./api/registrationQueue/accept.php', {
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
                            fetch('./api/registrationQueue/ask.php', {
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
                        id: 'editInformation',
                        label: 'Edit Information',
                        callback: (student, buttonElement) => {

                        }
                    },
                    {
                        id: 'reject',
                        label: 'Reject',
                        callback: (student) => {
                            console.log(student);

                            fetch('./api/registrationQueue/reject.php', {
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
});



pagesButton(true);



window.addEventListener('scroll', async (e) => {
    // Check if the page is scrolled to the bottom
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        // Check which page is active
        switch (window.location.hash.substring(1)) {
            case 'allEvaluations':
                fetch(`./api/allEvaluations/retrieve.php?start=${evaluationsList[evaluationsList.length - 1].timeAdded}`, {
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
                                alertUser('404', 'No evaluations more found.', 'alert');
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
                break;
            case 'registrationQueue':
                fetch(`./api/registrationQueue/retrieve.php?start=${studentsList[studentsList.length - 1].timeAdded}&search=${document.getElementById('student').value}`, {
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
                                        fetch('./api/registrationQueue/accept.php', {
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
                                        fetch('./api/registrationQueue/ask.php', {
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
                                    id: 'editInformation',
                                    label: 'Edit Information',
                                    callback: (student, buttonElement) => {

                                    }
                                },
                                {
                                    id: 'reject',
                                    label: 'Reject',
                                    callback: (student) => {
                                        console.log(student);

                                        fetch('./api/registrationQueue/reject.php', {
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
                break;
            default:
                break;
        };
    };
});