<?php
// assets/models/TaskModel.php
require_once __DIR__ . '/../../config/db.php';

class TaskModel {
    private $conn;
    private $table = 'tasks';
    private $assignmentsTable = 'task_assignments';

    // Mapeo de valores de frontend a base de datos
    private $statusMap = [
        'Pendiente' => 'pending',
        'En proceso' => 'in_progress', 
        'Completado' => 'done',
        'pending' => 'Pendiente',
        'in_progress' => 'En proceso', 
        'done' => 'Completado'
    ];

    private $priorityMap = [
        'Alta' => 'high',
        'Media' => 'medium', 
        'Baja' => 'low',
        'high' => 'Alta',
        'medium' => 'Media',
        'low' => 'Baja'
    ];

    public function __construct() {
        global $pdo;
        $this->conn = $pdo;
    }

    // Convertir status de DB a frontend
    private function statusToFrontend($dbStatus) {
        return $this->statusMap[$dbStatus] ?? $dbStatus;
    }

    // Convertir status de frontend a DB
    private function statusToDB($frontendStatus) {
        return $this->statusMap[$frontendStatus] ?? 'pending';
    }

    // Convertir prioridad de DB a frontend
    private function priorityToFrontend($dbPriority) {
        return $this->priorityMap[$dbPriority] ?? $dbPriority;
    }

    // Convertir prioridad de frontend a DB
    private function priorityToDB($frontendPriority) {
        return $this->priorityMap[$frontendPriority] ?? 'medium';
    }

    // Obtener todas las tareas del usuario actual
    public function getUserTasks($userId) {
        try {
            $query = "SELECT DISTINCT
                        t.id,
                        t.title,
                        t.description,
                        t.board_id,
                        b.title as board_title,
                        t.status,
                        t.priority,
                        t.due_date,
                        t.created_by,
                        t.created_at,
                        t.updated_at,
                        GROUP_CONCAT(DISTINCT u.name SEPARATOR ', ') as assigned_users,
                        GROUP_CONCAT(DISTINCT ta.user_id) as assigned_user_ids
                    FROM {$this->table} t
                    LEFT JOIN boards b ON t.board_id = b.id
                    LEFT JOIN {$this->assignmentsTable} ta ON t.id = ta.task_id
                    LEFT JOIN users u ON ta.user_id = u.id
                    WHERE t.is_active = 1
                    AND (
                        t.created_by = :user_id1
                        OR ta.user_id = :user_id2
                        OR b.owner_id = :user_id3
                    )
                    GROUP BY t.id
                    ORDER BY t.created_at DESC";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':user_id1', $userId, PDO::PARAM_INT);
            $stmt->bindParam(':user_id2', $userId, PDO::PARAM_INT);
            $stmt->bindParam(':user_id3', $userId, PDO::PARAM_INT);
            $stmt->execute();
            
            $tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Convertir valores de DB a frontend
            foreach ($tasks as &$task) {
                $task['status'] = $this->statusToFrontend($task['status']);
                $task['priority'] = $this->priorityToFrontend($task['priority']);
                
                if (empty($task['assigned_users'])) {
                    $task['assigned_users'] = null;
                    $task['assigned_user_ids'] = null;
                }
            }
            
            error_log("getUserTasks CORREGIDO: " . count($tasks) . " tareas para usuario $userId");
            return $tasks;
            
        } catch (PDOException $e) {
            error_log("Error en getUserTasks: " . $e->getMessage());
            throw new Exception("Error de base de datos: " . $e->getMessage());
        }
    }

