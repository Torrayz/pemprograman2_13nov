<?php
include "koneksi.php";

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $articleID = escape_string($_POST['articleID'] ?? '');
    $title = escape_string($_POST['title'] ?? '');
    $author = escape_string($_POST['author'] ?? '');
    $lead = escape_string($_POST['abstraksi'] ?? '');
    $content = escape_string($_POST['content'] ?? '');
    $time = date("Y-m-d H:i:s");

    // Validation
    if (empty($articleID) || empty($title) || empty($author) || empty($lead) || empty($content)) {
        echo json_encode(['success' => false, 'message' => 'Semua field harus diisi']);
        exit;
    }

    $query = "UPDATE articles SET judul='$title', penulis='$author', lead='$lead', content='$content', waktu='$time' WHERE articleID='$articleID'";

    if (mysqli_query($conn, $query)) {
        echo json_encode(['success' => true, 'message' => 'Artikel berhasil diperbarui']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error: ' . mysqli_error($conn)]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Method tidak diizinkan']);
}

mysqli_close($conn);
?>
