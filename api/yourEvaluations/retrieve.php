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

// Check if the request is authorized
// Get token from the cookie
$token = $_COOKIE['token'];

// Get the student from the database
$query = "SELECT * FROM students WHERE token = '$token'";
$result = mysqli_query($databaseConnection, $query);
$student = mysqli_fetch_assoc($result);
if (!$student) {
    echo <<<EOT
        {
            "message": "Invalid token",
            "status": "unauthorized",
            "code": 401
        }
    EOT;
    exit();
};

// Get query parameters
$urlQuery = $_GET;
$params = array_keys($urlQuery);
$start = 0;
if (in_array('start', $params)) {
    $start = $urlQuery['start'];
};



// Get the student's evaluations
$studentNumber = $student['studentNumber'];
$query = "SELECT * FROM evaluations WHERE senderStudentNumber = '$studentNumber' AND timeAdded > $start ORDER BY timeAdded ASC LIMIT 5";
$result = mysqli_query($databaseConnection, $query);

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

    $query = "SELECT fullName FROM students WHERE studentNumber = '$receiverStudentNumber'";
    $result = mysqli_query($databaseConnection, $query);
    $receiver = mysqli_fetch_assoc($result);

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