    //  Obtener una tarea específica por ID
    public function getTaskById($taskId, $userId) {
        try {
            $sql = "SELECT t.*, b.title as board_title, 
                        GROUP_CONCAT(DISTINCT u.name) as assigned_users,
                        GROUP_CONCAT(DISTINCT u.id) as assigned_user_ids
                    FROM tasks t
                    LEFT JOIN boards b ON t.board_id = b.id
                    LEFT JOIN task_assignments ta ON t.id = ta.task_id
                    LEFT JOIN users u ON ta.user_id = u.id
                    WHERE t.id = :task_id 
                    AND (t.created_by = :user_id OR ta.user_id = :user_id)
                    GROUP BY t.id";
            
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([
                ':task_id' => $taskId,
                ':user_id' => $userId
            ]);
            
            $task = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($task) {
                $task['status'] = $this->statusToFrontend($task['status']);
                $task['priority'] = $this->priorityToFrontend($task['priority']);
            }
            
            return $task;
            
        } catch (PDOException $e) {
            error_log("Error en getTaskById: " . $e->getMessage());
            return false;
        }
    }

    // Crear una nueva tarea
    public function createTask($taskData) {
        try {
            error_log("INICIANDO createTask");
            
            // Validar valores antes de insertar
            $validStatuses = ['pending', 'in_progress', 'done'];
            $validPriorities = ['high', 'medium', 'low'];
            
            $dbStatus = $this->statusToDB($taskData['status']);
            $dbPriority = $this->priorityToDB($taskData['priority']);
            
            error_log("Validacion:");
            error_log("   Status: '{$taskData['status']}' -> '$dbStatus'");
            error_log("   Priority: '{$taskData['priority']}' -> '$dbPriority'");
            
            // Forzar valores validos si es necesario
            if (!in_array($dbStatus, $validStatuses)) {
                error_log("Status invalido, usando 'pending'");
                $dbStatus = 'pending';
            }
            
            if (!in_array($dbPriority, $validPriorities)) {
                error_log("Priority invalido, usando 'medium'");
                $dbPriority = 'medium';
            }
            
            $sql = "INSERT INTO tasks (title, description, board_id, status, priority, due_date, created_by, created_at, updated_at) 
                    VALUES (:title, :description, :board_id, :status, :priority, :due_date, :created_by, NOW(), NOW())";
            
            $stmt = $this->conn->prepare($sql);
            $result = $stmt->execute([
                ':title' => $taskData['title'],
                ':description' => $taskData['description'],
                ':board_id' => $taskData['board_id'],
                ':status' => $dbStatus,
                ':priority' => $dbPriority,
                ':due_date' => $taskData['due_date'],
                ':created_by' => $taskData['created_by']
            ]);
            
            if (!$result) {
                $errorInfo = $stmt->errorInfo();
                error_log("Error SQL: " . print_r($errorInfo, true));
                return false;
            }
            
            $taskId = $this->conn->lastInsertId();
            error_log("Tarea creada ID: $taskId, status: '$dbStatus', priority: '$dbPriority'");
            
            if (!empty($taskData['assigned_to'])) {
                $this->assignTaskToUser($taskId, $taskData['assigned_to']);
            }
            
            return $taskId;
            
        } catch (PDOException $e) {
            error_log("PDOException: " . $e->getMessage());
            return false;
        }
    }

    private function assignTaskToUser($taskId, $userId) {
        try {
            $sql = "INSERT INTO task_assignments (task_id, user_id, assigned_at) 
                    VALUES (:task_id, :user_id, NOW())";
            
            $stmt = $this->conn->prepare($sql);
            return $stmt->execute([
                ':task_id' => $taskId,
                ':user_id' => $userId
            ]);
            
        } catch (PDOException $e) {
            error_log("Error asignando tarea: " . $e->getMessage());
            return false;
        }
    }

