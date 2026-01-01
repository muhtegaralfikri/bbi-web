const express = require('express');
const router = express.Router();
const { db } = require('../config/database');

// Public Cabang Pagination
router.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const offset = (page - 1) * limit;

  // Get total count
  db.get('SELECT COUNT(*) as count FROM cabang', [], (err, row) => {
    let total = 0;
    if (Array.isArray(row) && row.length > 0) {
      total = row[0].count || row[0]['COUNT(*)'] || 0;
    } else if (row && row.count !== undefined) {
      total = row.count;
    }
    const totalPages = Math.ceil(total / limit);

    // Get paginated data
    db.all(`SELECT * FROM cabang ORDER BY name ASC LIMIT ? OFFSET ?`, [limit, offset], (err, cabang) => {
      if (err) {
        console.error('Error fetching cabang:', err);
        cabang = [];
      }
      
      res.render('cabang/index', {
        title: 'Info Cabang',
        cabang: cabang || [],
        pagination: {
          page: page,
          totalPages: totalPages,
          total: total
        }
      });
    });
  });
});

module.exports = router;

