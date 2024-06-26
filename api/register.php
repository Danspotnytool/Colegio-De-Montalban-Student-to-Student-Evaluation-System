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



include('../utils/databaseConnection.php');
$databaseConnection = databaseConnection();

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../includes/PHPMailer/src/Exception.php';
require '../includes/PHPMailer/src/PHPMailer.php';
require '../includes/PHPMailer/src/SMTP.php';



function sendEmail($receiver, $subject, $body)
{
    $mail = new PHPMailer(true);

    // Get env variables
    $env = parse_ini_file('../.env');
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
$password = $requestBody->password;

// Check if student number is already taken from the database table "students" and "registrants"
$checkStudentNumberQuery = "SELECT * FROM students WHERE studentNumber = '$studentNumber'";
$checkStudentNumberResult = mysqli_query($databaseConnection, $checkStudentNumberQuery);
$checkRegistrantsNumberQuery = "SELECT * FROM registrants WHERE studentNumber = '$studentNumber'";
$checkRegistrantsNumberResult = mysqli_query($databaseConnection, $checkRegistrantsNumberQuery);
if (mysqli_num_rows($checkStudentNumberResult) > 0 || mysqli_num_rows($checkRegistrantsNumberResult) > 0) {
    echo <<<EOT
        {
            "message": "Student Number is already taken",
            "status": "unauthorized",
            "code": 401
        }
    EOT;
    exit();
};

// Check if email address is already taken from the database table "students" and "registrants"
$checkEmailAddressQuery = "SELECT * FROM students WHERE email = '$emailAddress'";
$checkEmailAddressResult = mysqli_query($databaseConnection, $checkEmailAddressQuery);
$checkRegistrantsEmailAddressQuery = "SELECT * FROM registrants WHERE email = '$emailAddress'";
$checkRegistrantsEmailAddressResult = mysqli_query($databaseConnection, $checkRegistrantsEmailAddressQuery);
if (mysqli_num_rows($checkEmailAddressResult) > 0) {
    echo <<<EOT
        {
            "message": "Email Address is already taken",
            "status": "unauthorized",
            "code": 401
        }
    EOT;
    exit();
};

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
$sectionPattern = "/^[a-zA-Z]{1}$/";
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

// Validate profile picture
// Profile picture must be a base64 string
// Profile picture must be a valid image
// Profile picture must be less than 2MB
check_base64_image($profilePicture);

function check_base64_image($base64)
{
    // Remove prefix from base64 string
    $base64Parts = explode(',', $base64)[1];
    $base64Img = base64_decode($base64Parts);

    $image = imagecreatefromstring($base64Img);
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

// Generate token
$token = 'ST.' . base64_encode($studentNumber) . '.' . bin2hex(random_bytes(16));

// Get the current date and time
// Epoch time
$dateTime = time();

$API_PRIVATE_KEY = parse_ini_file('../.env')['API_PRIVATE_KEY'];
// Send POST request to "/image"
// Send the profile picture to the server
// Body constainst profilePicture and API_PRIVATE_KEY
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



// Insert data to database table "registrants"
$insertQuery = "INSERT INTO registrants (firstName, middleName, lastName, fullName, studentNumber, gender, birthday, profilePicture, course, year, section, email, password, token, timeAdded)
                    VALUES ('$firstName', '$middleName', '$lastName', '$fullName', '$studentNumber', '$gender', '$birthday', '$profilePicture', '$course', '$year', '$section', '$emailAddress', '$hashedPassword', '$token', '$dateTime')";

if (mysqli_query($databaseConnection, $insertQuery)) {
    $retrieveQuery = "SELECT * FROM registrants WHERE studentNumber = '$studentNumber'";
    if ($result = mysqli_query($databaseConnection, $retrieveQuery)) {
        $row = mysqli_fetch_assoc($result);



        // Send email to the registrant
        $subject = 'CDM Student Evaluation Registration';

        $body = <<<EOT
            <p>Hi $fullName,</p>
            <p>Thank you for registering to CDM Student Evaluation.</p>
            <p>Please wait for the admin to verify your account.</p>
            <p>Thank you.</p>
        EOT;

        if (!sendEmail($emailAddress, $subject, $body)) {
            echo <<<EOT
                {
                    "message": "Registration Failed",
                    "status": "error",
                    "code": 500
                }
            EOT;
            exit();
        };



        $jsonEncoded = json_encode($row);
        echo <<<EOT
            {
                "message": "Registration Successful",
                "status": "success",
                "payload": $jsonEncoded,
                "code": 200
            }
        EOT;
    } else {
        echo <<<EOT
            {
                "message": "Registration Failed",
                "status": "error",
                "code": 500
            }
        EOT;
    };
} else {
    echo <<<EOT
        {
            "message": "Registration Failed",
            "status": "error",
            "code": 500
        }
    EOT;
};

exit();
