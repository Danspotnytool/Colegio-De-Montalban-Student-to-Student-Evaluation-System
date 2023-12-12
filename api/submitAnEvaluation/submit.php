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



// Get the request body
$requestBody = file_get_contents('php://input');
$requestBody = json_decode($requestBody, true);

// Validate the evaluation
$evaluation = $requestBody['evaluation'];
$valid = true;
$validKeys = ["Participation", "Punctuality", "Respect", "Cooperation", "Attentiveness", "AcademicPerformance", "Adaptability", "AttendanceandPunctuality", "SocialInteraction", "Motivation"];
foreach ($evaluation as $index => $element) {
    $key = $element['name'];
    if (!in_array($key, $validKeys)) {
        $valid = false;
        break;
    };
    $value = $element['value'];
    if ($value < 1 || $value > 5) {
        $valid = false;
        break;
    };
};
if (count($evaluation) != 10) {
    $valid = false;
};
if (!isset($requestBody['receiverStudentNumber'])) {
    $valid = false;
};
// Check if Additional Statement is set and is a string
if (isset($requestBody['additionalStatement'])) {
    if (!is_string($requestBody['additionalStatement'])) {
        // Check if Additional Statement is an empty string
        if ($requestBody['additionalStatement'] != "") {
            $valid = false;
        } else if (strlen($requestBody['additionalStatement']) > 500) {
            $valid = false;
        };
    };
};
if (!$valid) {
    echo <<<EOT
        {
            "message": "Invalid evaluation",
            "status": "error",
            "code": 400
        }
    EOT;
    exit();
};

// Get the reciever student number
$receiverStudentNumber = $requestBody['receiverStudentNumber'];

// Get the reciever from the database
$query = "SELECT studentNumber, email FROM students WHERE studentNumber = '$receiverStudentNumber'";
$result = mysqli_query($databaseConnection, $query);

if (!$result) {
    echo <<<EOT
        {
            "message": "Invalid reciever",
            "status": "error",
            "code": 400
        }
    EOT;
    exit();
};

$reciever = mysqli_fetch_assoc($result);



// Create the evaluation in the database
$evaluationID = $student['studentNumber'] . "-" . uniqid() . "-" . $reciever['studentNumber'];
$time = time();
$evaluation = json_encode($evaluation);
$additionalStatement = $requestBody['additionalStatement'];
// Get sender and reciever name
$query = "SELECT fullName, studentNumber FROM students WHERE studentNumber = '$student[studentNumber]'";
$result = mysqli_query($databaseConnection, $query);
$student = mysqli_fetch_assoc($result);
$query = "SELECT fullName, studentNumber, email FROM students WHERE studentNumber = '$reciever[studentNumber]'";
$result = mysqli_query($databaseConnection, $query);
$reciever = mysqli_fetch_assoc($result);

$evaluationItem = <<<EOT
    {
        "evaluationID": "$evaluationID",
        "senderStudentNumber": "$student[studentNumber]",
        "receiverStudentNumber": "$reciever[studentNumber]",
        "senderName": "$student[fullName]",
        "receiverName": "$reciever[fullName]",
        "contents": $evaluation,
        "additionalStatement": "$additionalStatement",
        "timeAdded": "$time"
    }
EOT;

$query = "INSERT INTO evaluations (evaluationID, senderStudentNumber, receiverStudentNumber, senderName, receiverName, contents, additionalStatement, timeAdded)
    VALUES ('$evaluationID', '$student[studentNumber]', '$reciever[studentNumber]', '$student[fullName]', '$reciever[fullName]', '$evaluation', '$additionalStatement', '$time')";
$result = mysqli_query($databaseConnection, $query);

if (!$result) {
    echo <<<EOT
        {
            "message": "Error creating evaluation",
            "status": "error",
            "code": 500
        }
    EOT;
    exit();
};

// Send email to the reciever
$subject = "New evaluation";
$url = $_SERVER['REQUEST_SCHEME'] . '://' . $_SERVER['HTTP_HOST'];
$body = <<<EOT
    <h1>New evaluation</h1>
    <p>You have a new evaluation.</p>
    <p>Click <a href="$url/dashboard.php#profileAndEvaluations">here</a> to view it.</p>
EOT;

$receiverEmail = $reciever['email'];
$sendEmail = sendEmail($receiverEmail, $subject, $body);

if (!$sendEmail) {
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
        "message": "Success",
        "status": "success",
        "code": 200,
        "evaluation": $evaluationItem
    }
EOT;



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
        "type": "submit",
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
