<?php
// assets/app/endpointsTareas/delete_tasks.php
session_start();
header('Content-Type: application/json');

// Verificar sesión
if (!isset($_SESSION['user']) || !isset($_SESSION['user']['id'])) {
    http_response_code(401);
    echo json_encode([
        'ok' => false, 
        'message' => 'No autorizado: sesión no iniciada'
    ]);
    exit;
}

require_once __DIR__ . '/../../models/TaskModel.php';

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        throw new Exception('Datos JSON inválidos');
    }
    
    // Validar que se proporcionaron IDs de tareas
    if (empty($input['task_ids']) || !is_array($input['task_ids'])) {
        throw new Exception('IDs de tareas requeridos');
    }

    $taskModel = new TaskModel();
    $userId = $_SESSION['user']['id'];
    
    $taskIds = array_map('intval', $input['task_ids']);
    
    error_log("Eliminando tareas: " . implode(', ', $taskIds));
    
    // Eliminar las tareas
    $result = $taskModel->deleteTasks($taskIds, $userId);
    
    if ($result) {
        echo json_encode([
            'ok' => true,
            'message' => count($taskIds) . ' tarea eliminada exitosamente',
            'deleted_count' => $result
        ]);
    } else {
        throw new Exception('Error al eliminar las tareas');
    }
    
} catch (Exception $e) {
    error_log("Error en delete_tasks: " . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        'ok' => false,
        'message' => $e->getMessage()
    ]);
}
?>