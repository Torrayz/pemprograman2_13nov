<?php
require_once __DIR__ . '/koneksi.php';
try {
    $result = $conn->query('SELECT articleID, judul, penulis, lead, content, waktu FROM articles ORDER BY waktu DESC LIMIT 100');
    json_response(['success' => true, 'articles' => $result->fetch_all(MYSQLI_ASSOC)]);
} catch (mysqli_sql_exception $error) {
    error_log($error->getMessage());
    json_response(['success' => false, 'message' => 'Gagal memuat artikel.'], 500);
}
