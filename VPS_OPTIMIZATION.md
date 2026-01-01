# Panduan Optimasi VPS 2GB (aaPanel + Ubuntu)

Panduan ini berisi pengaturan khusus untuk menjalankan aplikasi BBI Web di server dengan RAM 2GB.

## 1. Optimasi Sistem

### Buat Swap File (Penting)
RAM 2GB sangat terbatas untuk menjalankan Node.js + MySQL + Nginx secara bersamaan. Swap file mencegah aplikasi crash karena "Out of Memory" (kehabisan RAM).

```bash
# Cek swap yang ada
free -h

# Buat Swap 2GB jika belum ada
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Buat permanen (agar tetap ada setelah restart)
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

## 2. Optimasi Database (MySQL)

Jika menggunakan MySQL di server yang sama, Anda HARUS membatasi penggunaan memorinya.
Edit Konfigurasi MySQL (my.cnf) di aaPanel > App Store > MySQL > Settings > Configuration.

```ini
[mysqld]
# Kurangi buffer pool (Default biasanya terlalu besar)
innodb_buffer_pool_size = 256M

# Key buffer
key_buffer_size = 16M

# Connections (Jaga agar tetap rendah)
max_connections = 50

# Performance Schema (Matikan untuk hemat ~400MB RAM)
performance_schema = OFF
```
*Restart MySQL setelah mengubah pengaturan ini.*

## 3. Optimasi Node.js / PM2

Kita menggunakan `ecosystem.config.js` untuk membatasi penggunaan memori secara ketat.

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'bbi-web',
    // ...
    instances: 1,
    max_memory_restart: '300M',
    env: {
      NODE_ENV: 'production',
      // Batasi V8 Heap untuk mencegah penggunaan RAM berlebih
      NODE_OPTIONS: '--max-old-space-size=460' 
    }
  }]
};
```

**Jalankan dengan:**
```bash
pm2 start ecosystem.config.js
```

## 4. Optimasi Gambar
Aplikasi telah diperbarui menggunakan `sharp` untuk kompresi gambar otomatis.
- Gambar diubah ukurannya maksimal lebar 1200px.
- Kualitas dikompres menjadi 80% JPEG/WebP.
Ini menghemat ruang disk secara signifikan dan mempercepat loading halaman pada koneksi lambat.

## 5. Optimasi Nginx
Aktifkan kompresi dan caching untuk mengurangi beban pada Node.js.

Di aaPanel > Website > Config:
```nginx
# Aktifkan Gzip
gzip on;
gzip_types text/plain text/css application/json application/javascript;

# Browser Caching untuk File Statis
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 7d;
    add_header Cache-Control "public, no-transform";
}
```

## Ringkasan Perubahan
1. **Kode**: Memperbaiki masalah kompatibilitas database (SQLite vs MySQL).
2. **Dependencies**: Menambahkan `sharp` untuk pemrosesan gambar.
3. **Config**: Menambahkan `ecosystem.config.js` untuk manajemen proses yang aman.
