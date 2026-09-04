# Restaurant QR Menu Management System

A focused QR-menu platform with two experiences sharing one codebase:

- **`/`** — the public QR menu customers see after scanning the table QR code: a dark
  branded header, a photo-first category grid, and a product list per category. Fast,
  mobile-first, no scroll-hijacking or marketing sections.
- **`/admin/`** — the restaurant owner's admin panel: login, categories (with images),
  products, availability, restaurant settings, QR code download.

`/menu/` still works — it's a lightweight redirect to `/` for QR codes printed before
the canonical URL moved, so nothing already in circulation breaks.

Backend is plain PHP (no framework) talking to MySQL/MariaDB over PDO, built for
standard Apache/cPanel shared hosting — no Node.js runtime required in production.

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite 6, Tailwind CSS v4 |
| Backend | PHP 8.2+ (vanilla, no framework, no Composer dependency) |
| Database | MySQL 8+ / MariaDB, PDO + prepared statements |
| Auth | PHP sessions, `password_hash`/`password_verify`, CSRF tokens |
| QR generation | `qrcode` (client-side, admin bundle only) |

## Project layout

```
index.html            public QR menu entry    → src/menu/main.jsx
menu/index.html        legacy URL, redirects to /
admin/index.html       admin panel entry       → src/admin/main.jsx
src/
  menu/                     public QR menu SPA (mobile-first, no router needed)
    hooks/useMenuData.js      fetches /api/public/menu
    hooks/useCategoryRoute.js manages ?category=<slug> via pushState, no server rewrite
    components/               MenuHero, CategoryGrid/Card, CategoryDetail, ProductRow,
                               ContactSection, MenuFooter, StatusStates, icons
  admin/                    admin SPA (hash-based routing, no server rewrite needed)
  shared/                   code shared between menu/admin (e.g. price formatting)
api/
  index.php          front controller — parses the route, dispatches, handles errors
  routes.php         route table (method, path, controller, auth/CSRF requirements)
  config/            env loader + config array
  database/          schema.sql, seed.sql, connection.php, migrate/seed/create_admin CLI scripts
  controllers/ services/ repositories/   thin layers: request → business logic → SQL
  middleware/        auth check, CSRF check, login rate limiting
  helpers/           JSON responses, validation, uploads, CSRF/slug helpers
uploads/
  products/, categories/, logo/   user-uploaded images (gitignored; .htaccess blocks
                                   script execution)
```

Vite builds `index.html`, `menu/index.html` and `admin/index.html` as separate bundles
(`dist/index.html`, `dist/menu/index.html`, `dist/admin/index.html`), so `/menu/` and
`/admin/` are plain static folders in production — no Apache rewrite rules needed for
routing between the apps. `dist/menu/index.html` ships no JS bundle of its own — it's a
static redirect to `/`, so the menu app is never shipped twice. Category navigation on
the public menu (`/?category=<slug>`) lives in the query string of the same static
`index.html`, so a refresh or direct link never needs server-side rewrite support
either. The admin SPA uses a hash router (`/admin/#/products`) for the same reason.

## Requirements

- Node.js 18+ (build tooling only — never required at runtime in production)
- PHP 8.2+ with `pdo_mysql`, `fileinfo`, `gd` (GD is optional; only used if you extend
  server-side image processing — uploads are validated without it)
- MySQL 8+ or MariaDB 10.4+
- Apache with `mod_rewrite` and `.htaccess` support for production (a `route=` query
  fallback exists for hosts without rewrite — see `api/.htaccess`)

## Local development

### 1. Install frontend dependencies

```bash
npm install
```

### 2. Create the database

```sql
CREATE DATABASE qr_menu_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'qr_menu_dev'@'localhost' IDENTIFIED BY 'choose_a_password';
GRANT ALL PRIVILEGES ON qr_menu_dev.* TO 'qr_menu_dev'@'localhost';
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your local DB credentials. `.env` is gitignored — never commit it.

### 4. Run migrations, seed data, create an admin

```bash
php api/database/migrate.php
php api/database/seed.php               # optional: generic demo categories/products
php api/database/create_admin.php <username> <password> "Full Name"
```

`migrate.php` is safe to re-run on a database that already has data — the schema uses
`CREATE TABLE IF NOT EXISTS` plus additive `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`
statements for columns introduced after the initial release (category images; the
extra restaurant settings fields), so upgrading an existing installation never touches
existing rows.

`create_admin.php` is safe to re-run — it updates the password if the username already
exists. There is no hardcoded default admin anywhere in the codebase; you must run this
script once to be able to log in.

### 5. Run both servers

```bash
# Terminal 1 — PHP API
php -S localhost:8000 api/index.php

