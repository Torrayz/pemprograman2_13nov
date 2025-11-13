<?php
include "koneksi.php";

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = escape_string($_POST['title'] ?? '');
    $author = escape_string($_POST['author'] ?? '');
    $lead = escape_string($_POST['abstraksi'] ?? '');
    $content = escape_string($_POST['content'] ?? '');
    $time = date("Y-m-d H:i:s");

    // Validation
    if (empty($title) || empty($author) || empty($lead) || empty($content)) {
        echo json_encode(['success' => false, 'message' => 'Semua field harus diisi']);
        exit;
    }

    if (strlen($title) > 100 || strlen($lead) > 300 || strlen($content) > 5000) {
        echo json_encode(['success' => false, 'message' => 'Konten melebihi batas maksimal']);
        exit;
    }

    $query = "INSERT INTO articles (judul, penulis, lead, content, waktu) VALUES ('$title', '$author', '$lead', '$content', '$time')";

    if (mysqli_query($conn, $query)) {
        echo json_encode(['success' => true, 'message' => 'Artikel berhasil ditambahkan']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error: ' . mysqli_error($conn)]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Method tidak diizinkan']);
}

mysqli_close($conn);
?>
