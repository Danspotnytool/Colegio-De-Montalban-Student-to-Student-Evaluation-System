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
    $query = "SELECT * FROM admins WHERE token = '$token'";
    $result = mysqli_query($databaseConnection, $query);
    $admin = mysqli_fetch_assoc($result);

    // Check if the user exists
    if (!$admin) {
        // Redirect the user to the admin login
        header('Location: /adminLogin.php');
        $content['type'] = 'redirect';
        $content['payload']['redirect'] = '/adminLogin.php';
    };
} else {
    // Redirect the user to the admin login
    header('Location: /adminLogin.php');
    $content['type'] = 'redirect';
    $content['payload']['redirect'] = '/adminLogin.php';
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
    <title>Colegio de Montalban Student to Student Evaluation System</title>

    <link rel="shortcut icon" href="<?php echo $url; ?>assets/Favicon.png" type="image/x-icon">

    <link rel="stylesheet" href="<?php echo $url; ?>fonts/font-face.css">

    <link rel="stylesheet" href="<?php echo $url; ?>css/index.css">
    <link rel="stylesheet" href="<?php echo $url; ?>css/dashboard.css">
    <link rel="stylesheet" href="<?php echo $url; ?>css/adminDashboard.css">

    <script src="<?php echo $url; ?>js/index.js" defer></script>
    <script src="<?php echo $url; ?>js/adminDashboard.js" defer></script>
</head>

<body>
    <input type="checkbox" id="sidebarButton" checked>
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="80" height="80" fill="" />
        <path d="M37.5 30L27.5 40L37.5 50L40 47.5L32.5 40L40 32.5L37.5 30Z" fill="var(--color-plain)" />
        <path d="M50 30L40 40L50 50L52.5 47.5L45 40L52.5 32.5L50 30Z" fill="var(--color-plain)" />
    </svg>

    <div id="sidebarPanel">
        <div id="header">
            <img src="<?php echo $url; ?>assets/CDM Logo.png" alt="CDM Logo">
            <div>
                <h3>Student to Student</h3>
                <h4>Evaluation System</h4>
            </div>
        </div>
        <div id="map">
            <a href="#allEvaluations" class="page active">
                <h5>All Evaluations</h5>
            </a>
            <a href="#allStudents" class="page">
                <h5>All Students</h5>
            </a>
            <a href="#registrationQueue" class="page">
                <h5>Registration Queue</h5>
            </a>
            <a href="#systemLogs" class="page">
                <h5>System Logs</h5>
            </a>
        </div>
        <button class="button sub" onclick="(() => {
            document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            window.location.href = '/adminLogin.php';
        })();">
            <p><b>Logout</b></p>
        </button>
    </div>



    <div id="main">
        <!-- <div id="allStudents">
            <div id="header">
                <div class="textInput">
                    <label for="student">
                        <h6>Search</h6>
                    </label>
                    <input readonly type="text" name="student" id="student" value="Student">
                </div>

                <div id="tags">
                    <div class="dropdown">
                        <label for="sort">
                            <h6>Sort</h6>
                        </label>

                        <select readonly name="sort" id="sort">
                            <option value="newest">Newest</option>
                            <option value="oldest">oldest</option>
                        </select>
                        <svg width="20" height="15" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 15.5L0 5.5V0.5L10 10.5L20 0.5V5.5L10 15.5Z" fill="var(--color-secondary)" />
                        </svg>
                    </div>

                    <div class="dropdown">
                        <label for="filters">
                            <h6>Filters</h6>
                        </label>

                        <select readonly name="filters" id="filters">
                            <option value="">N/A</option>
                        </select>
                        <svg width="20" height="15" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 15.5L0 5.5V0.5L10 10.5L20 0.5V5.5L10 15.5Z" fill="var(--color-secondary)" />
                        </svg>
                    </div>
                </div>
            </div>

            <div id="students">
                <form method="POST" action="" class="studentInfo detailed">
                    <img src="<?php echo $url; ?>assets/Student Picture.png" alt="Student Picture">

                    <div class="form">
                        <div class="row" id="fullName">
                            <div class="textInput">
                                <label for="firstName">
                                    <h6>First Name</h6>
                                </label>
                                <input readonly type="text" name="firstName" id="firstName" value="John">
                            </div>

                            <div class="textInput">
                                <label for="middleName">
                                    <h6>Middle Name</h6>
                                </label>
                                <input type="text" name="middleName" id="middleName" value="Dougma">
                            </div>

                            <div class="textInput">
                                <label for="lastName">
                                    <h6>Last Name</h6>
                                </label>
                                <input readonly type="text" name="lastName" id="lastName" value="Backt">
                            </div>
                        </div>
                        <div class="textInput">
                            <label for="studentNumber">
                                <h6>Student Number</h6>
                            </label>
                            <input readonly type="text" name="studentNumber" id="studentNumber" value="20-00001">
                        </div>

                        <div class="row">
                            <div class="textInput">
                                <label for="gender">
                                    <h6>Gender</h6>
                                </label>
                                <input readonly type="text" name="gender" id="gender" value="Male">
                            </div>

                            <div class="textInput">
                                <label for="birthday">
                                    <h6>Birthday</h6>
                                </label>
                                <input readonly type="date" name="birthday" id="birthday" value="mm/dd/yy">
                            </div>
                        </div>

                        <div class="row">
                            <div class="textInput">
                                <label for="course">
                                    <h6>Course</h6>
                                </label>
                                <input readonly type="text" name="course" id="course" value="BSIT">
                            </div>

                            <div class="textInput">
                                <label for="yearAndSection">
                                    <h6>Year and Section</h6>
                                </label>
                                <input readonly type="text" name="yearAndSection" id="yearAndSection" value="1A">
                            </div>
                        </div>

                        <div class="textInput">
                            <label for="emailAddress">
                                <h6>Email</h6>
                            </label>
                            <input readonly type="email" name="emailAddress" id="emailAddress"
                                value="example@gmail.com">
                        </div>
                    </div>
                </form>
                <form method="POST" action="" class="studentInfo registrant">
                    <div id="profile">
                        <img src="<?php echo $url; ?>assets/Student Picture.png" alt="Student Picture">

                        <div class="form">
                            <div class="row" id="fullName">
                                <div class="textInput">
                                    <label for="firstName">
                                        <h6>First Name</h6>
                                    </label>
                                    <input readonly type="text" name="firstName" id="firstName" value="John">
                                </div>

                                <div class="textInput">
                                    <label for="middleName">
                                        <h6>Middle Name</h6>
                                    </label>
                                    <input type="text" name="middleName" id="middleName" value="Dougma">
                                </div>

                                <div class="textInput">
                                    <label for="lastName">
                                        <h6>Last Name</h6>
                                    </label>
                                    <input readonly type="text" name="lastName" id="lastName" value="Backt">
                                </div>
                            </div>
                            <div class="textInput">
                                <label for="studentNumber">
                                    <h6>Student Number</h6>
                                </label>
                                <input readonly type="text" name="studentNumber" id="studentNumber" value="20-00001">
                            </div>

                            <div class="row">
                                <div class="textInput">
                                    <label for="gender">
                                        <h6>Gender</h6>
                                    </label>
                                    <input readonly type="text" name="gender" id="gender" value="Male">
                                </div>

                                <div class="textInput">
                                    <label for="birthday">
                                        <h6>Birthday</h6>
                                    </label>
                                    <input readonly type="date" name="birthday" id="birthday" value="mm/dd/yy">
                                </div>
                            </div>

                            <div class="row">
                                <div class="textInput">
                                    <label for="course">
                                        <h6>Course</h6>
                                    </label>
                                    <input readonly type="text" name="course" id="course" value="BSIT">
                                </div>

                                <div class="textInput">
                                    <label for="yearAndSection">
                                        <h6>Year and Section</h6>
                                    </label>
                                    <input readonly type="text" name="yearAndSection" id="yearAndSection" value="1A">
                                </div>
                            </div>

                            <div class="textInput">
                                <label for="emailAddress">
                                    <h6>Email</h6>
                                </label>
                                <input readonly type="email" name="emailAddress" id="emailAddress"
                                    value="example@gmail.com">
                            </div>
                        </div>
                    </div>

                    <div id="action">
                        <button type="submit" class="button">
                            <p><b>Accept</b></p>
                        </button>
                        <button type="submit" class="button">
                            <p><b>Ask for more information.</b></p>
                        </button>
                        <button type="submit" class="button">
                            <p><b>Reject</b></p>
                        </button>
                    </div>
                </form>
            </div>
        </div> -->
    </div>
</body>

</html>