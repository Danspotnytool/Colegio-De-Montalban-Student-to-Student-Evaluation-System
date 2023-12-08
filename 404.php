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
    <title>Error: 404 - Colegio de Montalban Student to Student Evaluation System</title>

    <link rel="shortcut icon" href="<?php echo $url; ?>assets/Favicon.png" type="image/x-icon">

    <link rel="stylesheet" href="<?php echo $url; ?>fonts/font-face.css">

    <link rel="stylesheet" href="<?php echo $url; ?>css/index.css">
    <link rel="stylesheet" href="<?php echo $url; ?>css/404.css">
</head>

<body>
    <div id="main">
        <img src="<?php echo $url; ?>assets/404.png" alt="404">
        <h2>Oops! Page not found.</h2>
        <p>Sorry, the page you're looking for doesn't exist.</p>
        <a href="<?php echo $url; ?>" class="button sub">
            <p><b>Back to Homepage</b></p>
        </a>
    </div>
</body>

</html>