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
    if ($admin) {
        // Redirect the user to the admin dashboard
        header('Location: /adminDashboard.php');
        $content['payload']['token'] = $token;
        $content['type'] = 'redirect';
        $content['payload']['redirect'] = '/adminDashboard.php';
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
    <title>Admin - Colegio de Montalban Student to Student Evaluation System</title>

    <link rel="shortcut icon" href="<?php echo $url; ?>assets/Favicon.png" type="image/x-icon">

    <link rel="stylesheet" href="<?php echo $url; ?>fonts/font-face.css">

    <link rel="stylesheet" href="<?php echo $url; ?>css/index.css">
    <link rel="stylesheet" href="<?php echo $url; ?>css/login.css">

    <script src="<?php echo $url; ?>js/index.js" defer></script>
    <script src="<?php echo $url; ?>js/adminLogin.js" defer></script>
</head>

<body>
    <div id="main">
        <div id="loginPanel">
            <div id="header">
                <img src="<?php echo $url; ?>assets/CDM Logo.png" alt="CDM Logo">
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