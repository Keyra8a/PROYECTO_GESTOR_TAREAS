<?php
// assets/models/UserModel.php
require_once __DIR__ . '/../../config/db.php';

class UserModel {
    private $pdo;
    public function __construct() {
        global $pdo;
        $this->pdo = $pdo;
    }

    public function findByEmail($email) {
        $stmt = $this->pdo->prepare("SELECT * FROM users WHERE email = ? LIMIT 1");
        $stmt->execute([$email]);
        return $stmt->fetch();
    }

    public function create($name, $email, $password_hash, $is_admin = 0) {
        $sql = "INSERT INTO users (name, email, password_hash, is_admin, created_at, is_active) VALUES (?, ?, ?, ?, NOW(), 1)";
        $stmt = $this->pdo->prepare($sql);
        $ok = $stmt->execute([$name, $email, $password_hash, $is_admin]);
        if ($ok) return $this->pdo->lastInsertId();
        return false;
    }
}
