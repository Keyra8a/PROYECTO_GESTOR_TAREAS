<?php
// assets/app/endpointsTareas/create_task.php
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
    
    // Validar campos requeridos
    $required = ['title', 'assigned_to', 'due_date'];
    foreach ($required as $field) {
        if (empty($input[$field])) {
            throw new Exception("Campo requerido: $field");
        }
    }

    $taskModel = new TaskModel();
    $userId = $_SESSION['user']['id'];
    
    // En create_task.php - después de validar
    error_log("Datos recibidos en create_task: " . print_r($input, true));
    
    $taskData = [
        'title' => $input['title'],
        'description' => $input['description'] ?? '',
        'assigned_to' => (int)$input['assigned_to'],
        'status' => $input['status'], 
        'priority' => $input['priority'], 
        'due_date' => $input['due_date'],
        'board_id' => 1,
        'created_by' => $userId
    ];

    error_log("ENVIANDO VALORES DIRECTOS: status='{$taskData['status']}', priority='{$taskData['priority']}'");
    
    // Crear la tarea
    $result = $taskModel->createTask($taskData);
    
    if ($result) {
        echo json_encode([
            'ok' => true,
            'message' => 'Tarea creada exitosamente',
            'task_id' => $result
        ]);
    } else {
        throw new Exception('Error al crear la tarea en la base de datos');
    }
    
} catch (Exception $e) {
    error_log("Error en create_task: " . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        'ok' => false,
        'message' => $e->getMessage()
    ]);
}
?>