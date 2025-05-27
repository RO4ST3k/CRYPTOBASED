<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $conn = new mysqli("localhost", "root", "", "cryptobase");

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';

    $sql = "SELECT * FROM users WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);

    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();

        if (password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['name'] = $user['name'];
            header("Location: index.php");
            exit;
        } else {
            $error = "Incorrect password.";
        }
    } else {
        $error = "No account found with that email.";
    }

    $stmt->close();
    $conn->close();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login</title>
    <link rel="stylesheet" href="css/login.css?v=2">
</head>
<body>
    <div class="login-container">
        <h4>Login</h4>
        <?php if (!empty($error)): ?>
            <p style="color: red;"><?= $error ?></p>
        <?php endif; ?>
        <form action="login.php" method="POST">
            <img src="assets/email.png" alt="" class="imil">    
        <input type="email" name="email" placeholder="Email" class="login-email" required>
            <input type="password" name="password" id="password-input" placeholder="Password" class="login-pass" required>
            <input type="checkbox" class="checkbox">
            <label class="checkbox" id="remember">Remember me</label>
            <a href="forgot.php" class="forgot">Forgot Password?</a>

            <div class="password-container">
                <span id="toggle-password" class="toggle-password">&#128065;</span>
            </div>

            <button type="submit">Login</button>

            <p class="register">Don't have an account? </p>
                <a href="register.php" class="register" id="register">Register</a>
        </form>
    </div>
        

    <script>
    const passwordInput = document.getElementById('password-input');
    const togglePassword = document.getElementById('toggle-password');

    togglePassword.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        togglePassword.textContent = isPassword ? '🙈' : '👁️';
    });
    </script>
</body>
</html>
