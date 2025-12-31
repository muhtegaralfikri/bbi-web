const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { db } = require('../../config/database');
const { isAuthenticated } = require('../admin');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'berita-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Hanya file gambar yang diperbolehkan'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Generate slug
const generateSlug = (text) => {
  return text.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// List all berita
router.get('/', isAuthenticated, (req, res) => {
  const berita = db.prepare('SELECT * FROM berita ORDER BY created_at DESC').all();
  res.render('admin/berita/index', {
    user: req.session.user,
    berita,
    active: 'berita'
  });
});

// Create form
router.get('/create', isAuthenticated, (req, res) => {
  res.render('admin/berita/form', {
    user: req.session.user,
    active: 'berita'
  });
});

// Store new berita
router.post('/', isAuthenticated, upload.single('image'), (req, res) => {
  const { title, content, category, published } = req.body;
  const slug = generateSlug(title);

  db.prepare(`
    INSERT INTO berita (title, slug, content, image, category, published)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(title, slug, content, req.file ? '/uploads/' + req.file.filename : null, category, published ? 1 : 0);

  res.redirect('/admin/berita');
});

// Edit form
router.get('/:id/edit', isAuthenticated, (req, res) => {
  const berita = db.prepare('SELECT * FROM berita WHERE id = ?').get(req.params.id);
  res.render('admin/berita/form', {
    user: req.session.user,
    berita,
    active: 'berita'
  });
});

// Update berita
router.post('/:id', isAuthenticated, upload.single('image'), (req, res) => {
  const { title, content, category, published } = req.body;
  const slug = generateSlug(title);

  let query = 'UPDATE berita SET title = ?, slug = ?, content = ?, category = ?, published = ?, updated_at = CURRENT_TIMESTAMP';
  let params = [title, slug, content, category, published ? 1 : 0];

  if (req.file) {
    query += ', image = ?';
    params.push('/uploads/' + req.file.filename);
  }

  query += ' WHERE id = ?';
  params.push(req.params.id);

  db.prepare(query).run(...params);
  res.redirect('/admin/berita');
});

// Delete berita
router.post('/:id/delete', isAuthenticated, (req, res) => {
  db.prepare('DELETE FROM berita WHERE id = ?').run(req.params.id);
  res.redirect('/admin/berita');
});

module.exports = router;
