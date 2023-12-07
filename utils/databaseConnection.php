<?php
function databaseConnection()
{
    $host = "localhost";
    $username = "root";
    $password = "";
    $dbname = "student_to_student_evaluation";

    $databaseConnection = new mysqli($host, $username, $password, $dbname);

    if ($databaseConnection->connect_error) {
        echo "Connection failed: " . $databaseConnection->connect_error;
    } else {
        return $databaseConnection;
    };
};
?>