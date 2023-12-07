<?php

include('databaseConnection.php');
$databaseConnection = databaseConnection();



// Get the request cookies
$cookies = $_COOKIE;
// Get the request sender path
$path = $_SERVER['REQUEST_URI'];



// Check if the cookies are set and if there is a token
if (
    isset($cookies['token']) &&
    $cookies['token'] != ''
) {
    // Get the token
    $token = $cookies['token'];
    // Check if the token is for admin or student
    // If the token starts with "AD.", it is for admin
    // If the token starts with "US.", it is for student
    if (substr($token, 0, 3) == 'AD.') {
        // Get the admin from the database table "admins"
        $token = substr($token, 3);
        $getAdminQuery = "SELECT * FROM admins WHERE token = '$token'";
        $getAdminResult = mysqli_query($databaseConnection, $getAdminQuery);
        $admin = mysqli_fetch_assoc($getAdminResult);
        // Check if path is not the admin login page
        if ($path != '/adminLogin.php') {
            // Check if the admin is not logged in
            if ($admin == null) {
                // Redirect to the admin login page
                header('Location: /adminLogin.php');
            };
        };
    } else if (substr($token, 0, 3) == 'US.') {
    } else {
        // If the token is invalid, redirect to the login page
        header('Location: /login.php');
    };
} else {
    // If there is no token, redirect to the login page if the request sender path is not the login page
    if (
        $path != '/login.php' &&
        $path != '/register.php' &&
        $path != '/passwordReset.php' &&
        $path != '/adminLogin.php'
    ) {
        header('Location: /login.php');
    };
};
