<?php
declare(strict_types=1);
session_start(['cookie_httponly' => true, 'cookie_samesite' => 'Lax', 'use_strict_mode' => true]);
$expectedHash = getenv('NEWSHUB_ADMIN_PASSWORD_HASH') ?: '';
$error = '';
if (isset($_GET['logout'])) {
    $_SESSION = [];
    session_destroy();
    header('Location: login.php');
    exit;
}
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $password = (string)($_POST['password'] ?? '');
    if ($expectedHash === '') {
        $error = 'Login admin belum dikonfigurasi. Tetapkan NEWSHUB_ADMIN_PASSWORD_HASH pada server.';
    } elseif (!password_verify($password, $expectedHash)) {
        $error = 'Password tidak cocok.';
    } else {
        session_regenerate_id(true);
        $_SESSION['newshub_admin'] = true;
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        header('Location: ../index.html');
        exit;
    }
}
?>
<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Admin Login — NewsHub</title><link rel="stylesheet" href="../styles.css"></head><body><main class="login-shell"><form method="post" class="login-panel"><p class="login-overline">NEWSHUB · SECURE STUDIO</p><h1>Masuk sebagai admin.</h1><p>Autentikasi server diperlukan untuk mengubah atau menghapus artikel.</p><?php if ($error): ?><p class="login-error"><?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8') ?></p><?php endif; ?><label>Password admin<input type="password" name="password" required autocomplete="current-password" placeholder="Masukkan password server"></label><button type="submit" class="btn btn-primary">Masuk ke studio →</button><a href="../index.html" class="btn-back">← Kembali ke daftar artikel</a></form></main></body></html>