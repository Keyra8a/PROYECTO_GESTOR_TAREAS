<?php
// assets/app/endpoints/update_user.php
header('Content-Type: application/json; charset=utf-8');
if (session_status() === PHP_SESSION_NONE) session_start();

require_once __DIR__ . '/../../../config/db.php';

// Leer JSON del body
$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'Payload inválido (se esperaba JSON).']);
    exit;
}

$id = intval($input['id'] ?? 0);
if ($id <= 0) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'Missing id']);
    exit;
}

// Verificar que el usuario esté autenticado
$currentUser = $_SESSION['user'] ?? null;
if (!$currentUser) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'message' => 'No autenticado']);
    exit;
}

// Solo permitir editar su propio perfil (o si es admin)
if (intval($currentUser['id']) !== $id && empty($currentUser['is_admin'])) {
    http_response_code(403);
    echo json_encode(['ok' => false, 'message' => 'No autorizado para editar este usuario']);
    exit;
}

// Campos permitidos a actualizar
$name = trim($input['name'] ?? '');
$email = trim($input['email'] ?? '');
$notes = isset($input['notes']) ? trim($input['notes']) : null; 
$is_active = isset($input['is_active']) ? (int)$input['is_active'] : null;
$last_login = $input['last_login'] ?? null;

try {
    $fields = [];
    $params = [];

    if ($name !== '') { 
        $fields[] = 'name = ?'; 
        $params[] = $name; 
    }
    if ($email !== '') { 
        $fields[] = 'email = ?'; 
        $params[] = $email; 
    }

    if ($notes !== null) { 
        $fields[] = 'notes = ?'; 
        $params[] = $notes; 
    }
    if ($is_active !== null) { 
        $fields[] = 'is_active = ?'; 
        $params[] = $is_active; 
    }
    if ($last_login !== null) { 
        $fields[] = 'last_login = ?'; 
        $params[] = $last_login; 
    }

    if (empty($fields)) {
        echo json_encode(['ok' => false, 'message' => 'No hay campos para actualizar.']);
        exit;
    }

    $params[] = $id;
    $sql = "UPDATE users SET " . implode(', ', $fields) . " WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    // ACTUALIZAR LA SESIÓN si el usuario editó su propio perfil
    if (intval($currentUser['id']) === $id) {
        $_SESSION['user']['name'] = $name !== '' ? $name : $currentUser['name'];
        $_SESSION['user']['email'] = $email !== '' ? $email : $currentUser['email'];
        if ($is_active !== null) {
            $_SESSION['user']['is_active'] = $is_active;
        }
    }

    // Devolver el usuario actualizado con el conteo de tareas
    $stmt2 = $pdo->prepare("
        SELECT 
            u.id, 
            u.name, 
            u.email, 
            u.notes, 
            u.is_active, 
            u.last_login,
            u.is_admin,
            COUNT(ta.task_id) as assigned_count
        FROM users u
        LEFT JOIN task_assignments ta ON u.id = ta.user_id
        WHERE u.id = ?
        GROUP BY u.id
    ");
    $stmt2->execute([$id]);
    $user = $stmt2->fetch(PDO::FETCH_ASSOC);

    echo json_encode(['ok' => true, 'user' => $user, 'message' => 'Usuario actualizado correctamente']);
    exit;

} catch (PDOException $ex) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => 'Error en la base de datos: ' . $ex->getMessage()]);
    exit;
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => 'Error: ' . $e->getMessage()]);
    exit;
}