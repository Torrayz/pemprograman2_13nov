<?php
require_once __DIR__ . '/koneksi.php';
if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_response(['success' => false, 'message' => 'Method tidak diizinkan.'], 405);
require_admin();
$id = filter_var($_POST['articleID'] ?? null, FILTER_VALIDATE_INT);
if (!$id || $id < 1) json_response(['success' => false, 'message' => 'ID tidak valid.'], 422);
$title = article_field('title', 100);
$author = article_field('author', 100);
$lead = article_field('abstraksi', 300);
$content = article_field('content', 5000);
try {
    $stmt = $conn->prepare('UPDATE articles SET judul=?, penulis=?, lead=?, content=?, waktu=NOW() WHERE articleID=?');
    $stmt->bind_param('ssssi', $title, $author, $lead, $content, $id);
    $stmt->execute();
    if ($stmt->affected_rows === 0) json_response(['success' => false, 'message' => 'Artikel tidak ditemukan atau tidak berubah.'], 404);
    json_response(['success' => true, 'message' => 'Artikel diperbarui.']);
} catch (mysqli_sql_exception $error) {
    error_log($error->getMessage());
    json_response(['success' => false, 'message' => 'Gagal memperbarui artikel.'], 500);
}
