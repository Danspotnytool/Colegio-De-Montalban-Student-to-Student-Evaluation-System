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



$studentNumber = $student['studentNumber'];

// Get the student's information
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
$studentName = $student['firstName'] . ' ' . $student['lastName'];



// Get the student's evaluations
$query = "SELECT * FROM evaluations WHERE receiverStudentNumber = '$studentNumber'";
$evaluations = mysqli_query($databaseConnection, $query);

if (!$evaluations) {
    echo <<<EOT
        {
            "message": "Student not found",
            "status": "error",
            "code": 404
        }
    EOT;
    exit();
};

$evaluationsCount = mysqli_num_rows($evaluations);
if ($evaluationsCount == 0) {
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
    
    
        <h3>Statistical Report for $studentName ($studentNumber)</h3>
    EOF;

    $html .= <<<EOF
        <h3>Total Evaluations: $evaluationsCount</h3>
    EOF;

    $html .= <<<EOF
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
};



$evaluationsArray = [];

while ($evaluation = mysqli_fetch_assoc($evaluations)) {
    $evaluationsArray[] = $evaluation;
};

/**
 * @type {import('../../types/evaluation').Evaluation[]}
 */
$evaluationsArray = json_encode($evaluationsArray);
$classBehavior = [];
$classStanding = [];
foreach (json_decode($evaluationsArray) as $evaluation) {
    $evaluation = json_encode($evaluation);
    $evaluation = json_decode($evaluation);

    $contents = json_decode($evaluation->contents);

    foreach ($contents as $content) {
        $content = json_encode($content);
        $content = json_decode($content);

        if ($content->category == 'Class Behavior') {
            $classBehavior[] = $content;
        } else if ($content->category == 'Class Standing') {
            $classStanding[] = $content;
        };
    };
};

$participation = [];
$punctuality = [];
$respect = [];
$cooperation = [];
$attentiveness = [];

foreach ($classBehavior as $content) {
    $content = json_encode($content);
    $content = json_decode($content);

    if ($content->name == 'Participation') {
        $participation[] = $content;
    } else if ($content->name == 'Punctuality') {
        $punctuality[] = $content;
    } else if ($content->name == 'Respect') {
        $respect[] = $content;
    } else if ($content->name == 'Cooperation') {
        $cooperation[] = $content;
    } else if ($content->name == 'Attentiveness') {
        $attentiveness[] = $content;
    };
};

$academicPerformance = [];
$adaptability  = [];
$attendanceAndPunctuality = [];
$socialInteraction = [];
$motivation = [];

foreach ($classStanding as $content) {
    $content = json_encode($content);
    $content = json_decode($content);

    if ($content->name == 'AcademicPerformance') {
        $academicPerformance[] = $content;
    } else if ($content->name == 'Adaptability') {
        $adaptability[] = $content;
    } else if ($content->name == 'AttendanceandPunctuality') {
        $attendanceAndPunctuality[] = $content;
    } else if ($content->name == 'SocialInteraction') {
        $socialInteraction[] = $content;
    } else if ($content->name == 'Motivation') {
        $motivation[] = $content;
    };
};

$Participation = 0;
for ($i = 0; $i < count($participation); $i++) {
    $Participation += $participation[$i]->value;
};
$Punctuality = 0;
for ($i = 0; $i < count($punctuality); $i++) {
    $Punctuality += $punctuality[$i]->value;
};
$Respect = 0;
for ($i = 0; $i < count($respect); $i++) {
    $Respect += $respect[$i]->value;
};
$Cooperation = 0;
for ($i = 0; $i < count($cooperation); $i++) {
    $Cooperation += $cooperation[$i]->value;
};
$Attentiveness = 0;
for ($i = 0; $i < count($attentiveness); $i++) {
    $Attentiveness += $attentiveness[$i]->value;
};
$AcademicPerformance = 0;
for ($i = 0; $i < count($academicPerformance); $i++) {
    $AcademicPerformance += $academicPerformance[$i]->value;
};
$Adaptability = 0;
for ($i = 0; $i < count($adaptability); $i++) {
    $Adaptability += $adaptability[$i]->value;
};
$AttendanceandPunctuality = 0;
for ($i = 0; $i < count($attendanceAndPunctuality); $i++) {
    $AttendanceandPunctuality += $attendanceAndPunctuality[$i]->value;
};
$SocialInteraction = 0;
for ($i = 0; $i < count($socialInteraction); $i++) {
    $SocialInteraction += $socialInteraction[$i]->value;
};
$Motivation = 0;
for ($i = 0; $i < count($motivation); $i++) {
    $Motivation += $motivation[$i]->value;
};

