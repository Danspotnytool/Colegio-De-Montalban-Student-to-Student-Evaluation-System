<?php



include('../../utils/databaseConnection.php');
$databaseConnection = databaseConnection();



// Check if request is POST
if ($_SERVER['REQUEST_METHOD'] != 'UPDATE') {
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

$firstName = $requestBody->firstName;
$middleName = $requestBody->middleName;
$lastName = $requestBody->lastName;
$fullName = "$firstName $lastName";
$studentNumber = $requestBody->studentNumber;
$gender = $requestBody->gender;
$birthday = $requestBody->birthday;
$profilePicture = $requestBody->profilePicture;
$course = $requestBody->course;
$year = $requestBody->year;
$section = $requestBody->section;
$emailAddress = $requestBody->emailAddress;

// Validate student number
// Example: 20-00001
$studentNumberPattern = "/^[0-9]{2}-[0-9]{5}$/";
if (!preg_match($studentNumberPattern, $studentNumber)) {
    echo <<<EOT
        {
            "message": "Invalid Student Number",
            "status": "unauthorized",
            "code": 401
        }
    EOT;
    exit();
};

// Validate gender
// Example: "male" or "female" or ""
if (
    $gender != 'male' &&
    $gender != 'female' &&
    $gender != ''
) {
    echo <<<EOT
        {
            "message": "Invalid Gender",
            "status": "unauthorized",
            "code": 401
        }
    EOT;
    exit();
};

// Validate course
// Example: "BSIT" or "BSCS" or "BSIT" or "BSCpE" or "BSEd-SCI" or "BEEd-GEN" or "BEEd-ECED" or "BTLEd-ICT" or "BSBA-HRM" or "BSE"
if (
    $course !== 'BSIT' &&
    $course !== 'BSCS' &&
    $course !== 'BSIT' &&
    $course !== 'BSCpE' &&
    $course !== 'BSEd-SCI' &&
    $course !== 'BEEd-GEN' &&
    $course !== 'BEEd-ECED' &&
    $course !== 'BTLEd-ICT' &&
    $course !== 'BSBA-HRM' &&
    $course !== 'BSE'
) {
    echo <<<EOT
        {
            "message": "Invalid Course",
            "status": "unauthorized",
            "code": 401
        }
    EOT;
    exit();
};

// Validate birthday
// Birthday is epoch time
$birthdayPattern = "/^[0-9]{10,30}$/";
if (!preg_match($birthdayPattern, $birthday)) {
    echo <<<EOT
        {
            "message": "Invalid Birthday",
            "status": "unauthorized",
            "code": 401
        }
    EOT;
    exit();
};

// Validate email address
if (!filter_var($emailAddress, FILTER_VALIDATE_EMAIL)) {
    echo <<<EOT
        {
            "message": "Invalid Email Address",
            "status": "unauthorized",
            "code": 401
        }
    EOT;
    exit();
};

// Validate year and section
$yearPattern = "/^[0-9]{1}$/";
$sectionPattern = "/^[A-Z]{1}$/";
if (!preg_match($yearPattern, $year) || !preg_match($sectionPattern, $section)) {
    echo <<<EOT
        {
            "message": "Invalid Year or Section",
            "status": "unauthorized",
            "code": 401
        }
    EOT;
    exit();
};

// Validate profile picture
// Profile picture must be a base64 string
// Profile picture must be a valid image
// Profile picture must be less than 2MB
function check_base64_image($base64)
{
    error_reporting(E_ERROR | E_PARSE);
    if (empty($base64)) {
        return true;
    };
    // Remove prefix from base64 string
    $base64Parts = null;
    try {
        $base64Parts = explode(',', $base64)[1];
    } catch (Exception $th) {
        return false;
    };
    $base64Img = null;
    try {
        $base64Img = base64_decode($base64Parts);
    } catch (Exception $th) {
        return false;
    };

    $image = null;
    try {
        $image = imagecreatefromstring($base64Img);
    } catch (Exception $th) {
        return false;
    };
    if (!$image) {
        return false;
    };

    imagepng($image, 'tmp.png');
    $info = getimagesize('tmp.png');

    // get file size
    $fileSize = filesize('tmp.png');
    if ($fileSize > 2000000) {
        echo <<<EOT
            {
                "message": "Profile Picture must be less than 2MB",
                "status": "unauthorized",
                "code": 401
            }
        EOT;
        exit();
    };

    unlink('tmp.png');

    if ($info[0] > 0 && $info[1] > 0 && $info['mime']) {
        return true;
    };

    echo <<<EOT
        {
            "message": "Invalid Profile Picture",
            "status": "unauthorized",
            "code": 401
        }
    EOT;
    exit();
};
$updateProfilePicture = check_base64_image($profilePicture);

$API_PRIVATE_KEY = parse_ini_file('../../.env')['API_PRIVATE_KEY'];
// Send POST request to "/image"
// Send the profile picture to the server
// Body constainst profilePicture and API_PRIVATE_KEY
if ($updateProfilePicture) {
    $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_URL => (empty($_SERVER['HTTPS']) ? 'http' : 'https') . "://$_SERVER[HTTP_HOST]" . "/api/image.php",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => false,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_POSTFIELDS => array('image' => $profilePicture, 'API_PRIVATE_KEY' => $API_PRIVATE_KEY, 'alt' => $studentNumber),
    ));
    // Get response text
    $response = curl_exec($curl);
    curl_close($curl);
    // Decode response text
    $response = json_decode($response);
    // Get image id
    $profilePicture = (empty($_SERVER['HTTPS']) ? 'http' : 'https') . "://$_SERVER[HTTP_HOST]" . "/api/image.php?id=" . $response->payload->id;
};



