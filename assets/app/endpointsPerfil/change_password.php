<?php
// assets/app/endpointsPerfil/change_password.php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if (session_status() === PHP_SESSION_NONE) session_start();

require_once __DIR__ . '/../../../config/db.php';

$input = json_decode(file_get_contents('php://input'), true);

// 🔥 DEBUGGING
error_log("=== CHANGE_PASSWORD DEBUG ===");
error_log("Datos recibidos: " . print_r($input, true));
error_log("Usuario en sesión: " . ($_SESSION['user']['id'] ?? 'NO'));

if (!is_array($input)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'Payload inválido']);
    exit;
}

$user_id = $_SESSION['user']['id'] ?? null;
if (!$user_id) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'message' => 'No autenticado']);
    exit;
}

$current_password = $input['current_password'] ?? '';
$new_password = $input['new_password'] ?? '';
$confirm_password = $input['confirm_password'] ?? '';

error_log("Contraseña actual recibida: " . ($current_password ? 'SÍ' : 'NO'));
error_log("Nueva contraseña recibida: " . ($new_password ? 'SÍ' : 'NO'));

if (empty($current_password) || empty($new_password) || empty($confirm_password)) {
    echo json_encode(['ok' => false, 'message' => 'Todos los campos son obligatorios']);
    exit;
}

if ($new_password !== $confirm_password) {
    echo json_encode(['ok' => false, 'message' => 'Las contraseñas no coinciden']);
    exit;
}

if (strlen($new_password) < 6) {
    echo json_encode(['ok' => false, 'message' => 'La contraseña debe tener al menos 6 caracteres']);
    exit;
}

try {
    // Obtener usuario con password_hash
    $stmt = $pdo->prepare("SELECT id, password_hash FROM users WHERE id = ?");
    $stmt->execute([$user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    error_log("Usuario encontrado en BD: " . ($user ? 'SÍ' : 'NO'));
    error_log("Password_hash en BD: " . ($user['password_hash'] ?? 'VACÍO'));
    
    if (!$user) {
        echo json_encode(['ok' => false, 'message' => 'Usuario no encontrado']);
        exit;
    }
    
    // Si no tiene contraseña establecida, permitir establecerla
    if (empty($user['password_hash'])) {
        error_log("Usuario sin contraseña - Estableciendo nueva");
        $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
        $stmtUpdate = $pdo->prepare("UPDATE users SET password_hash = ? WHERE id = ?");
        $stmtUpdate->execute([$hashed_password, $user_id]);
        
        echo json_encode(['ok' => true, 'message' => 'Contraseña establecida correctamente']);
        exit;
    }
    
    // Verificar contraseña actual
    error_log("Verificando contraseña actual...");
    $password_verify = password_verify($current_password, $user['password_hash']);
    error_log("Resultado password_verify: " . ($password_verify ? 'CORRECTA' : 'INCORRECTA'));
    
    if (!$password_verify) {
        echo json_encode(['ok' => false, 'message' => 'Contraseña actual incorrecta']);
        exit;
    }
    
    // Actualizar contraseña
    error_log("Actualizando contraseña...");
    $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
    $stmtUpdate = $pdo->prepare("UPDATE users SET password_hash = ? WHERE id = ?");
    $stmtUpdate->execute([$hashed_password, $user_id]);
    
    error_log("Contraseña actualizada exitosamente");
    echo json_encode(['ok' => true, 'message' => 'Contraseña actualizada correctamente']);
    
} catch (PDOException $e) {
    error_log("ERROR PDO: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => 'Error en la base de datos: ' . $e->getMessage()]);
}

error_log("=== FIN CHANGE_PASSWORD ===");
?>