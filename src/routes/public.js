const express = require('express');
const router = express.Router();
const { db } = require('../config/database');

// Homepage
router.get('/', (req, res) => {
  const lang = req.lang || 'id';
  const t = res.locals.t;
  
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
        title: t.home.title,
        description: 'Bosowa Bandar Group - Company Profile',
        berita: berita || [],
        unitBisnis: unitBisnis || [],
        contactSuccess: req.query.contact === 'success'
      });
    });
  });
});

// About page
router.get('/tentang-kami', (req, res) => {
  const t = res.locals.t;
  res.render('about', {
    title: t.about.title
  });
});

router.get('/about-us', (req, res) => {
  const t = res.locals.t;
  res.render('about', {
    title: t.about.title
  });
});

// Vision & Mission
router.get('/visi-misi', (req, res) => {
  const t = res.locals.t;
  res.render('visi-misi', {
    title: t.visionMission.title
  });
});

router.get('/vision-mission', (req, res) => {
  const t = res.locals.t;
  res.render('visi-misi', {
    title: t.visionMission.title
  });
});

// Contact form handler
router.post('/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  const lang = req.lang || 'id';

  // Insert message
  db.run(
    'INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
    [name, email, subject, message],
    (err) => {
      if (err) {
        console.error('Error sending message:', err);
      }
      // Redirect back to home with success flag
      res.redirect(`/${lang}?contact=success`);
    }
  );
});

module.exports = router;