# Terminal 2 — frontend
npm run dev
```

Vite's dev server proxies `/api/*` and `/uploads/*` to `http://localhost:8000`, so the
frontend calls the same relative paths (`/api/...`) in dev and in production — no API
base URL to configure or hardcode.

Open:

- `http://localhost:5173/` — the QR menu
- `http://localhost:5173/admin/` — admin panel (log in with the account you created)

## Building for production

```bash
npm run build
```

Output goes to `dist/`:

```
dist/index.html          dist/menu/index.html      dist/admin/index.html
dist/assets/...           (hashed JS/CSS, code-split per entry)
dist/.htaccess            (copied from public/.htaccess — blocks .env, dotfiles, sets security headers)
```

## Production deployment (Apache / cPanel shared hosting)

1. **Build locally**: `npm run build` (Node is only needed on your machine/CI, not on
   the host).
2. **Upload to the host's document root** (e.g. `public_html/`):
   - the contents of `dist/`
   - the `api/` folder
   - the `uploads/` folder (create `uploads/products/`, `uploads/categories/` and
     `uploads/logo/` with write permissions if they don't exist; keep `uploads/.htaccess`)
3. **Place `.env`** at the same level as `api/` (i.e. document root). It is never web-
   reachable — `public/.htaccess` (copied to `dist/.htaccess`) denies all dotfiles, and
   `api/.htaccess` denies direct access to every PHP file except `index.php`.
4. **Create the production database** and run, once, over SSH or a one-off script:
   ```bash
   php api/database/migrate.php
   php api/database/create_admin.php <username> <strong-password> "Full Name"
   ```
   (Seed data is optional and meant for local development — skip it in production
   unless you want the generic demo categories.)

   **Upgrading an existing installation** (one that already has the old schema without
   category images / the new settings fields): just run `php api/database/migrate.php`
   again — the additive `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` statements bring it
   up to date without touching existing categories, products or settings.
5. **Verify `mod_rewrite`** is enabled so `api/.htaccess` can route clean URLs like
   `/api/public/menu` to `api/index.php`. If a host disables `.htaccess` rewriting,
   the API still works via the query-string fallback baked into `api/index.php`:
   `/api/index.php?route=public/menu`.
6. **HTTPS**: strongly recommended. The session cookie is automatically marked
   `Secure` when the request is detected as HTTPS (`$_SERVER['HTTPS']` or
   `X-Forwarded-Proto`), and `SameSite=Lax` + `HttpOnly` always.
7. Visit `https://yourdomain.com/admin/` and log in, then `https://yourdomain.com/` to
   see the live QR menu. Point new QR codes at `https://yourdomain.com/` (the admin QR
   page already generates this URL) — `/menu/` keeps working for any codes already
   printed.

The frontend never hardcodes a domain or API base URL — everything is same-origin
relative paths, so the same build works on any domain.

## Environment variables

See `.env.example` for the full list with comments. Key ones:

| Variable | Purpose |
| --- | --- |
| `APP_DEBUG` | `true` includes exception detail in API error responses — always `false` in production |
| `DB_*` | Database connection |
| `SESSION_NAME`, `SESSION_LIFETIME` | Admin session cookie |
| `LOGIN_MAX_ATTEMPTS`, `LOGIN_WINDOW_MINUTES` | Login brute-force throttling |
| `UPLOADS_URL`, `UPLOADS_PATH`, `UPLOAD_MAX_BYTES` | Where uploaded images are stored/served and the max size allowed |
| `CORS_ALLOWED_ORIGIN` | Only needed if the frontend is ever served from a different origin than the API — leave empty for same-origin (the default and recommended setup) |

## Image uploads

- Accepted: JPEG, PNG, WEBP — verified server-side by real file content (`finfo` MIME
  sniffing + `getimagesize`), never by filename extension alone.
- Stored under a random 32-hex-char filename; the original filename is discarded.
- Size limit enforced server-side (`UPLOAD_MAX_BYTES`, default 5MB).
- The admin UI resizes/re-encodes images to WEBP client-side (max ~1600px long edge)
  before upload to keep payloads small — this is a convenience, not a security
  boundary; the backend validates independently regardless of what the browser sends.
- `uploads/.htaccess` disables script execution in that folder as defense in depth.
- Three subfolders: `products/`, `categories/`, `logo/`.

## Security notes

- **Auth**: PHP native sessions, `password_hash`/`password_verify`, session ID
  regenerated on login, `HttpOnly` + `SameSite=Lax` (+ `Secure` over HTTPS) cookies.
- **CSRF**: a per-session token (`GET /api/csrf-token`, also returned by login) must be
  sent as `X-CSRF-Token` on every admin mutation (POST/PUT/DELETE). Public/read-only
  endpoints don't require it.
- **Rate limiting**: failed logins are throttled per IP (`login_attempts` table);
  defaults to 5 attempts / 15 minutes.
- **SQL**: 100% PDO prepared statements, no string-concatenated queries.
- **File uploads**: see above.
- **Error handling**: with `APP_DEBUG=false`, API errors return a generic message;
  details are written to the PHP error log, never to the client.
- **Data integrity**: deleting a category with products attached is rejected (409) —
  reassign or delete the products first, or deactivate the category instead.

## Out of scope (by design, YAGNI)

Online ordering, payments, table-side ordering, reservations, waiter calling,
inventory management, multi-branch/multi-tenant support, POS integration, kitchen
displays, and customer accounts are intentionally not implemented. The architecture
(clean category/product/settings separation, a documented API, a real auth layer)
doesn't preclude adding them later, but none of it was built speculatively.
