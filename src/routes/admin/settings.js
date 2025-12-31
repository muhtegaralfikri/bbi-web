const express = require('express');
const router = express.Router();
const { db } = require('../../config/database');
const { isAuthenticated } = require('../admin');

router.get('/', isAuthenticated, (req, res) => {
  const settings = db.prepare('SELECT * FROM settings').all();
  const settingsObj = {};
  settings.forEach(s => {
    settingsObj[s.key] = s.value;
  });

  res.render('admin/settings/index', {
    user: req.session.user,
    settings: settingsObj,
    active: 'settings'
  });
});

router.post('/', isAuthenticated, (req, res) => {
  const { company_name, company_address, company_phone, company_email, social_facebook, social_instagram, social_linkedin } = req.body;

  const settings = [
    { key: 'company_name', value: company_name },
    { key: 'company_address', value: company_address },
    { key: 'company_phone', value: company_phone },
    { key: 'company_email', value: company_email },
    { key: 'social_facebook', value: social_facebook },
    { key: 'social_instagram', value: social_instagram },
    { key: 'social_linkedin', value: social_linkedin }
  ];

  settings.forEach(setting => {
    db.prepare(`
      INSERT INTO settings (key, value) VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET value = ?, updated_at = CURRENT_TIMESTAMP
    `).run(setting.key, setting.value, setting.value);
  });

  res.redirect('/admin/settings');
});

module.exports = router;
