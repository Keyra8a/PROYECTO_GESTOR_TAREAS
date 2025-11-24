<?php
ini_set('display_errors',1);
error_reporting(E_ALL);

$host = '127.0.0.1';
$port = 3307;
$db   = 'taskcolab';
$user = 'root';
$pass = '';

$dsn = "mysql:host={$host};port={$port};dbname={$db};charset=utf8mb4";
echo "DSN: $dsn<br>";

try {
    $start = microtime(true);
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_TIMEOUT => 5,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    $t = round(microtime(true) - $start, 3);
    echo "Conectado OK en {$t}s<br>";
    $stmt = $pdo->query("SELECT NOW() as now");
    $row = $stmt->fetch();
    var_dump($row);
} catch (Exception $e) {
    echo "<strong>ERROR:</strong> " . htmlspecialchars($e->getMessage());
}
