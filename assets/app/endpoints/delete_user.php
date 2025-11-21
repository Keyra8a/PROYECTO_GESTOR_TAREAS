<?php
// assets/app/endpoints/delete_user.php
header('Content-Type: application/json; charset=utf-8');
if (session_status() === PHP_SESSION_NONE) session_start();

require_once __DIR__ . '/../../../config/db.php';

$input = json_decode(file_get_contents('php://input'), true);
$id = intval($input['id'] ?? 0);

if (!$id) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'Missing id']);
    exit;
}

$current = $_SESSION['user'] ?? null;
if (!$current) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'message' => 'No autenticado']);
    exit;
}

// Permitir solo al propio usuario eliminar su cuenta (según tu requerimiento)
if (intval($current['id']) !== $id && empty($current['is_admin'])) {
    http_response_code(403);
    echo json_encode(['ok' => false, 'message' => 'No autorizado para eliminar este usuario']);
    exit;
}

try {
    // 🔥 FIX: PRIMERO ELIMINAR TODAS LAS REFERENCIAS EN ORDEN
    
    // 1. Eliminar asignaciones de tareas
    $stmt1 = $pdo->prepare('DELETE FROM task_assignments WHERE user_id = ?');
    $stmt1->execute([$id]);
    
    // 2. Eliminar comentarios del usuario
    $stmt2 = $pdo->prepare('DELETE FROM comments WHERE user_id = ?');
    $stmt2->execute([$id]);
    
    // 3. Actualizar attachments (poner uploaded_by en NULL)
    $stmt3 = $pdo->prepare('UPDATE attachments SET uploaded_by = NULL WHERE uploaded_by = ?');
    $stmt3->execute([$id]);
    
    // 4. Actualizar tasks creadas por el usuario (poner created_by en NULL)
    $stmt4 = $pdo->prepare('UPDATE tasks SET created_by = NULL WHERE created_by = ?');
    $stmt4->execute([$id]);
    
    // 5. Eliminar membresías de boards
    $stmt5 = $pdo->prepare('DELETE FROM board_members WHERE user_id = ?');
    $stmt5->execute([$id]);
    
    // 6. Actualizar boards donde es invited_by (poner en NULL)
    $stmt6 = $pdo->prepare('UPDATE board_members SET invited_by = NULL WHERE invited_by = ?');
    $stmt6->execute([$id]);
    
    // 7. Actualizar boards donde es owner (poner en NULL o eliminar según tu lógica)
    // Opción A: Poner owner_id en NULL
    $stmt7 = $pdo->prepare('UPDATE boards SET owner_id = NULL WHERE owner_id = ?');
    $stmt7->execute([$id]);
    
    // Opción B alternativa: Eliminar los boards huérfanos
    // $stmt7 = $pdo->prepare('DELETE FROM boards WHERE owner_id = ?');
    // $stmt7->execute([$id]);
    
    // 8. Actualizar activity_logs (poner user_id en NULL)
    $stmt8 = $pdo->prepare('UPDATE activity_logs SET user_id = NULL WHERE user_id = ?');
    $stmt8->execute([$id]);
    
    // 9. Eliminar notificaciones del usuario
    $stmt9 = $pdo->prepare('DELETE FROM notifications WHERE user_id = ?');
    $stmt9->execute([$id]);
    
    // 10. FINALMENTE eliminar el usuario
    $stmt = $pdo->prepare('DELETE FROM users WHERE id = ?');
    $ok = $stmt->execute([$id]);
    
    if ($ok && $stmt->rowCount() > 0) {
        // Si el usuario que se borró es el que está en sesión, destruir sesión
        if (intval($current['id']) === $id) {
            // Destruir la sesión completamente
            $_SESSION = array();
            
            // Eliminar la cookie de sesión si existe
            if (ini_get("session.use_cookies")) {
                $params = session_get_cookie_params();
                setcookie(session_name(), '', time() - 42000,
                    $params["path"], $params["domain"],
                    $params["secure"], $params["httponly"]
                );
            }
            
            session_destroy();
        }
        
        echo json_encode([
            'ok' => true, 
            'message' => 'Usuario eliminado correctamente',
            'logout' => (intval($current['id']) === $id) // indicar si debe hacer logout
        ]);
    } else {
        http_response_code(404);
        echo json_encode(['ok' => false, 'message' => 'Usuario no encontrado o ya fue eliminado']);
    }
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'ok' => false, 
        'message' => 'Error al eliminar usuario: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'ok' => false, 
        'message' => 'Error inesperado: ' . $e->getMessage()
    ]);
}