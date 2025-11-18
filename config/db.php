<?php
// config/db.php - lector .env simple + PDO con puerto
function load_dotenv($path) {
    if (!file_exists($path)) return;
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || $line[0] === '#') continue;
        if (strpos($line, '=') === false) continue;
        [$name, $value] = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value);
        $value = preg_replace('/^"(.*)"$/', '$1', $value);
        $value = preg_replace("/^'(.*)'$/", '$1', $value);
        $_ENV[$name] = $value;
    }
}

load_dotenv(__DIR__ . '/../.env');

$DB_HOST = $_ENV['DB_HOST'] ?? '127.0.0.1';
$DB_PORT = $_ENV['DB_PORT'] ?? '3307';
$DB_NAME = $_ENV['DB_NAME'] ?? 'taskcolab';
$DB_USER = $_ENV['DB_USER'] ?? 'root';
$DB_PASS = $_ENV['DB_PASS'] ?? '';
$DB_CHARSET = $_ENV['DB_CHARSET'] ?? 'utf8mb4';

$dsn = "mysql:host={$DB_HOST};port={$DB_PORT};dbname={$DB_NAME};charset={$DB_CHARSET}";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $DB_USER, $DB_PASS, $options);
} catch (PDOException $e) {
    die('Error de conexión a la base de datos: ' . $e->getMessage());
}