$ParticipationAverage = $Participation / count($participation);
$PunctualityAverage = $Punctuality / count($punctuality);
$RespectAverage = $Respect / count($respect);
$CooperationAverage = $Cooperation / count($cooperation);
$AttentivenessAverage = $Attentiveness / count($attentiveness);
$AcademicPerformanceAverage = $AcademicPerformance / count($academicPerformance);
$AdaptabilityAverage = $Adaptability / count($adaptability);
$AttendanceandPunctualityAverage = $AttendanceandPunctuality / count($attendanceAndPunctuality);
$SocialInteractionAverage = $SocialInteraction / count($socialInteraction);
$MotivationAverage = $Motivation / count($motivation);

$ParticipationPercentage = ($ParticipationAverage / 5) * 100;
$PunctualityPercentage = ($PunctualityAverage / 5) * 100;
$RespectPercentage = ($RespectAverage / 5) * 100;
$CooperationPercentage = ($CooperationAverage / 5) * 100;
$AttentivenessPercentage = ($AttentivenessAverage / 5) * 100;
$AcademicPerformancePercentage = ($AcademicPerformanceAverage / 5) * 100;
$AdaptabilityPercentage = ($AdaptabilityAverage / 5) * 100;
$AttendanceandPunctualityPercentage = ($AttendanceandPunctualityAverage / 5) * 100;
$SocialInteractionPercentage = ($SocialInteractionAverage / 5) * 100;
$MotivationPercentage = ($MotivationAverage / 5) * 100;

$classBehaviorPercentage = [];
$classStandingPercentage = [];

$classBehaviorPercentage[0] = [
    'name' => 'Participation',
    'value' => $ParticipationPercentage,
    'average' => $ParticipationAverage
];
$classBehaviorPercentage[1] = [
    'name' => 'Punctuality',
    'value' => $PunctualityPercentage,
    'average' => $PunctualityAverage
];
$classBehaviorPercentage[2] = [
    'name' => 'Respect',
    'value' => $RespectPercentage,
    'average' => $RespectAverage
];
$classBehaviorPercentage[3] = [
    'name' => 'Cooperation',
    'value' => $CooperationPercentage,
    'average' => $CooperationAverage
];
$classBehaviorPercentage[4] = [
    'name' => 'Attentiveness',
    'value' => $AttentivenessPercentage,
    'average' => $AttentivenessAverage
];

$classStandingPercentage[0] = [
    'name' => 'Academic Performance',
    'value' => $AcademicPerformancePercentage,
    'average' => $AcademicPerformanceAverage
];
$classStandingPercentage[1] = [
    'name' => 'Adaptability',
    'value' => $AdaptabilityPercentage,
    'average' => $AdaptabilityAverage
];
$classStandingPercentage[2] = [
    'name' => 'Attendance and Punctuality',
    'value' => $AttendanceandPunctualityPercentage,
    'average' => $AttendanceandPunctualityAverage
];
$classStandingPercentage[3] = [
    'name' => 'Social Interaction',
    'value' => $SocialInteractionPercentage,
    'average' => $SocialInteractionAverage
];
$classStandingPercentage[4] = [
    'name' => 'Motivation',
    'value' => $MotivationPercentage,
    'average' => $MotivationAverage
];



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


    <h3>Statistical Report for $studentName ($studentNumber)</h3>
EOF;




$html .= <<<EOF
<h3>Class Behavior</h3>
EOF;
foreach ($classBehaviorPercentage as $content) {
    $content = json_encode($content);
    $content = json_decode($content);

    $content->value = round($content->value, 2);

    $html .= <<<EOF
    <h4 style="text-align: left;">$content->name:</h4>
    <div style="width: 100%; background-color: #e1e1e1; border-radius: 0.4rem;">
        <div style="width: $content->value%; padding: 0.4rem; background-color: #04863c; border-radius: 0.4rem; text-align: right; color: white; vertical-align: middle;">
            $content->value%
        </div>
    </div>
EOF;
};
$html .= <<<EOF
    <br>
    <h3>Class Standing</h3>
EOF;
foreach ($classStandingPercentage as $content) {
    $content = json_encode($content);
    $content = json_decode($content);

    $content->value = round($content->value, 2);

    $html .= <<<EOF
    <h4 style="text-align: left;">$content->name:</h4>
    <div style="width: 100%; background-color: #e1e1e1; border-radius: 0.4rem;">
        <div style="width: $content->value%; padding: 0.4rem; background-color: #04863c; border-radius: 0.4rem; text-align: right; color: white; vertical-align: middle;">
            $content->value%
        </div>
    </div>
EOF;
};



$html .= <<<EOF
    <h3>Total Evaluations: $evaluationsCount</h3>
EOF;



$html .= <<<EOF
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
        "type": "report",
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
