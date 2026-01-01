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
      SELECT id, title, title_en, slug, summary, summary_en, image, category, created_at FROM berita
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

// Detail Berita (Public)
router.get('/:slug', (req, res) => {
  const slug = req.params.slug;
  db.get('SELECT * FROM berita WHERE slug = ? AND published = 1', [slug], (err, berita) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database Error');
    }
    if (!berita) {
      return res.status(404).render('404', { title: 'Berita Tidak Ditemukan' });
    }
    
    // Fetch approved comments
    db.all('SELECT * FROM comments WHERE berita_id = ? AND approved = 1 ORDER BY created_at DESC', [berita.id], (err, comments) => {
       if (err) comments = [];
       res.render('berita/detail', { 
         title: berita.title, 
         berita,
         comments: comments
       });
    });
  });
});

// Post Comment Route
router.post('/:id/comment', (req, res) => {
  const beritaId = req.params.id;
  const { name, email, content } = req.body;
  
  // Simple validation
  if (!name || !email || !content) {
     return res.redirect('back');
  }

  db.run('INSERT INTO comments (berita_id, name, email, content, approved) VALUES (?, ?, ?, ?, 0)', 
    [beritaId, name, email, content], 
    (err) => {
      if (err) console.error(err);
      
      // Fetch slug to redirect properly
      db.get('SELECT slug FROM berita WHERE id = ?', [beritaId], (err, row) => {
        if (!err && row) {
           // Redirect to specific article with correct lang prefix
           const isEnglish = req.headers.referer && req.headers.referer.includes('/en/');
           const prefix = isEnglish ? '/en/news/' : '/id/berita/';
           res.redirect(prefix + row.slug + '?comment_submitted=true');
        } else {
           // Fallback if db error
           res.redirect('back');
        }
      });
    }
  );
});

module.exports = router;
