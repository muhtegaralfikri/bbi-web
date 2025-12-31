const express = require('express');
const router = express.Router();
const { db } = require('../config/database');

router.get('/', (req, res) => {
  const unitBisnis = db.prepare('SELECT * FROM unit_bisnis ORDER BY order_num ASC, created_at DESC').all();

  res.render('unit-bisnis/index', {
    title: 'Unit Bisnis',
    unitBisnis
  });
});

// PT Bosowa Bandar Indonesia
router.get('/bosowa-bandar-indonesia', (req, res) => {
  res.render('unit-bisnis/bosowa-bandar-indonesia', {
    title: 'PT Bosowa Bandar Indonesia',
    description: 'PT Bosowa Bandar Indonesia - Unit Bisnis'
  });
});

// PT Bosowa Bandar Agensi
router.get('/bosowa-bandar-agensi', (req, res) => {
  res.render('unit-bisnis/bosowa-bandar-agensi', {
    title: 'PT Bosowa Bandar Agensi',
    description: 'PT Bosowa Bandar Agensi - Unit Bisnis'
  });
});

// PT Jasa Pelabuhan Indonesia
router.get('/jasa-pelabuhan-indonesia', (req, res) => {
  res.render('unit-bisnis/jasa-pelabuhan-indonesia', {
    title: 'PT Jasa Pelabuhan Indonesia',
    description: 'PT Jasa Pelabuhan Indonesia - Unit Bisnis'
  });
});

module.exports = router;
