# BBI Web - Company Profile

Website company profile Bosowa Bandar Group yang ringan dan cepat menggunakan Express.js + EJS + SQLite.

## Fitur

- **Frontend Publik:**
  - Home page dengan hero, unit bisnis, berita terbaru
  - Halaman About (Visi & Misi)
  - Halaman Unit Bisnis
  - Halaman Berita/Artikel dengan pagination
  - Halaman Info Cabang
  - Form Kontak

- **Admin Panel:**
  - Dashboard dengan statistik
  - Manajemen Berita (CRUD)
  - Manajemen Cabang (CRUD)
  - Manajemen Unit Bisnis (CRUD)
  - Manajemen Pesan dari form kontak
  - Pengaturan website

## Teknologi

- **Backend:** Express.js
- **Frontend:** EJS (Server-Side Rendering)
- **Database:** SQLite (better-sqlite3)
- **Upload:** Multer
- **Session:** express-session
- **Authentication:** bcryptjs

## Instalasi

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

## Default Admin

- **URL:** http://localhost:3000/admin
- **Email:** admin@bbi.com
- **Password:** admin123

**PENTING:** Ubah password default setelah login pertama!

## Struktur Folder

```
bbi-web/
├── src/
│   ├── config/
│   │   └── database.js       # Database config & init
│   ├── views/
│   │   ├── partials/         # Reusable components
│   │   ├── admin/            # Admin panel views
│   │   ├── berita/           # Berita views
│   │   ├── cabang/           # Cabang views
│   │   └── unit-bisnis/      # Unit bisnis views
│   ├── routes/
│   │   ├── admin/            # Admin routes
│   │   ├── public.js         # Public routes
│   │   ├── berita.js         # Berita routes
│   │   ├── cabang.js         # Cabang routes
│   │   ├── unit-bisnis.js    # Unit bisnis routes
│   │   ├── messages.js       # Messages routes
│   │   ├── settings.js       # Settings routes
│   │   └── api.js            # API routes
│   └── server.js             # Main server file
├── public/
│   ├── css/
│   │   ├── style.css         # Frontend styles
│   │   └── admin.css         # Admin styles
│   ├── js/
│   │   └── main.js           # Frontend scripts
│   ├── images/               # Static images
│   └── uploads/              # Uploaded files
├── data/
│   └── bbi.db                # SQLite database
├── .env                      # Environment variables
├── .env.example              # Environment example
└── package.json
```

## Deploy ke aaPanel (Ubuntu VPS)

### 1. Upload Files

Upload semua file ke VPS menggunakan FTP atau Git:

```bash
git clone <repo-url> /www/wwwroot/bbi-web
cd /www/wwwroot/bbi-web
```

### 2. Install Dependencies

```bash
npm install --production
```

### 3. Setup PM2

```bash
# Install PM2 globally (jika belum)
npm install -g pm2

# Start aplikasi
pm2 start src/server.js --name bbi-web

# Save PM2 config
pm2 save

# Setup PM2 startup
pm2 startup
```

### 4. Setup Nginx Reverse Proxy

Di aaPanel, buat website baru dan tambahkan konfigurasi Nginx:

```nginx
location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_cache_bypass $http_upgrade;
}

# Static files
location /css/ {
    alias /www/wwwroot/bbi-web/public/css/;
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location /js/ {
    alias /www/wwwroot/bbi-web/public/js/;
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location /images/ {
    alias /www/wwwroot/bbi-web/public/images/;
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location /uploads/ {
    alias /www/wwwroot/bbi-web/public/uploads/;
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 5. Commands PM2

```bash
# Restart aplikasi
pm2 restart bbi-web

# Stop aplikasi
pm2 stop bbi-web

# View logs
pm2 logs bbi-web

# Monitor
pm2 monit
```

## Environment Variables

Edit `.env` file:

```env
PORT=3000
NODE_ENV=production
SESSION_SECRET=your-secret-key-change-this

# Admin credentials
ADMIN_EMAIL=admin@bbi.com
ADMIN_PASSWORD=admin123
```

## Resource Usage

Dengan Express + EJS + SQLite:
- **RAM:** ~50-100 MB (vs Next.js + NestJS ~300-500MB)
- **Storage:** ~100 MB (vs Next.js ~500MB+)
- **Startup time:** ~1-2 detik

## License

ISC
