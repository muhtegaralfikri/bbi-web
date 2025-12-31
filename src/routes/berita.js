const express = require('express');
const router = express.Router();
const { db } = require('../config/database');

router.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 9;
  const offset = (page - 1) * limit;

  // Get total count
  const total = db.prepare('SELECT COUNT(*) as count FROM berita WHERE published = 1').get();
  const totalPages = Math.ceil(total.count / limit);

  // Get berita
  const berita = db.prepare(`
    SELECT * FROM berita
    WHERE published = 1
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `).all(limit, offset);

  res.render('berita/index', {
    title: 'Berita & Artikel',
    berita,
    pagination: {
      page,
      totalPages,
      total: total.count
    }
  });
});

router.get('/:slug', (req, res) => {
  const berita = db.prepare('SELECT * FROM berita WHERE slug = ? AND published = 1').get(req.params.slug);

  if (!berita) {
    return res.status(404).render('error', {
      title: '404 - Berita Tidak Ditemukan',
      message: 'Berita yang Anda cari tidak ditemukan.'
    });
  }

  res.render('berita/detail', {
    title: berita.title,
    berita
  });
});

module.exports = router;
