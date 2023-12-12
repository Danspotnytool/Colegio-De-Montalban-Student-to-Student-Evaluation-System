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



use Dompdf\Dompdf;
use Dompdf\Options;

require '../../includes/dompdf/autoload.inc.php';



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
$sender = mysqli_fetch_assoc($result);
if (!$sender) {
    echo <<<EOT
        {
            "message": "Invalid token",
            "status": "unauthorized",
            "code": 401
        }
    EOT;
    exit();
};
$studentNumber = $sender['studentNumber'];



// CDM Logo
$path = "../../assets/CDM Logo.base64";
$CDMLogo = file_get_contents($path);
// ICS Logo
$path = "../../assets/ICS Logo.base64";
$ICSLogo = file_get_contents($path);

// Create the PDF
$html = <<<EOF
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Request Edit</title>

    <link rel="stylesheet" href="../../fonts/font-face.css">
    <link rel="stylesheet" href="../../css/index.css">

    <style>
        * {
            line-height: 0.5;
            text-align: center;
        }

        #form {
            padding: 0 2rem;
            gap: 0.2rem;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .textInput {
            gap: 0.08rem;
        }

        .textInput div {
            height: 2rem;
            width: 100%;
            border: solid 0.08rem #04863c;
            border-radius: 0.4rem;
            outline: unset;
            display: inline-flex;
            font-size: 1.75rem;
        }

        .textInput label {
            display: inline-block;
        }
        .textInput label * {
            display: inline-block;
        }

        .row {
            width: 100%;
            gap: 0.2rem;
            display: flex;
            flex-direction: row;
        }

        table {
            width: 100%;
            text-align: center;
        }

        img {
            height: 8rem;
        }
    </style>
</head>

<body>
    <table>
        <tr>
            <td style="text-align: left;">
                <img src="$CDMLogo" alt="">
            </td>

            <td>
                <h3>Colegio De Montalban</h3>
                <h3>Student to Student</h3>
                <h3>Evaluation System</h3>
            </td>

            <td style="text-align: right;">
                <img src="$ICSLogo" alt="">
            </td>
        </tr>
    </table>


    <h1>Request Profile Edit</h1>

    <table>
        <tr>
            <td>
                <div class="textInput">
                    <label for="firstName">
                        <h3>First Name</h3>
                    </label>
                    <div></div>
                </div>
            </td>

            <td>
                <div class="textInput">
                    <label for="middleName">
                        <h3>Middle Name</h3>
                    </label>
                    <div></div>
                </div>
            </td>

            <td>
                <div class="textInput">
                    <label for="lastName">
                        <h3>Last Name</h3>
                    </label>
                    <div></div>
                </div>
            </td>
        </tr>
    </table>



    <div class="textInput">
        <label for="studentNumber">
            <h3>Student Number</h3>
        </label>
        <div></div>
    </div>



    <table>
        <tr>
            <td>
                <div class="textInput">
                    <label for="gender">
                        <h3>Gender</h3>
                    </label>
                    <div></div>
                </div>
            </td>

            <td>
                <div class="textInput">
                    <label for="birthday">
                        <h3>Birthday</h3>
                    </label>
                    <div></div>
                </div>
            </td>
        </tr>
    </table>



    <table>
        <tr>
            <td>
                <div class="textInput">
                    <label for="course">
                        <h3><span style="opacity: 0;">____________</span>Course<span style="opacity: 0;">____________</span></h3>
                    </label>
                    <div></div>
                </div>
            </td>

            <td>
                <div class="textInput">
                    <label for="yearAndSection">
                        <h3>Year and Section</h3>
                    </label>
                    <div></div>
                </div>
            </td>
        </tr>
    </table>



    <div class="textInput">
        <label for="emailAddress">
            <h3>Email</h3>
        </label>
        <div></div>
    </div>



    <div>
        <h2 style="text-align: center;">Do you want to change your profile picture?</h2>

        <table>
            <tr>
                <td>
                    <div class="textInput">
                        <label for="changeProFilePicture">
                            <h4>Yes</h4>
                        </label>
                        <div></div>
                    </div>
                </td>

                <td>
                    <div class="textInput">
                        <label for="changeProFilePicture">
                            <h4>No</h4>
                        </label>
                        <div></div>
                    </div>
                </td>
            </tr>
        </table>
    </div>
</body>

</html>
EOF;

$tmp = sys_get_temp_dir();

$options = new Options();
$dompdf = new Dompdf([
    'logOutputFile' => '',
    // authorize DomPdf to download fonts and other Internet assets
    'isRemoteEnabled' => true,
    // all directories must exist and not end with /
    'fontDir' => $tmp,
    'fontCache' => $tmp,
    'tempDir' => $tmp,
    'chroot' => $tmp,
]);
$dompdf->loadHtml($html);
$dompdf->setPaper('A4', 'portrait');

$dompdf->render();

$dompdf->stream('form.pdf', [
    'compress' => true,
    'Attachment' => false,
]);
