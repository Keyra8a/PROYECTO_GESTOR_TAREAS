<?php
require __DIR__ . '/config/db.php';
try {
    echo "Conexión configurada con: {$_ENV['DB_HOST']}:{$_ENV['DB_PORT']} (usuario: {$_ENV['DB_USER']})<br>";
    $stmt = $pdo->query('SELECT DATABASE() as db, NOW() as now');
    $row = $stmt->fetch();
    echo "Conexión OK. BD actual: {$row['db']}, Hora DB: {$row['now']}";
} catch (Exception $e) {
    echo "ERROR test DB: " . $e->getMessage();
}
