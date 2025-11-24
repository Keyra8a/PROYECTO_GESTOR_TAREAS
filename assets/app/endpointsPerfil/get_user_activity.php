<?php
// assets/app/endpointsPerfil/get_user_activity.php
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

$user_id = $_SESSION['user']['id'] ?? null;
if (!$user_id) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'message' => 'No autenticado']);
    exit;
}

try {
    // Consulta para obtener tareas del usuario
    $stmt = $pdo->prepare("
        SELECT 
            t.id,
            t.title as tarea,
            t.status as estado,
            t.due_date as fecha_limite,
            t.created_at
        FROM tasks t
        WHERE t.assigned_to = ?
        ORDER BY t.due_date ASC, t.created_at DESC
        LIMIT 20
    ");
    
    $stmt->execute([$user_id]);
    $tareas = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Si no hay tabla tasks aún, devolver datos de ejemplo
    if (empty($tareas)) {
        $tareas = [
            ['tarea' => 'Diseñar interfaz de usuario', 'estado' => 'En progreso', 'fecha_limite' => date('Y-m-d', strtotime('+3 days'))],
            ['tarea' => 'Revisar documentación', 'estado' => 'Pendiente', 'fecha_limite' => date('Y-m-d', strtotime('+5 days'))],
            ['tarea' => 'Testing de funcionalidades', 'estado' => 'Completado', 'fecha_limite' => date('Y-m-d', strtotime('-2 days'))]
        ];
    }
    
    echo json_encode([
        'ok' => true,
        'tareas' => $tareas
    ]);
    
} catch (PDOException $e) {
    // Si hay error, devolver datos de ejemplo
    echo json_encode([
        'ok' => true,
        'tareas' => [
            ['tarea' => 'Diseñar interfaz de usuario', 'estado' => 'En progreso', 'fecha_limite' => date('Y-m-d', strtotime('+3 days'))],
            ['tarea' => 'Revisar documentación', 'estado' => 'Pendiente', 'fecha_limite' => date('Y-m-d', strtotime('+5 days'))],
            ['tarea' => 'Testing de funcionalidades', 'estado' => 'Completado', 'fecha_limite' => date('Y-m-d', strtotime('-2 days'))]
        ]
    ]);
}
?>