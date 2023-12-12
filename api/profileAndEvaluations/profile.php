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



// System logs
$time = time();
$path = $_SERVER['REQUEST_URI'];
$HTTP_X_FORWARDED_FOR = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '';
$HTTP_CLIENT_IP = $_SERVER['REMOTE_ADDR'] ?? '';
$USER_AGENT = $_SERVER['HTTP_USER_AGENT'] ?? '';
$studentNumber = $student['studentNumber'];
$content = <<<EOT
    {
        "time": $time,
        "type": "retrieve",
        "by": "student",
        "payload": {
            "path": "$path",
            "ip": {
                "HTTP_X_FORWARDED_FOR": "$HTTP_X_FORWARDED_FOR",
                "HTTP_CLIENT_IP": "$HTTP_CLIENT_IP"
            },
            "userAgent": "$USER_AGENT",
            "studentNumber": "$studentNumber"
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
