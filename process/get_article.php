<?php
require_once __DIR__ . '/koneksi.php';
$id = filter_var($_GET['id'] ?? null, FILTER_VALIDATE_INT);
if (!$id || $id < 1) json_response(['success' => false, 'message' => 'ID tidak valid.'], 422);
try {
    $stmt = $conn->prepare('SELECT articleID, judul, penulis, lead, content, waktu FROM articles WHERE articleID=?');
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $article = $stmt->get_result()->fetch_assoc();
    if (!$article) json_response(['success' => false, 'message' => 'Artikel tidak ditemukan.'], 404);
    json_response(['success' => true, 'article' => $article]);
} catch (mysqli_sql_exception $error) {
    error_log($error->getMessage());
    json_response(['success' => false, 'message' => 'Gagal memuat artikel.'], 500);
}
