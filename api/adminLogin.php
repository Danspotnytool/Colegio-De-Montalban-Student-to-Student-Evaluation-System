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

$query = "SELECT * FROM admins WHERE adminID = '$adminID' AND adminKey = '$adminKey'";
if ($result = mysqli_query($databaseConnection, $query)) {
    $row = mysqli_fetch_assoc($result);
    if ($row) {
        $jsonEncoded = json_encode($row);
        echo <<<EOT
            {
                "message": "Login Successful",
                "status": "success",
                "payload": $jsonEncoded,
                "code": 200
            }
        EOT;
    } else {
        echo <<<EOT
            {
                "message": "Invalid Credentials",
                "status": "unauthorized",
                "code": 401
            }
        EOT;
    };
} else {
    echo <<<EOT
        {
            "message": "Invalid Credentials",
            "status": "unauthorized",
            "code": 401
        }
    EOT;
};
