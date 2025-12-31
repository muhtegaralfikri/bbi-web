const express = require('express');
const router = express.Router();
const { db } = require('../config/database');

// API: Get all berita
router.get('/berita', (req, res) => {
  const berita = db.prepare('SELECT * FROM berita WHERE published = 1 ORDER BY created_at DESC').all();
  res.json(berita);
});

// API: Get single berita
router.get('/berita/:slug', (req, res) => {
  const berita = db.prepare('SELECT * FROM berita WHERE slug = ? AND published = 1').get(req.params.slug);
  if (!berita) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.json(berita);
});

// API: Get all cabang
router.get('/cabang', (req, res) => {
  const cabang = db.prepare('SELECT * FROM cabang ORDER BY name ASC').all();
  res.json(cabang);
});

// API: Get all unit bisnis
router.get('/unit-bisnis', (req, res) => {
  const unitBisnis = db.prepare('SELECT * FROM unit_bisnis ORDER BY order_num ASC').all();
  res.json(unitBisnis);
});

module.exports = router;
