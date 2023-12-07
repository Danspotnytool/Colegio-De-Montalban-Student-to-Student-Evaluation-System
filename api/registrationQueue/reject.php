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



// Check if request is DELETE
if ($_SERVER['REQUEST_METHOD'] != 'DELETE') {
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
$studentNumber = $student['studentNumber'];
$email = $student['email'];
$firstName = $student['firstName'];
$lastName = $student['lastName'];
$profilePicture = $student['profilePicture'];

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

$query = "DELETE FROM images WHERE id = '$profilePicture'";
$image = mysqli_query($databaseConnection, $query);

if (!$image) {
    echo <<<EOT
        {
            "message": "Error deleting student profile picture",
            "status": "error",
            "code": 500
        }
    EOT;
    exit();
};

$GMAIL_EMAIL_ADDRESS = parse_ini_file('../../.env')['GMAIL_EMAIL_ADDRESS'];

$subject = "CDM Student Evaluation - Registration Rejected";
$body = <<<EOT
    <p>Dear {$firstName} {$lastName},</p>
    <p>We regret to inform you that your registration has been rejected.</p>
    <p>Thank you for your interest in CDM Student Evaluation.</p>
    <p>CDM Student Evaluation</p>
EOT;

if (sendEmail($email, $subject, $body)) {
    echo <<<EOT
        {
            "message": "Account registration rejected",
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
