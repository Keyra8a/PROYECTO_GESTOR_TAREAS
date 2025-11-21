<?php
// assets/app/endpoints/list_users.php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../../../config/db.php'; 

try {
    $sql = "
      SELECT 
        u.id,
        u.name,
        u.email,
        COALESCE(u.notes, '') AS notes,
        u.is_active,
        u.last_login,
        (SELECT COUNT(*) 
           FROM task_assignments ta 
           JOIN tasks t ON ta.task_id = t.id 
           WHERE ta.user_id = u.id AND t.is_active = 1
        ) AS assigned_count
      FROM users u
      ORDER BY u.name ASC
    ";
    $stmt = $pdo->query($sql);
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['ok' => true, 'users' => $users]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => 'Error al obtener usuarios: '.$e->getMessage()]);
}
