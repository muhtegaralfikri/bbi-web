const express = require('express');
const router = express.Router();
const { db } = require('../../config/database');
const { isAuthenticated } = require('../admin');

router.get('/', isAuthenticated, (req, res) => {
  db.all('SELECT * FROM settings', (err, rows) => {
    if (err) {
      console.error('Error fetching settings:', err);
      return res.render('error', { message: 'Database Error' });
    }

    const settingsObj = {};
    rows.forEach(s => {
      settingsObj[s.key] = s.value;
    });

    res.render('admin/settings/index', {
      user: req.session.user,
      settings: settingsObj,
      active: 'settings'
    });
  });
});

router.post('/', isAuthenticated, (req, res) => {
  console.log('=== SETTINGS POST RECEIVED ===');
  console.log('Request body:', req.body);
  
  const { 
    company_address, company_email, company_whatsapp,
    company_website, company_maps 
  } = req.body;

  console.log('Parsed values:', { company_address, company_email, company_whatsapp, company_website, company_maps });

  const settings = [
    { key: 'company_address', value: company_address },
    { key: 'company_email', value: company_email },
    { key: 'company_whatsapp', value: company_whatsapp },
    { key: 'company_website', value: company_website },
    { key: 'company_maps', value: company_maps }
  ];

  // Save each setting with MySQL syntax
  let completed = 0;
  const total = settings.length;

  settings.forEach(setting => {
    db.run(
      'INSERT INTO settings (`key`, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = ?, updated_at = CURRENT_TIMESTAMP',
      [setting.key, setting.value, setting.value],
      (err) => {
        if (err) console.error('Error saving setting:', setting.key, err);
        completed++;
        if (completed === total) {
          res.redirect('/admin?tab=settings');
        }
      }
    );
  });
});

module.exports = router;
