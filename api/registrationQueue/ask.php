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

$email = $student['email'];
$GMAIL_EMAIL_ADDRESS = parse_ini_file('../../.env')['GMAIL_EMAIL_ADDRESS'];

$subject = "CDM Student Evaluation - Request for more information";
$body = <<<EOT
    <p>Dear {$student['firstName']} {$student['lastName']},</p>
    <p>Thank you for registering for the Colegio de Montalban Student to Student Evaluation System. We would like to ask for more information regarding your registration.</p>
    <p>Please send us a copy of your:</p>
    <ul>
        <li>Birth Certificate;</li>
        <li>Form 138;</li>
        <li>Form 137;</li>
        <li>Student ID; or</li>
        <li>OVRF.</li>
    </ul>
    <p>You can send the documents to us through email at <a href="mailto:$GMAIL_EMAIL_ADDRESS">$GMAIL_EMAIL_ADDRESS</a>.</p>
    <p>Or visit our Guidance Office at Admin Building (Room A-201).</p>
    <p>Thank you.</p>
    <p>CDM Student Evaluation</p>
EOT;

if (sendEmail($email, $subject, $body)) {
    echo <<<EOT
        {
            "message": "Email sent",
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
        "type": "ask",
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
