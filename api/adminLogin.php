<?php



// Check if request is POST
if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    echo <<<EOT
        {
            "message": "Invalid request method",
            "status": "error",
            "code": 500
        }
    EOT;
    exit();
};



include('../utils/databaseConnection.php');
$databaseConnection = databaseConnection();

$body = trim(file_get_contents('php://input'));

$admin = json_decode($body);
$adminID = $admin->adminID;
$adminKey = $admin->adminKey;

if ($adminID == null || $adminKey == null) {
    echo <<<EOT
        {
            "message": "Empty Credentials",
            "status": "unauthorized",
            "code": 401
        }
    EOT;
    exit();
};

$query = "SELECT * FROM admins WHERE adminID = '$adminID'";
$result = mysqli_query($databaseConnection, $query);

if (mysqli_num_rows($result) == 0) {
    echo <<<EOT
        {
            "message": "Invalid Credentials",
            "status": "unauthorized",
            "code": 401
        }
    EOT;
    exit();
};

$admin = mysqli_fetch_assoc($result);

if (password_verify($adminKey, $admin['adminKey'])) {
    $payload = json_encode($admin);
    echo <<<EOT
        {
            "message": "Login Successful",
            "status": "success",
            "code": 200,
            "payload": $payload
        }
    EOT;
    exit();
} else {
    echo <<<EOT
        {
            "message": "Invalid Credentials",
            "status": "unauthorized",
            "code": 401
        }
    EOT;
    exit();
};
