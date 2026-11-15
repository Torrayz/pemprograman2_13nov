# NewsHub — Article Management Studio

A modernized article-management project built from the original PHP/MySQL coursework.

## Features
- Public article listing and search-ready content cards
- Admin-only create, edit, and delete operations
- Prepared SQL statements for article writes/lookup
- Request validation, CSRF token checks, and password-hash based server login
- Responsive dark editorial layout

## Requirements
PHP 8.1+ with `mysqli` and `mbstring`, MySQL 8+, and a local PHP-capable server. **Vercel static hosting alone does not execute this PHP application.**

## Configure

Import `setup/create_database.sql` into a dedicated local MySQL instance. Set these environment variables in the PHP server:

```text
DB_HOST=127.0.0.1
DB_NAME=artikel_db
DB_USER=newshub_user
DB_PASSWORD=<private password>
NEWSHUB_ADMIN_PASSWORD_HASH=<password_hash output>
```

Generate the admin hash on your own machine:

```bash
php -r 'echo password_hash(readline("Admin password: "), PASSWORD_DEFAULT), PHP_EOL;'
```

Set `NEWSHUB_ADMIN_PASSWORD_HASH` to the output. Do **not** commit the hash or database credentials. Start a local server with `php -S localhost:8000` from the repository root.

Open `process/login.php` to authenticate. Public readers can browse `index.html`; creation, editing, and deletion require an authenticated admin session and CSRF token.

## Important
This is an educational prototype, not a multi-user newsroom. Add HTTPS, access logging, rate limiting, role management, backups and deployment QA before production use. No public admin credentials are bundled.

## Author
Tri Puji Antoro · 221011402646
