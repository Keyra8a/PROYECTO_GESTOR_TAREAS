<?php
// assets/app/AppLogin.php
session_start();
require_once __DIR__ . '/../controllers/AuthController.php';

$controller = new AuthController();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ../../view/login.html');
    exit;
}

$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';

$result = $controller->login($email, $password);

if ($result['ok']) {
    $user = $result['user'];
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_name'] = $user['name'];
    $_SESSION['is_admin'] = $user['is_admin'];

    require_once __DIR__ . '/../../config/db.php';
    $stmt = $pdo->prepare('UPDATE users SET last_login = NOW() WHERE id = ?');
    $stmt->execute([$user['id']]);

    header('Location: ../../view/pantalla_principal/gestor_task.html');
    exit;
} else {
    $msg = urlencode($result['message'] ?? 'Credenciales inválidas.');
    header("Location: ../../view/login.html?error={$msg}");
    exit;
}
