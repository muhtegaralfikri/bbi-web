const express = require('express');
const router = express.Router();
const { db } = require('../config/database');

router.get('/', (req, res) => {
  db.all('SELECT * FROM cabang ORDER BY name ASC', [], (err, cabang) => {
    if (err) {
      console.error('Error fetching cabang:', err);
      cabang = [];
    }
    
    res.render('cabang/index', {
      title: 'Info Cabang',
      cabang: cabang || []
    });
  });
});

module.exports = router;

