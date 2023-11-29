<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register - Colegio de Montalban Student to Student Evaluation System</title>

    <link rel="shortcut icon" href="./assets/Favicon.png" type="image/x-icon">

    <link rel="stylesheet" href="./fonts/font-face.css">

    <link rel="stylesheet" href="./css/index.css">
    <link rel="stylesheet" href="./css/register.css">
</head>

<body>
    <div id="main">
        <div id="registerPanel">
            <div id="header">
                <img src="./assets/CDM Logo.png" alt="CDM Logo">
                <div>
                    <h2>Student to Student</h2>
                    <h3>Evaluation System</h3>
                </div>
            </div>



            <form action="/register.php" method="POST" id="registerForm">
                <span id="fullName">
                    <div class="textInput">
                        <label for="firstName">
                            <h6>First Name</h6>
                        </label>
                        <input required type="text" name="firstName" id="firstName" placeholder="John">
                    </div>

                    <div class="textInput">
                        <label for="middleName">
                            <h6>Middle Name</h6>
                        </label>
                        <input type="text" name="middleName" id="middleName" placeholder="Dougma">
                    </div>

                    <div class="textInput">
                        <label for="lastName">
                            <h6>Last Name</h6>
                        </label>
                        <input required type="text" name="lastName" id="lastName" placeholder="Backt">
                    </div>
                </span>



                <div class="textInput">
                    <label for="studentNumber">
                        <h6>Student Number</h6>
                    </label>
                    <input required type="text" name="studentNumber" id="studentNumber" placeholder="20-00001">
                </div>



                <span>
                    <div class="dropdown">
                        <label for="gender">
                            <h6>Gender</h6>
                        </label>

                        <select required name="gender" id="gender">
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                        <svg width="20" height="15" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 15.5L0 5.5V0.5L10 10.5L20 0.5V5.5L10 15.5Z" fill="var(--color-secondary)" />
                        </svg>
                    </div>

                    <div class="textInput">
                        <label for="birthday">
                            <h6>Birthday</h6>
                        </label>
                        <input required type="date" name="birthday" id="birthday" placeholder="mm/dd/yy">
                    </div>

                    <div class="textInput">
                        <label for="profilePicture">
                            <h6>Profile Picture</h6>
                        </label>
                        <input required type="file" name="profilePicture" id="profilePicture" placeholder="Upload">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M9.33438 0.660937C9.05495 1.02344 8.05495 2.31875 7.11303 3.53906L5.40031 5.75781L7.12402 5.76563C8.83517 5.77344 8.84615 5.77344 8.84301 5.80469C8.83988 5.82188 8.83203 5.88125 8.82261 5.9375C8.81162 6.00625 8.80691 7.21094 8.81005 9.71875C8.81633 13.7359 8.80848 13.4203 8.9011 13.6406C9.16327 14.2594 9.91366 14.5094 10.5133 14.1797C10.5808 14.1422 10.6703 14.0703 10.7567 13.9844C10.8697 13.8719 10.9042 13.8234 10.9639 13.7016C11.0942 13.4344 11.0848 13.7781 11.0785 9.60156C11.0754 7.55625 11.0675 5.85625 11.0597 5.825L11.0487 5.76563L14.2889 5.75781L13.3485 4.53906C12.8305 3.86875 11.8305 2.57344 11.1256 1.66094L9.84458 0L9.33438 0.660937Z"
                                fill="var(--color-secondary)" />
                            <path
                                d="M0 20H20V8.34375H13.5479V10.4063H17.5196V17.9375H2.48038V10.4063H6.76609L6.76295 9.37813L6.75824 8.35156L0 8.34375V20Z"
                                fill="var(--color-secondary)" />
                        </svg>
                    </div>
                </span>



                <span>
                    <div class="dropdown">
                        <label for="course">
                            <h6>Course</h6>
                        </label>
                
                        <select required name="course" id="course">
                            <option value="BSIT">BSIT</option>
                            <option value="BSCpE">BSCpE</option>
                        </select>
                        <svg width="20" height="15" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 15.5L0 5.5V0.5L10 10.5L20 0.5V5.5L10 15.5Z" fill="var(--color-secondary)" />
                        </svg>
                    </div>
                
                    <div class="textInput">
                        <label for="yearAndSection">
                            <h6>Year and Section</h6>
                        </label>
                        <input required type="text" name="yearAndSection" id="yearAndSection" placeholder="1A">
                    </div>
                </span>
                
                
                
                <div class="textInput">
                    <label for="emailAddress">
                        <h6>Email</h6>
                    </label>
                    <input required type="email" name="emailAddress" id="emailAddress" placeholder="example@gmail.com">
                </div>

                <div class="textInput">
                    <label for="password">
                        <h6>Password</h6>
                    </label>
                    <input required type="password" name="password" id="password" placeholder="#############">
                </div>

                <div class="textInput">
                    <label for="confirmPassword">
                        <h6>Confirm</h6>
                    </label>
                    <input required type="confirmPassword" name="confirmPassword" id="confirmPassword"
                        placeholder="#############">
                </div>

                <button type="submit" class="button">
                    <p><b>Register</b></p>
                </button>
            </form>
            <p class="postscript"><i>Already Registered? <a href="login.php">Login instead</a></i></p>
        </div>
    </div>
</body>

</html>