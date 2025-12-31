const { db } = require('../config/database');

const settingsMiddleware = (req, res, next) => {
  db.all('SELECT * FROM settings', (err, rows) => {
    if (err) {
      console.error('Error fetching settings:', err);
      res.locals.settings = {};
      return next();
    }

    const settings = {};
    rows.forEach(row => {
      settings[row.key] = row.value;
    });

    res.locals.settings = settings;
    next();
  });
};

module.exports = settingsMiddleware;
