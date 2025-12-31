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

module.exports = router;
