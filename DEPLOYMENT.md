# Panduan Deploy ke aaPanel VPS (Ubuntu 2GB RAM)

Panduan lengkap deploy website BBI Web ke VPS dengan aaPanel.

## Spesifikasi VPS

- **OS:** Ubuntu 20.04 / 22.04
- **RAM:** 2GB
- **Storage:** 2GB (disarankan upgrade minimal 10GB untuk production)
- **CPU:** 2 Core

---

## Langkah 1: Setup VPS Awal

### 1.1 Update System

```bash
# Login ke VPS via SSH
ssh root@your-vps-ip

# Update system
apt update && apt upgrade -y

# Install basic tools
apt install -y curl wget git vim build-essential
```

### 1.2 Install aaPanel

```bash
# Install aaPanel (One command install)
wget -O install.sh https://www.aapanel.com/script/install-ubuntu_6.0_en.sh && sudo bash install.sh aapanel

# Setelah install selesai, akan muncul:
# - aaPanel URL: http://your-vps-ip:8888
# - Username: xxxxxxxx
# - Password: xxxxxxxx
```

**Catatan:** Simpan username dan password aaPanel dengan aman!

### 1.3 Install Software di aaPanel

Login ke aaPanel, lalu install:

1. **Nginx** (Install - Recommended)
2. **MySQL** (Skip - kita pakai SQLite saja untuk hemat resource)
3. **PHP** (Skip - tidak perlu untuk Node.js)
4. **PM2 Manager** (Install - untuk manage Node.js app)
5. **Node.js** (Install dari App Store - versi 18.x atau 20.x)

---

## Langkah 2: Upload Project ke VPS

### 2.1 Via Git (Recommended)

```bash
# Login ke VPS
ssh root@your-vps-ip

# Pindah ke directory wwwroot
cd /www/wwwroot

# Clone project (jika pakai Git)
git clone https://github.com/username/bbi-web.git

# Atau upload dari local menggunakan SCP
# Di local computer (Windows PowerShell):
scp -r D:/bbi-web root@your-vps-ip:/www/wwwroot/

# Pindah ke project directory
cd /www/wwwroot/bbi-web
```

### 2.2 Via FTP/SFTP

1. Buka FileZilla atau WinSCP
2. Connect ke VPS (SFTP with root credentials)
3. Upload folder `D:/bbi-web` ke `/www/wwwroot/bbi-web`

---

## Langkah 3: Install Dependencies

```bash
cd /www/wwwroot/bbi-web

# Install dependencies (production only)
npm install --production

# Install PM2 globally (jika belum ada dari aaPanel)
npm install -g pm2

# Cek versi
node -v
npm -v
pm2 -v
```

---

## Langkah 4: Setup Environment

```bash
# Edit .env file
vim .env

# Atau pakai nano
nano .env
```

Isi `.env` untuk production:

```env
PORT=3000
NODE_ENV=production
SESSION_SECRET=ganti-dengan-secret-key-yang-panjang-dan-random

# Admin credentials
ADMIN_EMAIL=admin@bbi.com
ADMIN_PASSWORD=ganti-password-yang-lebih-aman
```

**Tips:** Generate random secret key:
```bash
# Generate random string untuk SESSION_SECRET
openssl rand -base64 32
```

---

## Langkah 5: Start Application dengan PM2

```bash
cd /www/wwwroot/bbi-web

# Start application
pm2 start src/server.js --name bbi-web

# Cek status
pm2 status

# View logs
pm2 logs bbi-web

# Monitor
pm2 monit

# Save PM2 configuration
pm2 save

# Setup PM2 startup on boot
pm2 startup
# Copy dan jalankan command yang muncul
```

### PM2 Commands

```bash
# Restart
pm2 restart bbi-web

# Stop
pm2 stop bbi-web

# Delete
pm2 delete bbi-web

# View logs real-time
pm2 logs bbi-web --lines 100
```

