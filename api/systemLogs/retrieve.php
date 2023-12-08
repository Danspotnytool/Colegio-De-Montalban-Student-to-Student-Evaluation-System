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

// Get the registrants
// Add the row number to the query
$query = "SELECT * FROM system_logs WHERE timeAdded > $start ORDER BY timeAdded ASC LIMIT 20";
$registrants = mysqli_query($databaseConnection, $query);

if (!$registrants) {
    echo <<<EOT
        {
            "message": "Error fetching registrants",
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
        "message": "Registrants fetched successfully",
        "status": "success",
        "code": 200,
        "payload": $registrantsArray
    }
EOT;
