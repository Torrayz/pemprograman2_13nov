<?php
require_once __DIR__ . '/koneksi.php';
if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_response(['success' => false, 'message' => 'Method tidak diizinkan.'], 405);
require_admin();
$data = json_decode(file_get_contents('php://input'), true);
$id = filter_var($data['articleID'] ?? null, FILTER_VALIDATE_INT);
if (!$id || $id < 1) json_response(['success' => false, 'message' => 'ID tidak valid.'], 422);
try {
    $stmt = $conn->prepare('DELETE FROM articles WHERE articleID=?');
    $stmt->bind_param('i', $id);
    $stmt->execute();
    if ($stmt->affected_rows === 0) json_response(['success' => false, 'message' => 'Artikel tidak ditemukan.'], 404);
    json_response(['success' => true, 'message' => 'Artikel dihapus.']);
} catch (mysqli_sql_exception $error) {
    error_log($error->getMessage());
    json_response(['success' => false, 'message' => 'Gagal menghapus artikel.'], 500);
}
