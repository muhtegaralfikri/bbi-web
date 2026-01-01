require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const { initDatabase, pool } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database
initDatabase();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Settings middleware
app.use(require('./middleware/settings'));

const MySQLStore = require('express-mysql-session')(session);

// Session middleware
const sessionStore = new MySQLStore(
  {
    clearExpired: true,
    checkExpirationInterval: 15 * 60 * 1000, // 15 minutes
    expiration: 7 * 24 * 60 * 60 * 1000, // 1 week
    createDatabaseTable: true
  },
  pool
);

app.use(session({
  store: sessionStore,
  secret: process.env.SESSION_SECRET || 'secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week
  }
}));

// Make user data available to all views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Admin routes FIRST (no language prefix - Indonesian only)
// Must be before /:lang routes to prevent conflict
const { router: adminRouter } = require('./routes/admin');
app.use('/admin', adminRouter);
app.use('/admin/berita', require('./routes/admin/berita'));
app.use('/admin/cabang', require('./routes/admin/cabang'));
app.use('/admin/unit-bisnis', require('./routes/admin/unit-bisnis'));
app.use('/admin/settings', require('./routes/admin/settings'));
app.use('/admin/messages', require('./routes/admin/messages'));

// API routes
app.use('/api', require('./routes/api'));

// Language middleware
const { languageMiddleware, redirectToDefaultLanguage } = require('./middleware/languageMiddleware');

// Redirect root to default language (Indonesian)
app.get('/', redirectToDefaultLanguage);

// Public routes with language prefix
app.use('/:lang', languageMiddleware, require('./routes/public'));
app.use('/:lang/berita', languageMiddleware, require('./routes/berita'));
app.use('/:lang/news', languageMiddleware, require('./routes/berita')); // English alias
app.use('/:lang/unit-bisnis', languageMiddleware, require('./routes/unit-bisnis'));
app.use('/:lang/business-units', languageMiddleware, require('./routes/unit-bisnis')); // English alias
app.use('/:lang/cabang', languageMiddleware, require('./routes/cabang'));
app.use('/:lang/branches', languageMiddleware, require('./routes/cabang')); // English alias

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
