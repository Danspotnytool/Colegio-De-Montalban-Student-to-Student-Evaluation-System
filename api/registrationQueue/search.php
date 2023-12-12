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

// If the search is 2 characters, separate the year and section
$year = $search;
$section = $search;
if (strlen($search) == 2) {
    $year = $search[0];
    $section = $search[1];
    $search = '';
};

// Get the registrants
// Add the row number to the query
$query = "SELECT * FROM registrants WHERE
(firstName LIKE '$search'
OR middleName LIKE '$search'
OR lastName LIKE '$search'
OR fullName LIKE '$search'
OR studentNumber LIKE '$search'
OR course LIKE '$search'
OR year LIKE '$search'
OR year LIKE '$year'
OR section LIKE '$search'
OR section LIKE '$section'
OR email LIKE '$search')";
$registrants = mysqli_query($databaseConnection, $query);

if (!$registrants) {
    echo <<<EOT
        {
            "message": "Error getting registrants",
            "status": "error",
            "code": 500
        }
    EOT;
    exit();
};

$registrantsArray = array();
while ($registrant = mysqli_fetch_assoc($registrants)) {
    array_push($registrantsArray, $registrant);
};
$registrantsArray = json_encode($registrantsArray);

echo <<<EOT
    {
        "message": "Success",
        "status": "success",
        "code": 200,
        "payload": $registrantsArray
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