// Edit Student
$query = "UPDATE students SET ";
if (!empty($studentNumber)) {
    $query .= "studentNumber = '$studentNumber', ";
};
if (!empty($gender)) {
    $query .= "gender = '$gender', ";
};
if (!empty($course)) {
    $query .= "course = '$course', ";
};
if (!empty($birthday)) {
    $query .= "birthday = '$birthday', ";
};
if (!empty($profilePicture)) {
    $query .= "profilePicture = '$profilePicture', ";
};
if (!empty($emailAddress)) {
    $query .= "email = '$emailAddress', ";
};
if (!empty($year)) {
    $query .= "year = '$year', ";
};
if (!empty($section)) {
    $query .= "section = '$section', ";
};
$query = rtrim($query, ", ");
$query .= " WHERE students.studentNumber = '$studentNumber'";

$editStudent = mysqli_query($databaseConnection, $query);

if (!$editStudent) {
    echo <<<EOT
        {
            "message": "Error editing Student",
            "status": "error",
            "code": 500
        }
    EOT;
    exit();
};



// Get the edited Student
$query = "SELECT * FROM students WHERE studentNumber = $studentNumber";
$Student = mysqli_query($databaseConnection, $query);

if (!$Student) {
    echo <<<EOT
        {
            "message": "Error getting Student",
            "status": "error",
            "code": 500
        }
    EOT;
    exit();
};



// Send email to Student
$subject = "CDM Student Evaluation - Registration";
$body = <<<EOT
    <h1>CDM Student Evaluation</h1>
    <p>Hi $fullName,</p>
    <p>Your registration details has been updated.</p>
    <p>Thank you.</p>
    <p>CDM Student Evaluation</p>
EOT;

$sendEmail = sendEmail($emailAddress, $subject, $body);

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



// Send response
echo <<<EOT
    {
        "message": "Student edited",
        "status": "success",
        "code": 200,
        "payload": {
            "firstName": "$firstName",
            "middleName": "$middleName",
            "lastName": "$lastName",
            "fullName": "$fullName",
            "studentNumber": "$studentNumber",
            "gender": "$gender",
            "birthday": "$birthday",
            "course": "$course",
            "year": "$year",
            "section": "$section",
            "emailAddress": "$emailAddress"
        }
    }
EOT;
