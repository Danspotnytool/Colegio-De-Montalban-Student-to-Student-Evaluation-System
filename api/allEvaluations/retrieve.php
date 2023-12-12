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

// Get the evaluations
// Add the row number to the query
$query = "SELECT * FROM evaluations WHERE timeAdded > $start ORDER BY timeAdded ASC Limit 5";
$result = mysqli_query($databaseConnection, $query);

if (!$result) {
    echo <<<EOT
        {
            "message": "Error getting evaluations",
            "status": "error",
            "code": 500
        }
    EOT;
    exit();
};

$evaluations = array();
while ($evaluation = mysqli_fetch_assoc($result)) {
    array_push($evaluations, $evaluation);
};

// Get the name of the sender and the receiver
foreach ($evaluations as &$evaluation) {
    $senderStudentNumber = $evaluation['senderStudentNumber'];
    $receiverStudentNumber = $evaluation['receiverStudentNumber'];

    $query = "SELECT fullName FROM students WHERE studentNumber = '$senderStudentNumber'";
    $result = mysqli_query($databaseConnection, $query);
    $sender = mysqli_fetch_assoc($result);

    if (!$sender) {
        $query = "SELECT fullName FROM registrants WHERE studentNumber = '$senderStudentNumber'";
        $result = mysqli_query($databaseConnection, $query);
        $sender = mysqli_fetch_assoc($result);
        $sender['fullName'] = $sender['fullName'] . ' [Registrant]';
    };

    $query = "SELECT fullName FROM students WHERE studentNumber = '$receiverStudentNumber'";
    $result = mysqli_query($databaseConnection, $query);
    $receiver = mysqli_fetch_assoc($result);

    if (!$receiver) {
        $query = "SELECT fullName FROM registrants WHERE studentNumber = '$receiverStudentNumber'";
        $result = mysqli_query($databaseConnection, $query);
        $receiver = mysqli_fetch_assoc($result);
        $receiver['fullName'] = $receiver['fullName'] . ' [Registrant]';
    };

    $evaluation['senderName'] = $sender['fullName'];
    $evaluation['receiverName'] = $receiver['fullName'];
};

$evaluations = json_encode($evaluations);

// Send the evaluations to the client
echo  <<<EOT
{
    "message": "Evaluations fetched successfully",
    "status": "success",
    "code": 200,
    "payload": $evaluations
}
EOT;