---

## Langkah 6: Setup Website di aaPanel

### 6.1 Add Website

1. Login ke aaPanel
2. Go to **Website** > **Add Site**
3. Pilih:
   - **Domain:** `bbi.com` (atau domain Anda)
   - **Root Directory:** `/www/wwwroot/bbi-web/public`
   - **PHP Version:** Pure static (karena ini Node.js)
   - **Create:** Click

### 6.2 Setup Nginx Reverse Proxy

1. Di aaPanel, go to **Website** > klik **Settings** pada domain
2. Go to **Reverse Proxy** tab
3. Click **Add Reverse Proxy**

Isi konfigurasi:

| Setting | Value |
|---------|-------|
| **Proxy Name** | bbi-web |
| **Target URL** | http://127.0.0.1:3000 |
| **Send Domain** | $host |
| **Proxy Pass** | / |

4. Click **Submit**

### 6.3 Advanced Nginx Config (Optional)

Untuk static file caching, edit Nginx config:

1. Go to **Config File** tab
2. Tambahkan sebelum `location /`:

```nginx
# Static files caching
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

# Gzip compression
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
```

3. Click **Save** dan **Reload Nginx**

---

## Langkah 7: Setup SSL Certificate (HTTPS)

### 7.1 Via aaPanel (Let's Encrypt)

1. Go to **Website** > **Settings** > **SSL**
2. Pilih **Let's Encrypt**
3. Masukkan email untuk notifikasi
4. Pilih domain(s)
5. Click **Apply**

### 7.2 Force HTTPS

1. Di tab SSL, enable **Force HTTPS**
2. Atau tambahkan di Nginx config:

```nginx
# Redirect HTTP to HTTPS
if ($scheme = http) {
    return 301 https://$host$request_uri;
}
```

---

## Langkah 8: Security Hardening

### 8.1 Firewall Setup

```bash
# Install UFW (jika belum)
apt install -y ufw

# Allow SSH
ufw allow 22/tcp

# Allow HTTP/HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Allow aaPanel (optional - bisa diubah port default)
ufw allow 8888/tcp

# Enable firewall
ufw enable

# Cek status
ufw status
```

### 8.2 Change aaPanel Default Port

```bash
# Ubah port aaPanel dari 8888 ke port lain (misal 8889)
# Di aaPanel: Settings > Panel Port > 8889
```

### 8.3 Secure Database File

```bash
# Set permission database file
chmod 600 /www/wwwroot/bbi-web/data/bbi.db
chown www-data:www-data /www/wwwroot/bbi-web/data/bbi.db

# Set permission uploads directory
chmod 755 /www/wwwroot/bbi-web/public/uploads
chown www-data:www-data /www/wwwroot/bbi-web/public/uploads
```

---

## Langkah 9: Monitoring & Maintenance

### 9.1 Setup Log Rotation

```bash
# Create logrotate config
vim /etc/logrotate.d/bbi-web
```

Isi:
```
/www/wwwroot/bbi-web/logs/*.log {
    daily
    rotate 7
    compress
    missingok
    notifempty
    create 0644 www-data www-data
}
```

### 9.2 Auto Restart on Error

PM2 sudah otomatis restart app jika crash. Cek konfigurasi:

```bash
# Edit PM2 config
pm2 init
```

Edit `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'bbi-web',
    script: 'src/server.js',
    cwd: '/www/wwwroot/bbi-web',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production'
    }
  }]
};
```

### 9.3 Setup Backup Database

```bash
# Create backup script
vim /www/wwwroot/bbi-web/backup.sh
```

Isi:
```bash
#!/bin/bash
BACKUP_DIR="/www/wwwroot/bbi-web/backups"
DB_FILE="/www/wwwroot/bbi-web/data/bbi.db"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
cp $DB_FILE $BACKUP_DIR/bbi_$DATE.db

# Hapus backup lebih dari 7 hari
find $BACKUP_DIR -name "bbi_*.db" -mtime +7 -delete

echo "Backup completed: bbi_$DATE.db"
```