    // Actualizar una tarea
    public function updateTask($updateData, $userId) {
        try {
            // Verificar que el usuario tiene permisos sobre la tarea
            $checkSql = "SELECT id FROM tasks WHERE id = :task_id AND (created_by = :user_id OR id IN (SELECT task_id FROM task_assignments WHERE user_id = :user_id))";
            $checkStmt = $this->conn->prepare($checkSql);
            $checkStmt->execute([
                ':task_id' => $updateData['task_id'],
                ':user_id' => $userId
            ]);
            
            if (!$checkStmt->fetch()) {
                throw new Exception('No tienes permisos para editar esta tarea');
            }
            
            // Construir query dinamica
            $setParts = [];
            $params = [':task_id' => $updateData['task_id']];
            
            if (isset($updateData['title'])) {
                $setParts[] = 'title = :title';
                $params[':title'] = $updateData['title'];
            }
            if (isset($updateData['description'])) {
                $setParts[] = 'description = :description';
                $params[':description'] = $updateData['description'];
            }
            if (isset($updateData['status'])) {
                $setParts[] = 'status = :status';
                $params[':status'] = $this->statusToDB($updateData['status']);
            }
            if (isset($updateData['priority'])) {
                $setParts[] = 'priority = :priority';
                $params[':priority'] = $this->priorityToDB($updateData['priority']);
            }
            if (isset($updateData['due_date'])) {
                $setParts[] = 'due_date = :due_date';
                $params[':due_date'] = $updateData['due_date'];
            }
            if (isset($updateData['board_id'])) {
                $setParts[] = 'board_id = :board_id';
                $params[':board_id'] = $updateData['board_id'];
            }
            
            // Siempre actualizar updated_at
            $setParts[] = 'updated_at = NOW()';
            
            if (empty($setParts)) {
                throw new Exception('No hay campos para actualizar');
            }
            
            $sql = "UPDATE tasks SET " . implode(', ', $setParts) . " WHERE id = :task_id";
            $stmt = $this->conn->prepare($sql);
            $stmt->execute($params);
            
            // Actualizar asignaciones 
            if (isset($updateData['assigned_to'])) {
                // Eliminar asignaciones existentes
                $deleteSql = "DELETE FROM task_assignments WHERE task_id = :task_id";
                $deleteStmt = $this->conn->prepare($deleteSql);
                $deleteStmt->execute([':task_id' => $updateData['task_id']]);
                
                // Crear nueva asignacion
                $assignSql = "INSERT INTO task_assignments (task_id, user_id, assigned_at) VALUES (:task_id, :user_id, NOW())";
                $assignStmt = $this->conn->prepare($assignSql);
                $assignStmt->execute([
                    ':task_id' => $updateData['task_id'],
                    ':user_id' => $updateData['assigned_to']
                ]);
            }
            
            return true;
            
        } catch (PDOException $e) {
            error_log("Error en updateTask: " . $e->getMessage());
            return false;
        }
    }

    // Eliminar multiples tareas (soft delete - is_active = 0)
    public function deleteTasks($taskIds, $userId) {
        try {
            // Verificar permisos para cada tarea
            $placeholders = implode(',', array_fill(0, count($taskIds), '?'));
            $checkSql = "SELECT id FROM tasks WHERE id IN ($placeholders) AND (created_by = ? OR id IN (SELECT task_id FROM task_assignments WHERE user_id = ?))";
            
            $checkParams = array_merge($taskIds, [$userId, $userId]);
            $checkStmt = $this->conn->prepare($checkSql);
            $checkStmt->execute($checkParams);
            
            $allowedTasks = $checkStmt->fetchAll(PDO::FETCH_COLUMN);
            
            if (count($allowedTasks) !== count($taskIds)) {
                throw new Exception('No tienes permisos para eliminar algunas tareas');
            }
            
            // SOFT DELETE: Marcar como inactivo en lugar de eliminar
            $updateSql = "UPDATE tasks SET is_active = 0, updated_at = NOW() WHERE id IN ($placeholders)";
            $updateStmt = $this->conn->prepare($updateSql);
            $updateStmt->execute($taskIds);
            
            $affectedRows = $updateStmt->rowCount();
            
            error_log("Soft delete realizado. Tareas marcadas como inactivas: $affectedRows");
            return $affectedRows;
            
        } catch (PDOException $e) {
            error_log("Error en deleteTasks: " . $e->getMessage());
            return false;
        }
    }

