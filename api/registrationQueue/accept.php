<?php



include('../../utils/databaseConnection.php');
$databaseConnection = databaseConnection();

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../../includes/PHPMailer/src/Exception.php';
require '../../includes/PHPMailer/src/PHPMailer.php';
require '../../includes/PHPMailer/src/SMTP.php';



function sendEmail($receiver, $subject, $body)
{
    $mail = new PHPMailer(true);

    // Get env variables
    $env = parse_ini_file('../../.env');
    $GMAIL_EMAIL_ADDRESS = $env['GMAIL_EMAIL_ADDRESS'];
    $GMAIL_EMAIL_PASSWORD = $env['GMAIL_EMAIL_PASSWORD'];



    try {
        $mail->SMTPDebug = 0;
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = $GMAIL_EMAIL_ADDRESS;
        $mail->Password = $GMAIL_EMAIL_PASSWORD;
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;

        $mail->setFrom($GMAIL_EMAIL_ADDRESS, 'CDM Student Evaluation');
        $mail->addAddress($receiver);

        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $body;

        $mail->send();
        return true;
    } catch (Exception $th) {
        return false;
    };
};



// Check if request is GET
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



// Get the request cookies
$cookies = $_COOKIE;
$token = $cookies['token'];


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



// Get the request body
$requestBody = file_get_contents('php://input');
$requestBody = json_decode($requestBody, true);

$studentNumber = $requestBody['studentNumber'];

$query = "SELECT * FROM registrants WHERE studentNumber = '$studentNumber'";
$student = mysqli_query($databaseConnection, $query);

if (!$student) {
    echo <<<EOT
        {
            "message": "Error getting student",
            "status": "error",
            "code": 500
        }
    EOT;
    exit();
};

$student = mysqli_fetch_assoc($student);

// Move the student from registrants to students
$firstName = $student['firstName'];
$middleName = $student['middleName'];
$lastName = $student['lastName'];
$fullName = $student['fullName'];
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

$query = "INSERT INTO students (firstName, middleName, lastName, fullName, studentNumber, gender, birthday, profilePicture, course, year, section, email, password, token, timeAdded)
                VALUES ('$firstName', '$middleName', '$lastName', '$fullName', '$studentNumber', '$gender', '$birthday', '$profilePicture', '$course', '$year', '$section', '$email', '$password', '$token', '$timeAdded')";
$student = mysqli_query($databaseConnection, $query);

if (!$student) {
    echo <<<EOT
        {
            "message": "Error moving student",
            "status": "error",
            "code": 500
        }
    EOT;
    exit();
};

$query = "DELETE FROM registrants WHERE studentNumber = '$studentNumber'";
$student = mysqli_query($databaseConnection, $query);

if (!$student) {
    echo <<<EOT
        {
            "message": "Error deleting student from registrants",
            "status": "error",
            "code": 500
        }
    EOT;
    exit();
};

$query = "SELECT * FROM students WHERE studentNumber = '$studentNumber'";
$student = mysqli_query($databaseConnection, $query);
$student = mysqli_fetch_assoc($student);

$email = $student['email'];
$GMAIL_EMAIL_ADDRESS = parse_ini_file('../../.env')['GMAIL_EMAIL_ADDRESS'];

$subject = "CDM Student Evaluation - Registration Accepted";
$body = <<<EOT
    <p>Dear {$student['firstName']} {$student['lastName']},</p>
    <p>Your registration has been accepted.</p>
    <p>You may now login to the system using your student number and password.</p>
    <p>Thank you.</p>
    <p>CDM Student Evaluation</p>
EOT;

if (sendEmail($email, $subject, $body)) {
    echo <<<EOT
        {
            "message": "Student accepted",
            "status": "success",
            "code": 200
        }
    EOT;
} else {
    echo <<<EOT
        {
            "message": "Error sending email",
            "status": "error",
            "code": 500
        }
    EOT;
};
exit();
