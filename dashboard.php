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
    $student = mysqli_fetch_assoc($result);

    // Check if the user exists
    if (!$student) {
        // Redirect the user to the student login
        header('Location: /login.php');
        $content['type'] = 'redirect';
        $content['payload']['redirect'] = '/login.php';
    };
} else {
    // Redirect the user to the student login
    header('Location: /login.php');
    $content['type'] = 'redirect';
    $content['payload']['redirect'] = '/login.php';
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

    <script src="<?php echo $url; ?>js/dashboard.js" defer></script>
    <script src="<?php echo $url; ?>js/index.js" defer></script>
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
            <a href="#profileAndEvaluations" class="page active">
                <h5>Profile and Evaluations</h5>
            </a>
            <a href="#submitAnEvaluation" class="page">
                <h5>Submit an Evaluation</h5>
            </a>
            <a href="#yourEvaluations" class="page">
                <h5>Your Evaluations</h5>
            </a>
        </div>
        <button class="button sub" onclick="(() => {
            document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            window.location.href = '/login.php';
        })();">
            <p><b>Logout</b></p>
        </button>
    </div>



    <div id="main">
        <!-- <div id="profileAndEvaluations">
            <div class="studentInfo">
                <img src="<?php echo $url; ?>assets/Student Picture.png" alt="Student Picture">
                <div class="studentIdentification">
                    <h1>John Dougma Backt</h1>
                    <h2>20-00001</h2>
                    <h3>BSIT 1A</h3>
                </div>
            </div>

            <div class="evaluation">
                <div class="date">
                    <h5>January 1, 2020</h5>
                </div>
                <div class="criteria">
                    <div>
                        <h2>Class Behavior</h2>
                        <div class="criterion">
                            <h6>Participation</h6>
                            <h6>5</h6>
                        </div>
                        <div class="criterion">
                            <h6>Punctuality</h6>
                            <h6>5</h6>
                        </div>
                        <div class="criterion">
                            <h6>Respect</h6>
                            <h6>5</h6>
                        </div>
                        <div class="criterion">
                            <h6>Cooperation</h6>
                            <h6>5</h6>
                        </div>
                        <div class="criterion">
                            <h6>Attentiveness</h6>
                            <h6>5</h6>
                        </div>
                    </div>
                    <div>
                        <h2>Class Standing</h2>
                        <div class="criterion">
                            <h6>Collaboration</h6>
                            <h6>5</h6>
                        </div>
                        <div class="criterion">
                            <h6>Adaptability</h6>
                            <h6>5</h6>
                        </div>
                        <div class="criterion">
                            <h6>Responsibility</h6>
                            <h6>5</h6>
                        </div>
                        <div class="criterion">
                            <h6>Social Interaction</h6>
                            <h6>5</h6>
                        </div>
                        <div class="criterion">
                            <h6>Motivation</h6>
                            <h6>5</h6>
                        </div>
                    </div>
                </div>
                <div class="additionalStatement">
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                        labore
                        et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
                        ut
                        aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                        cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                        culpa qui officia deserunt mollit anim id est laborum.</p>
                </div>
            </div>

            <div class="evaluation">
                <div class="date">
                    <h5>January 1, 2020</h5>
                </div>
                <div class="users">
                    <h5>From: John Dougma Backt (20-00001)</h5>
                    <h5>To: John Dougma Backt (20-00001)</h5>
                </div>
                <div class="criteria">
                    <div>
                        <h2>Class Behavior</h2>
                        <div class="criterion">
                            <h6>Participation</h6>
                            <h6>5</h6>
                        </div>
                        <div class="criterion">
                            <h6>Punctuality</h6>
                            <h6>5</h6>
                        </div>
                        <div class="criterion">
                            <h6>Respect</h6>
                            <h6>5</h6>
                        </div>
                        <div class="criterion">
                            <h6>Cooperation</h6>
                            <h6>5</h6>
                        </div>
                        <div class="criterion">
                            <h6>Attentiveness</h6>
                            <h6>5</h6>
                        </div>
                    </div>
                    <div>
                        <h2>Class Standing</h2>
                        <div class="criterion">
                            <h6>Collaboration</h6>
                            <h6>5</h6>
                        </div>
                        <div class="criterion">
                            <h6>Adaptability</h6>
                            <h6>5</h6>
                        </div>
                        <div class="criterion">
                            <h6>Responsibility</h6>
                            <h6>5</h6>
                        </div>
                        <div class="criterion">
                            <h6>Social Interaction</h6>
                            <h6>5</h6>
                        </div>
                        <div class="criterion">
                            <h6>Motivation</h6>
                            <h6>5</h6>
                        </div>
                    </div>
                </div>
                <div class="additionalStatement">
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                        labore
                        et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
                        ut
                        aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                        cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                        culpa qui officia deserunt mollit anim id est laborum.</p>
                </div>
            </div>
        </div> -->
        <!-- <div id="yourEvaluations">
            <div id="search">
                <div class="textInput">
                    <label for="searchStudent">
                        <h6>Search</h6>
                    </label>
                    <input required type="search" name="searchStudent" id="searchStudent" placeholder="Student">
                </div>
            </div>



            <div id="evaluations">
                <div id="student">
                    <div id="studentInfo">
                        <img src="<?php echo $url; ?>assets/Student Picture.png" alt="Student Picture">
                        <div id="studentIdentification">
                            <h4>John Dougma Backt</h4>
                            <h5>20-00001</h5>
                        </div>
                    </div>

                    <button type="submit" class="button sub">
                        <p><b>Evaluate</b></p>
                    </button>
                </div>

                <div class="evaluation">
                    <div class="date">
                        <h5>January 1, 2020</h5>
                    </div>
                    <div class="criteria">
                        <div>
                            <h2>Class Behavior</h2>
                            <div class="criterion">
                                <h6>Participation</h6>
                                <h6>5</h6>
                            </div>
                            <div class="criterion">
                                <h6>Punctuality</h6>
                                <h6>5</h6>
                            </div>
                            <div class="criterion">
                                <h6>Respect</h6>
                                <h6>5</h6>
                            </div>
                            <div class="criterion">
                                <h6>Cooperation</h6>
                                <h6>5</h6>
                            </div>
                            <div class="criterion">
                                <h6>Attentiveness</h6>
                                <h6>5</h6>
                            </div>
                        </div>
                        <div>
                            <h2>Class Standing</h2>
                            <div class="criterion">
                                <h6>Collaboration</h6>
                                <h6>5</h6>
                            </div>
                            <div class="criterion">
                                <h6>Adaptability</h6>
                                <h6>5</h6>
                            </div>
                            <div class="criterion">
                                <h6>Responsibility</h6>
                                <h6>5</h6>
                            </div>
                            <div class="criterion">
                                <h6>Social Interaction</h6>
                                <h6>5</h6>
                            </div>
                            <div class="criterion">
                                <h6>Motivation</h6>
                                <h6>5</h6>
                            </div>
                        </div>
                    </div>
                    <div class="additionalStatement">
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                            labore
                            et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                            nisi
                            ut
                            aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit
                            esse
                            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt
                            in
                            culpa qui officia deserunt mollit anim id est laborum.</p>
                    </div>
                </div>
            </div>
        </div> -->
    </div>
</body>

</html>