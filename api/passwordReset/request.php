<?php



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



include('../../utils/databaseConnection.php');
$databaseConnection = databaseConnection();



// Get the request body
$requestBody = file_get_contents('php://input');
$requestBody = json_decode($requestBody, true);

$query = "SELECT * FROM students WHERE email = '" . $requestBody['email'] . "'";
$result = mysqli_query($databaseConnection, $query);

if (mysqli_num_rows($result) == 0) {
    echo <<<EOT
        {
            "message": "Email not found",
            "status": "error",
            "code": 404
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



// Generate a random token
$resetPasswordKey = time() . bin2hex(random_bytes(32)) . uniqid();

// Update the user's resetPasswordKey
$query = "UPDATE students SET resetPasswordKey = '$resetPasswordKey' WHERE email = '" . $requestBody['email'] . "'";
$result = mysqli_query($databaseConnection, $query);

if (!$result) {
    echo <<<EOT
        {
            "message": "Error updating resetPasswordKey",
            "status": "error",
            "code": 500
        }
    EOT;
    exit();
};

// Get student
$query = "SELECT * FROM students WHERE studentNumber = '" . $requestBody['studentNumber'] . "'";
$result = mysqli_query($databaseConnection, $query);
$student = mysqli_fetch_assoc($result);

// Send the email
$subject = 'CDM Student Evaluation - Password Reset';
$url = $_SERVER['REQUEST_SCHEME'] . '://' . $_SERVER['HTTP_HOST'];
$body = <<<EOT
    <h1>CDM Student Evaluation</h1>
    <p>Hi {$student['firstName']} {$student['lastName']},</p>
    <p>Click the link below to reset your password.</p>
    <a href="$url/resetPassword.php/?key=$resetPasswordKey">Reset Password</a>
    <p>If you did not request a password reset, please ignore this email.</p>
    <p>Thank you.</p>
EOT;

if (sendEmail($student['email'], $subject, $body)) {
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
            "message": "Error sending email",
            "status": "error",
            "code": 500
        }
    EOT;
    exit();
};
