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
    $query = "SELECT * FROM admins WHERE token = '$token'";
    $result = mysqli_query($databaseConnection, $query);
    $admin = mysqli_fetch_assoc($result);

    // Check if the user exists
    if ($admin) {
        // Redirect the user to the admin dashboard
        header('Location: ./adminDashboard.php');
    };
};

?>



<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin - Colegio de Montalban Student to Student Evaluation System</title>

    <link rel="shortcut icon" href="./assets/Favicon.png" type="image/x-icon">

    <link rel="stylesheet" href="./fonts/font-face.css">

    <link rel="stylesheet" href="./css/index.css">
    <link rel="stylesheet" href="./css/login.css">

    <script src="./js/index.js" defer></script>
    <script src="./js/adminLogin.js" defer></script>
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

            <form id="loginForm">
                <div class="textInput">
                    <label for="adminID">
                        <h6>Admin ID</h6>
                    </label>
                    <input required type="text" name="adminID" id="adminID" placeholder="00.0000000000.001">
                </div>

                <div class="textInput">
                    <label for="adminKey">
                        <h6>Admin Key</h6>
                    </label>
                    <input required type="password" name="adminKey" id="adminKey" placeholder="#############">
                </div>

                <button type="submit" class="button" id="login">
                    <p><b>Login</b></p>
                </button>
            </form>
        </div>
    </div>
</body>

</html>