<?php



// Check if request is GET
if ($_SERVER['REQUEST_METHOD'] != 'GET') {
    echo <<<EOT
        {
            "message": "Invalid request method",
            "status": "error",
            "code": 500
        }
    EOT;
    exit();
};

include('../../utils/databaseConnection.php');
$databaseConnection = databaseConnection();



// Check if request is GET
if ($_SERVER['REQUEST_METHOD'] != 'GET') {
    echo <<<EOT
        {
            "message": "Invalid request method",
            "status": "error",
            "code": 500
        }
    EOT;
    exit();
};
// Get the request cookies
$cookies = $_COOKIE;
$token = $cookies['token'];

// Get query parameters
$urlQuery = $_GET;
$params = array_keys($urlQuery);
$start = 0;
if (in_array('start', $params)) {
    $start = $urlQuery['start'];
};


// Get the user id from the token
$query = "SELECT * FROM admins WHERE token = '$token'";
$admin = mysqli_query($databaseConnection, $query);

if (!$admin) {
    echo <<<EOT
        {
            "message": "You are not authorized to access this resource",
            "status": "unauthorized",
            "code": 401
        }
    EOT;
    exit();
};

// Get the students
// Add the row number to the query
$query = "SELECT * FROM students WHERE timeAdded > $start ORDER BY timeAdded ASC LIMIT 5";
$students = mysqli_query($databaseConnection, $query);

if (!$students) {
    echo <<<EOT
        {
            "message": "Error getting students",
            "status": "error",
            "code": 500
        }
    EOT;
    exit();
};

$studentsArray = array();
while ($student = mysqli_fetch_assoc($students)) {
    array_push($studentsArray, $student);
};
$studentsArray = json_encode($studentsArray);

echo <<<EOT
    {
        "message": "Success",
        "status": "success",
        "code": 200,
        "payload": $studentsArray
    }
EOT;
