require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const { initDatabase } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database
initDatabase();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Public routes
app.use('/', require('./routes/public'));
app.use('/berita', require('./routes/berita'));
app.use('/unit-bisnis', require('./routes/unit-bisnis'));
app.use('/cabang', require('./routes/cabang'));

// Admin routes
const { router: adminRouter } = require('./routes/admin');
app.use('/admin', adminRouter);
app.use('/admin/berita', require('./routes/admin/berita'));
app.use('/admin/cabang', require('./routes/admin/cabang'));
app.use('/admin/unit-bisnis', require('./routes/admin/unit-bisnis'));
app.use('/admin/settings', require('./routes/admin/settings'));
app.use('/admin/messages', require('./routes/admin/messages'));

// API routes
app.use('/api', require('./routes/api'));

// 404 handler
app.use((req, res) => {
  res.status(404).render('error', {
    title: '404 - Halaman Tidak Ditemukan',
    message: 'Halaman yang Anda cari tidak ditemukan.'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', {
    title: '500 - Server Error',
    message: 'Terjadi kesalahan pada server.'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Admin: http://localhost:${PORT}/admin`);
});
