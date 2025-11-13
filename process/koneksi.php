<?php
// Database Connection
$servername = "localhost";
$username = "root";
$password = ""; 
$dbname = "artikel_db"; 

// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);

// Check connection
if (!$conn) {
    die(json_encode(['success' => false, 'message' => 'Koneksi database gagal: ' . mysqli_connect_error()]));
}


mysqli_set_charset($conn, "utf8");


function escape_string($string) {
    global $conn;
    return mysqli_real_escape_string($conn, $string);
}
?>
