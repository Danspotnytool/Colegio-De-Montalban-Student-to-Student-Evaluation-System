<?php



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

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
} else if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $firstName = $student['firstName'];
    $middleName = $student['middleName'];
    $lastName = $student['lastName'];
    $studentNumber = $student['studentNumber'];
    $gender = $student['gender'];
    $birthday = $student['birthday'];
    $profilePicture = $student['profilePicture'];
    $course = $student['course'];
    $year = $student['year'];
    $section = $student['section'];
    $email = $student['email'];
    $password = $student['password'];
    $timeAdded = $student['timeAdded'];
    $token = $student['token'];



    // Send the student to the client
    echo  <<<EOT
    {
        "message": "Student fetched successfully",
        "status": "success",
        "code": 200,
        "payload": {
            "firstName": "$firstName",
            "middleName": "$middleName",
            "lastName": "$lastName",
            "studentNumber": "$studentNumber",
            "gender": "$gender",
            "birthday": "$birthday",
            "profilePicture": "$profilePicture",
            "course": "$course",
            "year": "$year",
            "section": "$section",
            "email": "$email",
            "timeAdded": "$timeAdded"
        }
    }
    EOT;
} else {
};
