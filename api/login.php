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

$body = trim(file_get_contents('php://input'));

$student = json_decode($body);
$studentNumber = $student->studentNumber;
$password = $student->password;

if ($studentNumber == null || $password == null) {
    echo <<<EOT
        {
            "message": "Empty Credentials",
            "status": "unauthorized",
            "code": 401
        }
    EOT;
    exit();
};

// Get the student from the database
$queryStudents = "SELECT * FROM students WHERE studentNumber = '$studentNumber'";
$queryRegistrants = "SELECT * FROM registrants WHERE studentNumber = '$studentNumber'";

$resultStudents = mysqli_query($databaseConnection, $queryStudents);
$resultRegistrants = mysqli_query($databaseConnection, $queryRegistrants);

$student;

// If the student is not found in the students table, check the registrants table
if (mysqli_num_rows($resultStudents) == 0) {
    if (mysqli_num_rows($resultRegistrants) == 0) {
        // If the student is not found in the registrants table, return an error
        echo <<<EOT
            {
                "message": "Student not found",
                "status": "unauthorized",
                "code": 401
            }
        EOT;
    } else {
        // The student is not found in the students table but is found in the registrants table
        echo <<<EOT
            {
                "message": "Student not yet verified. Please wait for the admin to verify your account",
                "status": "unauthorized",
                "code": 401
            }
        EOT;
    };
} else {
    // The student is found in the students table
    $student = mysqli_fetch_assoc($resultStudents);
};

// Check if the password is correct
if (!password_verify($password, $student['password'])) {
    echo <<<EOT
        {
            "message": "Incorrect password",
            "status": "unauthorized",
            "code": 401
        }
    EOT;
    exit();
};

// Log the student in
echo <<<EOT
    {
        "message": "Login successful",
        "status": "success",
        "code": 200,
        "payload": {
            "student": {
                "studentNumber": "{$student['studentNumber']}",
                "firstName": "{$student['firstName']}",
                "middleName": "{$student['middleName']}",
                "lastName": "{$student['lastName']}",
                "studentNumber": "{$student['studentNumber']}",
                "course": "{$student['course']}",
                "year": "{$student['year']}",
                "section": "{$student['section']}",
                "email": "{$student['email']}",
                "timeAdded": "{$student['timeAdded']}"
            },
            "token": "{$student['token']}"
        }
    }
EOT;
