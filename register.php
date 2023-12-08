<?php

include('./utils/databaseConnection.php');
$databaseConnection = databaseConnection();



// Get the request cookies
$cookies = $_COOKIE;
// Get the request sender path
$path = $_SERVER['REQUEST_URI'];



// System logs
$time = time();
$HTTP_X_FORWARDED_FOR = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '';
$HTTP_CLIENT_IP = $_SERVER['REMOTE_ADDR'] ?? '';
$USER_AGENT = $_SERVER['HTTP_USER_AGENT'] ?? '';
$content = <<<EOT
    {
        "time": $time,
        "type": "visit",
        "payload": {
            "path": "$path",
            "ip": {
                "HTTP_X_FORWARDED_FOR": "$HTTP_X_FORWARDED_FOR",
                "HTTP_CLIENT_IP": "$HTTP_CLIENT_IP"
            },
            "userAgent": "$USER_AGENT"
        }
    }
EOT;

$content = json_decode($content, true);



// Check if the request sender is logged in
if (
    isset($cookies['token']) &&
    $cookies['token'] != ''
) {
    // Get the user from the database
    $token = $cookies['token'];
    $query = "SELECT * FROM students WHERE token = '$token'";

    $result = mysqli_query($databaseConnection, $query);

    // Check if the user exists
    if (
        mysqli_num_rows($result) > 0
    ) {
        // Redirect the user to the dashboard
        header('Location: /dashboard.php');
        $content['payload']['token'] = $token;
        $content['type'] = 'redirect';
        $content['payload']['redirect'] = '/dashboard.php';
    };
};

$content = json_encode($content);

$id = $time . '-' . uniqid();

// Insert the system logs to the database
$query = "INSERT INTO system_logs (id, timeAdded, content) VALUES ('$id', '$time', '$content')";
mysqli_query($databaseConnection, $query);



$url = $_SERVER['REQUEST_SCHEME'] . '://' . $_SERVER['HTTP_HOST'] . '/';

?>



<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register - Colegio de Montalban Student to Student Evaluation System</title>

    <link rel="shortcut icon" href="<?php echo $url; ?>assets/Favicon.png" type="image/x-icon">

    <link rel="stylesheet" href="<?php echo $url; ?>fonts/font-face.css">

    <link rel="stylesheet" href="<?php echo $url; ?>css/index.css">
    <link rel="stylesheet" href="<?php echo $url; ?>css/register.css">

    <script src="<?php echo $url; ?>js/index.js" defer></script>
    <script src="<?php echo $url; ?>js/register.js" defer></script>
</head>

<body>
    <div id="main">
        <div id="registerPanel">
            <div id="header">
                <img src="<?php echo $url; ?>assets/CDM Logo.png" alt="CDM Logo">
                <div>
                    <h2>Student to Student</h2>
                    <h3>Evaluation System</h3>
                </div>
            </div>



            <form id="registerForm">
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
                            <option value="">Prefer not to say</option>
                        </select>
                        <svg width="20" height="15" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 15.5L0 5.5V0.5L10 10.5L20 0.5V5.5L10 15.5Z" fill="var(--color-secondary)" />
                        </svg>
                    </div>

                    <div class="textInput">
                        <label for="birthday">
                            <h6>Birthday</h6>
                        </label>
                        <input required type="date" name="birthday" id="birthday" placeholder="01/01/2020">
                    </div>

                    <div class="textInput">
                        <label for="profilePicture">
                            <h6>Profile Picture</h6>
                        </label>
                        <input required type="file" name="profilePicture" accept="image/png, image/gif, image/jpeg" id="profilePicture" placeholder="Upload">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.33438 0.660937C9.05495 1.02344 8.05495 2.31875 7.11303 3.53906L5.40031 5.75781L7.12402 5.76563C8.83517 5.77344 8.84615 5.77344 8.84301 5.80469C8.83988 5.82188 8.83203 5.88125 8.82261 5.9375C8.81162 6.00625 8.80691 7.21094 8.81005 9.71875C8.81633 13.7359 8.80848 13.4203 8.9011 13.6406C9.16327 14.2594 9.91366 14.5094 10.5133 14.1797C10.5808 14.1422 10.6703 14.0703 10.7567 13.9844C10.8697 13.8719 10.9042 13.8234 10.9639 13.7016C11.0942 13.4344 11.0848 13.7781 11.0785 9.60156C11.0754 7.55625 11.0675 5.85625 11.0597 5.825L11.0487 5.76563L14.2889 5.75781L13.3485 4.53906C12.8305 3.86875 11.8305 2.57344 11.1256 1.66094L9.84458 0L9.33438 0.660937Z" fill="var(--color-secondary)" />
                            <path d="M0 20H20V8.34375H13.5479V10.4063H17.5196V17.9375H2.48038V10.4063H6.76609L6.76295 9.37813L6.75824 8.35156L0 8.34375V20Z" fill="var(--color-secondary)" />
                        </svg>
                    </div>
                </span>



                <span>
                    <div class="dropdown">
                        <label for="course">
                            <h6>Course</h6>
                        </label>

                        <select required name="course" id="course">
                            <option value="BSIT">Bachelor of Science in Information Technoloty</option>
                            <option value="BSCpE">Bachelor of Science in Computer Engineering</option>

                            <option value="BSEd-SCI">Bachelor of Secondary Education major in Science</option>
                            <option value="BEEd-GEN">Bachelor of Elementary Education - Generalist</option>
                            <option value="BEEd-ECED">Bachelor of Early Childhood Education</option>
                            <option value="BTLEd-ICT">Bachelor of Technology and Livelihood Education major in Information and Communication Technology</option>

                            <option value="BSBA-HRM">Bachelor of Science in Business Administration Major in Human Resource Management</option>
                            <option value="BSE">Bachelor of Science in Entrepreneurship</option>
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
                    <input required type="password" name="confirmPassword" id="confirmPassword" placeholder="#############">
                </div>

                <button type="submit" class="button" id="register">
                    <p><b>Register</b></p>
                </button>
            </form>
            <p class="postscript"><i>Already Registered? <a href="login.php">Login instead</a></i></p>
        </div>
    </div>
</body>

</html>