    // Método público para obtener actividad reciente del usuario - LÓGICA CORREGIDA
    public function getUserActivity($userId, $limit = 10) {
        try {
            $sql = "
                SELECT DISTINCT
                    t.id,
                    t.title,
                    t.description,
                    t.status,
                    t.priority,
                    t.due_date,
                    t.created_at,
                    b.title as board_title,
                    t.created_by,
                    GROUP_CONCAT(DISTINCT ta.user_id) as assigned_user_ids
                FROM tasks t
                LEFT JOIN boards b ON t.board_id = b.id
                LEFT JOIN task_assignments ta ON t.id = ta.task_id
                WHERE t.is_active = 1
                GROUP BY t.id
                HAVING (
                    -- El usuario está ASIGNADO a la tarea
                    FIND_IN_SET(:user_id1, assigned_user_ids) > 0
                    OR 
                    -- O el usuario CREÓ la tarea Y NO está asignada a nadie más
                    (t.created_by = :user_id2 AND (assigned_user_ids IS NULL OR assigned_user_ids = ''))
                )
                ORDER BY t.created_at DESC
                LIMIT :limit
            ";
            
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':user_id1', $userId, PDO::PARAM_INT);
            $stmt->bindParam(':user_id2', $userId, PDO::PARAM_INT);
            $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
            $stmt->execute();
            
            $tareas = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Convertir valores para el frontend
            foreach ($tareas as &$tarea) {
                $tarea['status'] = $this->statusToFrontend($tarea['status']);
                $tarea['priority'] = $this->priorityToFrontend($tarea['priority']);
                // Remover el campo interno assigned_user_ids
                unset($tarea['assigned_user_ids']);
            }
            
            error_log("getUserActivity LÓGICA CORREGIDA: " . count($tareas) . " tareas para usuario $userId");
            
            // DEBUG: Registrar qué tareas se están mostrando
            foreach ($tareas as $tarea) {
                error_log("   - Tarea ID {$tarea['id']}: {$tarea['title']} (creada por: {$tarea['created_by']})");
            }
            
            return $tareas;
            
        } catch (PDOException $e) {
            error_log("Error en getUserActivity: " . $e->getMessage());
            return [];
        }
    }

    //  Obtener estadisticas de tareas del usuario (solo activas) - CORREGIDO
    public function getUserTaskStats($userId) {
        try {
            $sql = "SELECT 
                    COUNT(DISTINCT t.id) as total_tasks,
                    COUNT(DISTINCT CASE WHEN t.created_by = :user_id THEN t.id END) as created_tasks,
                    COUNT(DISTINCT CASE WHEN ta.user_id = :user_id THEN t.id END) as assigned_tasks,
                    COUNT(DISTINCT CASE WHEN t.status = 'pending' THEN t.id END) as pending_tasks,
                    COUNT(DISTINCT CASE WHEN t.status = 'in_progress' THEN t.id END) as in_progress_tasks,
                    COUNT(DISTINCT CASE WHEN t.status = 'done' THEN t.id END) as done_tasks
                FROM tasks t
                LEFT JOIN task_assignments ta ON t.id = ta.task_id
                WHERE t.is_active = 1
                AND (t.created_by = :user_id OR ta.user_id = :user_id)";
            
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([':user_id' => $userId]);
            
            $stats = $stmt->fetch(PDO::FETCH_ASSOC);
            error_log("getUserTaskStats: {$stats['total_tasks']} tareas para usuario $userId");
            
            return $stats;
            
        } catch (PDOException $e) {
            error_log("Error en getUserTaskStats: " . $e->getMessage());
            return [
                'total_tasks' => 0, 
                'created_tasks' => 0, 
                'assigned_tasks' => 0,
                'pending_tasks' => 0,
                'in_progress_tasks' => 0,
                'done_tasks' => 0
            ];
        }
    }
}