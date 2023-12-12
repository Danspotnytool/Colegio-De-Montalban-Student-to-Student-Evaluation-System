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

$password = $requestBody->password;
$key = $requestBody->key;
$studentNumber = $requestBody->studentNumber;



// Validate password
// Password must be at least 8 characters long
$passwordRegex1 = "/^.{8,}$/";
// Password must contain at least one uppercase letter
$passwordRegex2 = "/[A-Z]/";
// Password must contain at least one lowercase letter
$passwordRegex3 = "/[a-z]/";
// Password must contain at least one number
$passwordRegex4 = "/[0-9]/";
// Password must contain at least one special character
$passwordRegex5 = "/[^a-zA-Z0-9]/";
if (!preg_match($passwordRegex1, $password) || !preg_match($passwordRegex2, $password) || !preg_match($passwordRegex3, $password) || !preg_match($passwordRegex4, $password) || !preg_match($passwordRegex5, $password)) {
    echo <<<EOT
        {
            "message": "Invalid Password",
            "status": "unauthorized",
            "code": 401
        }
    EOT;
    exit();
};
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);



// Get student
$sql = "SELECT * FROM students WHERE studentNumber = '$studentNumber'";
$result = mysqli_query($databaseConnection, $sql);
$student = mysqli_fetch_assoc($result);

if (!$student) {
    echo <<<EOT
        {
            "message": "Invalid Student Number",
            "status": "unauthorized",
            "code": 401
        }
    EOT;
    exit();
};



// Check if key is valid
if ($student['resetPasswordKey'] != $key) {
    echo <<<EOT
        {
            "message": "Invalid Key",
            "status": "unauthorized",
            "code": 401
        }
    EOT;
    exit();
};



// Generate token
$token = 'ST.' . base64_encode($studentNumber) . '.' . bin2hex(random_bytes(16));



// Update password
$sql = "UPDATE students SET password = '$hashedPassword', resetPasswordKey = NULL, token = '$token' WHERE studentNumber = '$studentNumber'";
$result = mysqli_query($databaseConnection, $sql);

if (!$result) {
    echo <<<EOT
        {
            "message": "Error updating password",
            "status": "error",
            "code": 500
        }
    EOT;
    exit();
};



// Send email
$receiver = $student['email'];
$subject = 'Password Reset Successful';
$body = <<<EOT
    <h1>Password Reset Successful</h1>
    <p>Your password has been successfully reset.</p>
    <p>If you did not request a password reset, please contact the administrator.</p>
EOT;

if (!sendEmail($receiver, $subject, $body)) {
    echo <<<EOT
        {
            "message": "Error sending email",
            "status": "error",
            "code": 500
        }
    EOT;
    exit();
};



echo <<<EOT
    {
        "message": "Password reset successful",
        "status": "success",
        "code": 200
    }
EOT;
exit();
