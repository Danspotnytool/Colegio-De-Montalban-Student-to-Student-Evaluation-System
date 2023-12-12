<?php



include('../../utils/databaseConnection.php');
$databaseConnection = databaseConnection();



// Check if request is POST
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

$body = trim(file_get_contents('php://input'));

$requestBody = json_decode($body);

$studentNumber = $requestBody->studentNumber;

$query = "SELECT * FROM students WHERE studentNumber = '$studentNumber'";
$student = mysqli_query($databaseConnection, $query);

if (!$student) {
    echo <<<EOT
        {
            "message": "Student not found",
            "status": "error",
            "code": 404
        }
    EOT;
    exit();
};

$student = mysqli_fetch_assoc($student);

$fullName = $student['fullName'];
$studentEmail = $student['email'];

$subject = "CDM Student Evaluation";
$body = <<<EOT
    <h1>CDM Student Evaluation</h1>
    <p>Dear $fullName,</p>
    <p>We would like to invite you to the our Guidance Office at Admin Building (Room A-201) for a short interview.</p>
    <p>Kindly come to the CDM office as soon as possible.</p>
    <p>Thank you.</p>
    <p>CDM Student Evaluation</p>
EOT;

if (sendEmail($studentEmail, $subject, $body)) {
    echo <<<EOT
        {
            "message": "Email sent",
            "status": "success",
            "code": 200
        }
    EOT;
    exit();
} else {
    echo <<<EOT
        {
            "message": "Email not sent",
            "status": "error",
            "code": 500
        }
    EOT;
    exit();
};
