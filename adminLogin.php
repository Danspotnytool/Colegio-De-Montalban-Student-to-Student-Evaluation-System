<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin - Colegio de Montalban Student to Student Evaluation System</title>

    <link rel="shortcut icon" href="./assets/Favicon.png" type="image/x-icon">

    <link rel="stylesheet" href="./fonts/font-face.css">

    <link rel="stylesheet" href="./css/index.css">
    <link rel="stylesheet" href="./css/login.css">
</head>

<body>
    <div id="main">
        <div id="loginPanel">
            <div id="header">
                <img src="./assets/CDM Logo.png" alt="CDM Logo">
                <div>
                    <h2>Student to Student</h2>
                    <h3>Evaluation System</h3>
                </div>
            </div>



            <form action="/login.php" method="POST" id="loginForm">
                <div class="textInput">
                    <label for="adminID">
                        <h6>Admin ID</h6>
                    </label>
                    <input required type="text" name="adminID" id="adminID" placeholder="00.0000000000.001">
                </div>

                <div class="textInput">
                    <label for="adminKey">
                        <h6>Admin Key</h6>
                    </label>
                    <input required type="password" name="adminKey" id="adminKey" placeholder="#############">
                </div>

                <button type="submit" class="button">
                    <p><b>Login</b></p>
                </button>
            </form>
        </div>
    </div>
</body>

</html>