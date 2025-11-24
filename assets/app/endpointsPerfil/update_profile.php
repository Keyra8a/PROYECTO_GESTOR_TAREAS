<?php
// assets/app/endpointsPerfil/update_profile.php
// HEADERS CORS
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

$name = trim($input['name'] ?? '');
$email = trim($input['email'] ?? '');

if (empty($name) && empty($email)) {
    echo json_encode(['ok' => false, 'message' => 'No hay campos para actualizar']);
    exit;
}

try {
    $fields = [];
    $params = [];
    
    if (!empty($name)) {
        $fields[] = 'name = ?';
        $params[] = $name;
    }
    
    if (!empty($email)) {
        // Verificar si el email ya existe (excluyendo al usuario actual)
        $stmtCheck = $pdo->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
        $stmtCheck->execute([$email, $user_id]);
        if ($stmtCheck->fetch()) {
            echo json_encode(['ok' => false, 'message' => 'El correo electrónico ya está en uso']);
            exit;
        }
        $fields[] = 'email = ?';
        $params[] = $email;
    }
    
    $params[] = $user_id;
    $sql = "UPDATE users SET " . implode(', ', $fields) . " WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    
    // Actualizar datos en sesión
    if (!empty($name)) $_SESSION['user']['name'] = $name;
    if (!empty($email)) $_SESSION['user']['email'] = $email;
    
    echo json_encode([
        'ok' => true, 
        'message' => 'Perfil actualizado correctamente',
        'user' => [
            'name' => $name ?: $_SESSION['user']['name'],
            'email' => $email ?: $_SESSION['user']['email']
        ]
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => 'Error en la base de datos: ' . $e->getMessage()]);
}
?>