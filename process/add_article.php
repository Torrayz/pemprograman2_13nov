<?php
require_once __DIR__ . '/koneksi.php';
if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_response(['success' => false, 'message' => 'Method tidak diizinkan.'], 405);
require_admin();
$title = article_field('title', 100);
$author = article_field('author', 100);
$lead = article_field('abstraksi', 300);
$content = article_field('content', 5000);
try {
    $stmt = $conn->prepare('INSERT INTO articles (judul, penulis, lead, content, waktu) VALUES (?, ?, ?, ?, NOW())');
    $stmt->bind_param('ssss', $title, $author, $lead, $content);
    $stmt->execute();
    json_response(['success' => true, 'message' => 'Artikel berhasil ditambahkan.']);
} catch (mysqli_sql_exception $error) {
    error_log($error->getMessage());
    json_response(['success' => false, 'message' => 'Gagal menambah artikel.'], 500);
}
