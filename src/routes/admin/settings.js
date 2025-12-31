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
  const { 
    company_name, company_desc, company_address, company_phone, company_whatsapp,
    company_email, company_website, company_maps, company_maps_link,
    social_instagram, social_youtube 
  } = req.body;

  const settings = [
    { key: 'company_name', value: company_name },
    { key: 'company_desc', value: company_desc },
    { key: 'company_address', value: company_address },
    { key: 'company_phone', value: company_phone },
    { key: 'company_whatsapp', value: company_whatsapp },
    { key: 'company_email', value: company_email },
    { key: 'company_website', value: company_website },
    { key: 'company_maps', value: company_maps },
    { key: 'company_maps_link', value: company_maps_link },
    { key: 'social_instagram', value: social_instagram },
    { key: 'social_youtube', value: social_youtube }
  ];

  db.serialize(() => {
    const stmt = db.prepare(`
      INSERT INTO settings (key, value) VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET value = ?, updated_at = CURRENT_TIMESTAMP
    `);

    settings.forEach(setting => {
      stmt.run(setting.key, setting.value, setting.value);
    });

    stmt.finalize(() => {
      res.redirect('/admin/settings');
    });
  });
});

module.exports = router;
