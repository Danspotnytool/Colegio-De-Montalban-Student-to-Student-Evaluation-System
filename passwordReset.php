<?php

include('./utils/databaseConnection.php');
$databaseConnection = databaseConnection();



// Get the request cookies
$cookies = $_COOKIE;
// Get the request sender path
$path = $_SERVER['REQUEST_URI'];


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
        header('Location: ./dashboard.php');
    };
};

?>



<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset - Colegio de Montalban Student to Student Evaluation System</title>

    <link rel="shortcut icon" href="./assets/Favicon.png" type="image/x-icon">

    <link rel="stylesheet" href="./fonts/font-face.css">

    <link rel="stylesheet" href="./css/index.css">
    <link rel="stylesheet" href="./css/login.css">

    <script src="./js/index.js" defer></script>
</head>

<body>
    <div id="main">
        <div id="loginPanel">
            <div id="header">
                <img src="./assets/CDM Logo.png" alt="CDM Logo">
                <div>
                    <h2>Student to Student</h2>
                    <h3>Evaluation System</h3>
                </div>
            </div>



            <form action="/passwordReset.php" method="POST" id="loginForm">
                <div class="textInput">
                    <label for="studentNumber">
                        <h6>Student Number</h6>
                    </label>
                    <input required type="text" name="studentNumber" id="studentNumber" placeholder="20-00001">
                </div>

                <div class="textInput">
                    <label for="emailAddress">
                        <h6>Email</h6>
                    </label>
                    <input required type="email" name="emailAddress" id="emailAddress" placeholder="example@gmail.com">
                </div>

                <button type="submit" class="button">
                    <p><b>Reset</b></p>
                </button>
            </form>

            <p class="postscript"><i>New here? <a href="register.php">Register instead</i></a></p>
        </div>
    </div>
</body>

</html>