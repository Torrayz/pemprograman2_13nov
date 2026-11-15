<?php
declare(strict_types=1);
session_start(['cookie_httponly' => true, 'cookie_samesite' => 'Lax', 'use_strict_mode' => true]);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
echo json_encode(['authenticated' => !empty($_SESSION['newshub_admin']), 'csrfToken' => !empty($_SESSION['newshub_admin']) ? ($_SESSION['csrf_token'] ?? '') : '']);
