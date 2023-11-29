<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Colegio de Montalban Student to Student Evaluation System</title>

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
                    <label for="studentNumber">
                        <h6>Student Number</h6>
                    </label>
                    <input required type="text" name="studentNumber" id="studentNumber" placeholder="20-00001">
                </div>

                <div class="textInput">
                    <label for="password">
                        <h6>Password</h6>
                    </label>
                    <input required type="password" name="password" id="password" placeholder="#############">
                </div>

                <p><a href="passwordReset.php">Forgot your Password?</a></p>

                <button type="submit" class="button">
                    <p><b>Login</b></p>
                </button>
            </form>

            <p class="postscript"><i>New here? <a href="register.php">Register instead</a></i></p>
        </div>
    </div>
</body>

</html>