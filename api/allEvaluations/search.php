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



// Get the request cookies
$cookies = $_COOKIE;
$token = $cookies['token'];

// Get query parameters
$urlQuery = $_GET;
$params = array_keys($urlQuery);
$search = '';
if (in_array('search', $params)) {
    $search = $urlQuery['search'];
};



if ($search == '') {
    header('Location: retrieve.php');
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

// Search for the evaluations
// Search prameters are:
// 1. Evaluation id
// 2. Student id
// 4. Evaluation date

$query = "SELECT * FROM evaluations WHERE
    (evaluationID LIKE '$search'
    OR senderStudentNumber LIKE '$search'
    OR receiverStudentNumber LIKE '$search'
    OR senderName LIKE '$search'
    OR receiverName LIKE '$search'
    OR timeAdded LIKE '$search')";
$evaluations = mysqli_query($databaseConnection, $query);

if (!$evaluations) {
    echo <<<EOT
        {
            "message": "Something went wrong while fetching evaluations",
            "status": "error",
            "code": 500
        }
    EOT;
    exit();
};

// Return the evaluations
$evaluationsArray = [];
while ($evaluation = mysqli_fetch_assoc($evaluations)) {
    array_push($evaluationsArray, $evaluation);
};

$evaluationsArray = json_encode($evaluationsArray);

echo <<<EOT
    {
        "message": "Evaluations fetched successfully",
        "status": "success",
        "code": 200,
        "payload": $evaluationsArray
    }
EOT;



// System logs
$time = time();
$path = $_SERVER['REQUEST_URI'];
$HTTP_X_FORWARDED_FOR = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '';
$HTTP_CLIENT_IP = $_SERVER['REMOTE_ADDR'] ?? '';
$USER_AGENT = $_SERVER['HTTP_USER_AGENT'] ?? '';
$admin = mysqli_fetch_assoc($admin);
$content = <<<EOT
    {
        "time": $time,
        "type": "search",
        "by": "admin",
        "payload": {
            "path": "$path",
            "ip": {
                "HTTP_X_FORWARDED_FOR": "$HTTP_X_FORWARDED_FOR",
                "HTTP_CLIENT_IP": "$HTTP_CLIENT_IP"
            },
            "userAgent": "$USER_AGENT",
            "adminID": "$admin[adminID]"
        }
    }
EOT;

$content = json_decode($content, true);

$content = json_encode($content);

$id = $time . '-' . uniqid();

// Insert the system logs to the database
$query = "INSERT INTO system_logs (id, timeAdded, content) VALUES ('$id', '$time', '$content')";
mysqli_query($databaseConnection, $query);
exit();
