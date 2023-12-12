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
$query = "SELECT * FROM students WHERE token = '$token'";
$student = mysqli_query($databaseConnection, $query);
$student = mysqli_fetch_assoc($student);
$studentNumber = $student['studentNumber'];

if (!$student) {
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

// Get the students
// Add the row number to the query
$query = "SELECT profilePicture, firstName, lastName, studentNumber FROM students WHERE
(
    firstName LIKE '$search'
OR  middleName LIKE '$search'
OR  lastName LIKE '$search'
OR  fullName LIKE '$search'
OR  studentNumber LIKE '$search'
OR  course LIKE '$search'
OR  year LIKE '$search'
OR  year LIKE '$year'
OR  section LIKE '$search'
OR  section LIKE '$section'
OR  email LIKE '$search'
) AND NOT studentNumber = '$studentNumber'";
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
