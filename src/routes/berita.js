const express = require('express');
const router = express.Router();
const { db } = require('../config/database');

router.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
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

    // MySQL returns array, SQLite returns object - handle both
    let total = 0;
    if (Array.isArray(row) && row.length > 0) {
      total = row[0].count || row[0]['COUNT(*)'] || 0;
    } else if (row && row.count !== undefined) {
      total = row.count;
    }
    const totalPages = Math.ceil(total / limit);
    console.log('=== BERITA PAGINATION DEBUG ===');
    console.log('Total berita published:', total);
    console.log('Total pages:', totalPages);

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
  const commentPage = parseInt(req.query.comment_page) || 1;
  const commentLimit = 5;
  const commentOffset = (commentPage - 1) * commentLimit;
  
  db.get('SELECT * FROM berita WHERE slug = ? AND published = 1', [slug], (err, beritaResult) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database Error');
    }
    
    // Handle MySQL array result
    const berita = Array.isArray(beritaResult) ? beritaResult[0] : beritaResult;
    
    if (!berita) {
      return res.status(404).render('404', { title: 'Berita Tidak Ditemukan' });
    }
    
    // Get total comments count
    db.get('SELECT COUNT(*) as count FROM comments WHERE berita_id = ? AND approved = 1', [berita.id], (err, countResult) => {
      // Handle MySQL array result
      let totalComments = 0;
      if (Array.isArray(countResult) && countResult.length > 0) {
        totalComments = countResult[0].count || 0;
      } else if (countResult && countResult.count !== undefined) {
        totalComments = countResult.count;
      }
      const totalCommentPages = Math.ceil(totalComments / commentLimit);
      
      // Fetch paginated approved comments
      db.all('SELECT * FROM comments WHERE berita_id = ? AND approved = 1 ORDER BY created_at DESC LIMIT ? OFFSET ?', 
        [berita.id, commentLimit, commentOffset], (err, comments) => {
         if (err) comments = [];
         res.render('berita/detail', { 
           title: berita.title, 
           berita,
           comments: comments || [],
           commentPagination: {
             page: commentPage,
             totalPages: totalCommentPages,
             total: totalComments
           }
         });
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
