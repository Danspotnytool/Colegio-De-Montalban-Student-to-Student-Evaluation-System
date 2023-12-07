<?php



include('../utils/databaseConnection.php');
$databaseConnection = databaseConnection();


$API_PRIVATE_KEY = parse_ini_file('../.env')['API_PRIVATE_KEY'];

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Check if the private key is correct
    if ($_POST['API_PRIVATE_KEY'] != $API_PRIVATE_KEY) {
        echo <<<EOT
            {
                "message": "Invalid API Private Key",
                "status": "unauthorized",
                "code": 401
            }
        EOT;
        exit();
    };



    // Get the image from the body
    $image = $_POST['image'];
    $alt = $_POST['alt'];

    // Generate a random name for the image
    $imageID = $alt . '-' . uniqid() . '.png';

    // Save the image to the server
    $insertQuery = "INSERT INTO images (id, alt, value) VALUES ('$imageID', '$alt', '$image')";
    mysqli_query($databaseConnection, $insertQuery);

    // Get the image from the database
    $query = "SELECT * FROM images WHERE id = '$imageID'";
    $result = mysqli_query($databaseConnection, $query);
    $image = mysqli_fetch_assoc($result);

    // Array to string
    $image = json_encode($image);


    // Send the image to the client
    echo <<<EOT
        {
            "message": "Image uploaded successfully",
            "status": "success",
            "code": 200,
            "payload": $image
        }
    EOT;
} else if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    // Display the image
    // Get the id from the url or query
    $urlQuery = $_GET;
    $params = array_keys($urlQuery);
    $id = '';
    if (in_array('id', $params)) {
        $id = $urlQuery['id'];
    } else {
        $id = $_GET['id'];
    };

    // Get the image from the database
    $query = "SELECT * FROM images WHERE id = '$id'";
    $result = mysqli_query($databaseConnection, $query);
    $image = mysqli_fetch_assoc($result);

    if (!$image) {
        // Send error message
        echo <<<EOT
            {
                "message": "Image not found",
                "status": "not found",
                "code": 404
            }
        EOT;
        exit();
    };

    // The image from the database is base64 encoded string
    // Convert it to an image
    $image = file_get_contents($image['value']);

    // Send the image to the client
    header('Content-Type: image/png');
    echo $image;
} else {
};
