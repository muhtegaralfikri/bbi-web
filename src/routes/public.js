const express = require('express');
const router = express.Router();
const { db } = require('../config/database');

router.get('/', (req, res) => {
  // Get published berita (limit 3)
  const berita = db.prepare(`
    SELECT * FROM berita
    WHERE published = 1
    ORDER BY created_at DESC
    LIMIT 3
  `).all();

  // Get unit bisnis
  const unitBisnis = db.prepare(`
    SELECT * FROM unit_bisnis
    ORDER BY order_num ASC, created_at DESC
  `).all();

  res.render('index', {
    title: 'Bosowa Bandar Group',
    description: 'Bosowa Bandar Group - Company Profile',
    berita,
    unitBisnis,
    contactSuccess: req.query.contact === 'success'
  });
});

router.get('/about', (req, res) => {
  res.render('about', {
    title: 'Tentang Kami'
  });
});

router.get('/visi-misi', (req, res) => {
  res.render('visi-misi', {
    title: 'Visi & Misi'
  });
});

router.post('/contact', (req, res) => {
  const { name, email, subject, message } = req.body;

  // Insert message
  db.prepare(`
    INSERT INTO messages (name, email, subject, message)
    VALUES (?, ?, ?, ?)
  `).run(name, email, subject, message);

  // Redirect back to home with success flag
  res.redirect('/?contact=success');
});

module.exports = router;
