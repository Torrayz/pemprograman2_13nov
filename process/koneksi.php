<?php
declare(strict_types=1);
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
header('X-Content-Type-Options: nosniff');
$host = getenv('DB_HOST') ?: '127.0.0.1';
$user = getenv('DB_USER') ?: 'root';
$password = getenv('DB_PASSWORD') ?: '';
$database = getenv('DB_NAME') ?: 'artikel_db';
try {
    $conn = new mysqli($host, $user, $password, $database);
    $conn->set_charset('utf8mb4');
} catch (mysqli_sql_exception $error) {
    error_log($error->getMessage());
    http_response_code(503);
    header('Content-Type: application/json; charset=utf-8');
    exit(json_encode(['success' => false, 'message' => 'Database tidak tersedia.']));
}
function json_response(array $data, int $status = 200): void {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}
function require_admin(): void {
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start(['cookie_httponly' => true, 'cookie_samesite' => 'Lax', 'use_strict_mode' => true]);
    }
    if (empty($_SESSION['newshub_admin'])) {
        json_response(['success' => false, 'message' => 'Sesi admin dibutuhkan. Login terlebih dahulu.'], 401);
    }
    $token = $_POST['csrf_token'] ?? $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    if (!is_string($token) || !hash_equals($_SESSION['csrf_token'] ?? '', $token)) {
        json_response(['success' => false, 'message' => 'Token keamanan tidak cocok.'], 403);
    }
}
function article_field(string $name, int $max): string {
    $value = trim((string)($_POST[$name] ?? ''));
    if ($value === '' || mb_strlen($value) > $max) {
        json_response(['success' => false, 'message' => "Field $name wajib diisi (maksimum $max karakter)."], 422);
    }
    return $value;
}
