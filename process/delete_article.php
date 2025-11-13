<?php
include "koneksi.php";

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $articleID = escape_string($data['articleID'] ?? '');

    // Validation
    if (empty($articleID)) {
        echo json_encode(['success' => false, 'message' => 'ID artikel tidak diberikan']);
        exit;
    }

    $query = "DELETE FROM articles WHERE articleID='$articleID'";

    if (mysqli_query($conn, $query)) {
        echo json_encode(['success' => true, 'message' => 'Artikel berhasil dihapus']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error: ' . mysqli_error($conn)]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Method tidak diizinkan']);
}

mysqli_close($conn);
?>
