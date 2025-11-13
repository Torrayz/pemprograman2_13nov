<?php
include "koneksi.php";

header('Content-Type: application/json');

$query = "SELECT articleID, judul, penulis, lead, content, waktu FROM articles ORDER BY articleID DESC";
$result = mysqli_query($conn, $query);

$articles = [];
if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $articles[] = $row;
    }
}

echo json_encode(['success' => true, 'articles' => $articles]);
mysqli_close($conn);
?>
