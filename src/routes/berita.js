const express = require('express');
const router = express.Router();
const { db } = require('../config/database');

router.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 9;
  const offset = (page - 1) * limit;

  // Get total count
  db.get('SELECT COUNT(*) as count FROM berita WHERE published = 1', (err, row) => {
    if (err) {
      console.error(err);
      return res.render('berita/index', {
        title: 'Berita & Artikel',
        berita: [],
        pagination: null
      });
    }

    const total = row ? row.count : 0;
    const totalPages = Math.ceil(total / limit);

    // Get berita
    db.all(`
      SELECT * FROM berita
      WHERE published = 1
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `, [limit, offset], (err, rows) => {
      if (err) {
        console.error(err);
        return res.render('berita/index', {
          title: 'Berita & Artikel',
          berita: [],
          pagination: null
        });
      }

      res.render('berita/index', {
        title: 'Berita & Artikel',
        berita: rows,
        pagination: {
          page,
          totalPages,
          total
        }
      });
    });
  });
});

router.get('/:slug', (req, res) => {
  db.get('SELECT * FROM berita WHERE slug = ? AND published = 1', [req.params.slug], (err, berita) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

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
});

module.exports = router;
