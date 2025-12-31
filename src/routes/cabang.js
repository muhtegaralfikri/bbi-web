const express = require('express');
const router = express.Router();
const { db } = require('../config/database');

router.get('/', (req, res) => {
  const cabang = db.prepare('SELECT * FROM cabang ORDER BY name ASC').all();

  res.render('cabang/index', {
    title: 'Info Cabang',
    cabang
  });
});

module.exports = router;
