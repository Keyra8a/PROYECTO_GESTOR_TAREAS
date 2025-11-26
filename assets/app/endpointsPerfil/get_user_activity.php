<?php
// assets/app/endpointsPerfil/get_user_activity.php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Headers anti-cache
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if (session_status() === PHP_SESSION_NONE) session_start();

require_once __DIR__ . '/../../models/TaskModel.php';

$user_id = $_SESSION['user']['id'] ?? null;
if (!$user_id) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'message' => 'No autenticado']);
    exit;
}

try {
    $taskModel = new TaskModel();
    
    // Obtener actividad SOLO del usuario actual
    $tareas = $taskModel->getUserActivity($user_id, 10);
    
    // Log para debug
    error_log("Actividad cargada para usuario $user_id: " . count($tareas) . " tareas");
    
    // Mapear campos para el frontend
    $tareasMapeadas = array_map(function($tarea) {
        return [
            'tarea' => $tarea['description'] ?? ($tarea['title'] ?? 'Sin descripcion'),
            'estado' => $tarea['status'] ?? '-',
            'fecha_limite' => $tarea['due_date'] ?? null,
            'prioridad' => $tarea['priority'] ?? '-',
            'tablero' => $tarea['board_title'] ?? 'General'
        ];
    }, $tareas);
    
    echo json_encode([
        'ok' => true,
        'tareas' => $tareasMapeadas,
        'count' => count($tareas),
        'debug_user_id' => $user_id,
        'timestamp' => time()
    ]);
    
} catch (Exception $e) {
    error_log("Error en get_user_activity: " . $e->getMessage());
    
    echo json_encode([
        'ok' => false,
        'tareas' => [],
        'count' => 0,
        'message' => 'Error al cargar actividad',
        'error' => $e->getMessage()
    ]);
}