<?php
include "koneksi.php";

header('Content-Type: application/json');

if (isset($_GET['id'])) {
    $articleID = escape_string($_GET['id']);
    $query = "SELECT * FROM articles WHERE articleID = '$articleID'";
    $result = mysqli_query($conn, $query);

    if (mysqli_num_rows($result) > 0) {
        $article = mysqli_fetch_assoc($result);
        echo json_encode(['success' => true, 'article' => $article]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Artikel tidak ditemukan']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'ID artikel tidak diberikan']);
}

mysqli_close($conn);
?>
