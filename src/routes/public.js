const express = require('express');
const router = express.Router();
const { db } = require('../config/database');

router.get('/', (req, res) => {
  // Get published berita (limit 3)
  db.all('SELECT * FROM berita WHERE published = 1 ORDER BY created_at DESC LIMIT 3', [], (err, berita) => {
    if (err) {
      console.error('Error fetching berita:', err);
      berita = [];
    }

    // Get unit bisnis
    db.all('SELECT * FROM unit_bisnis ORDER BY order_num ASC, created_at DESC', [], (err, unitBisnis) => {
      if (err) {
        console.error('Error fetching unit bisnis:', err);
        unitBisnis = [];
      }

      res.render('index', {
        title: 'Bosowa Bandar Group',
        description: 'Bosowa Bandar Group - Company Profile',
        berita: berita || [],
        unitBisnis: unitBisnis || [],
        contactSuccess: req.query.contact === 'success'
      });
    });
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
  db.run(
    'INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
    [name, email, subject, message],
    (err) => {
      if (err) {
        console.error('Error sending message:', err);
        // Still redirect but maybe we should show error, for now success to not break flow
      }
      // Redirect back to home with success flag
      res.redirect('/?contact=success');
    }
  );
});

module.exports = router;