Jadwalkan backup tiap jam 3 pagi:
```bash
# Edit crontab
crontab -e

# Tambahkan:
0 3 * * * /www/wwwroot/bbi-web/backup.sh >> /var/log/bbi-backup.log 2>&1
```

---

## Troubleshooting

### Server tidak start

```bash
# Cek logs
pm2 logs bbi-web

# Cek port sudah dipakai atau belum
netstat -tlnp | grep 3000

# Kill process jika port stuck
kill -9 $(lsof -t -i:3000)

# Restart
pm2 restart bbi-web
```

### Database locked

```bash
# Cek process
ps aux | grep node

# Kill dan restart
pm2 delete bbi-web
pm2 start src/server.js --name bbi-web
```

### Out of Memory (2GB RAM)

```bash
# Add swap space
dd if=/dev/zero of=/swapfile bs=1M count=1024
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile

# Make swap permanent
echo '/swapfile none swap sw 0 0' >> /etc/fstab

# Cek
free -h
```

### Nginx 502 Bad Gateway

```bash
# Cek apakah app Node.js running
pm2 status

# Cek Nginx error log
tail -f /www/server/nginx/logs/error.log

# Reload Nginx
nginx -t && nginx -s reload
```

---

## Update Website

### Via Git Pull

```bash
cd /www/wwwroot/bbi-web
git pull origin main
npm install --production
pm2 restart bbi-web
```

### Via Upload

1. Upload file yang diubah ke VPS
2. Install dependencies jika ada yang baru:
   ```bash
   npm install --production
   ```
3. Restart PM2:
   ```bash
   pm2 restart bbi-web
   ```

---

## Useful Commands

```bash
# Cek resource usage
htop

# Cek disk usage
df -h

# Cek memory usage
free -h

# Cek PM2 processes
pm2 list

# Cek Nginx status
systemctl status nginx

# Restart Nginx
systemctl restart nginx

# Cek aaPanel logs
tail -f /www/server/panel/logs/error.log
```

---

## Resource Optimization Tips

Untuk VPS 2GB RAM:

1. **Gunakan SQLite** (sudah default) - hemat ~100MB RAM dibanding MySQL
2. **PM2 dengan 1 instance** - cluster mode akan memakan lebih banyak RAM
3. **Enable Nginx gzip** - mengurangi bandwidth transfer
4. **Static file caching** - mengurangi load server
5. **Swap 1GB** - mencegah OOM (Out of Memory)

---

## Domain & DNS Setup

### Jika punya domain

1. Di domain provider (GoDaddy, Namecheap, dll):
   - Add A Record: `@` pointing to VPS IP
   - Add A Record: `www` pointing to VPS IP

2. Tunggu DNS propagate (5-30 menit)

3. Setup website di aaPanel dengan domain tersebut

### Tanpa domain (IP only)

Akses langsung: `http://your-vps-ip`

**Warning:** Browser akan menampilkan warning "Not Secure" karena tidak ada SSL untuk IP.

---

## Checklist Sebelum Production

- [ ] Environment variables sudah di-set untuk production
- [ ] Password admin default sudah diganti
- [ ] SSL certificate sudah terinstall
- [ ] Firewall sudah di-setup
- [ ] Database backup sudah dijadwalkan
- [ ] PM2 startup sudah di-config
- [ ] Nginx reverse proxy sudah aktif
- [ ] Monitoring sudah aktif (pm2 monit)

---

## Kontak & Support

Jika ada masalah:
1. Cek logs: `pm2 logs bbi-web`
2. Cek Nginx error: `/www/server/nginx/logs/error.log`
3. Restart service: `pm2 restart bbi-web && systemctl restart nginx`

---

**Last Updated:** 31 Desember 2024
