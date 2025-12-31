const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { db } = require('../config/database');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.redirect('/admin/login');
};

// Login page
router.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect('/admin');
  }
  res.render('admin/login', { title: 'Login - Admin', message: null });
});

// Login handler
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

  if (user && bcrypt.compareSync(password, user.password)) {
    req.session.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };
    return res.redirect('/admin');
  }

  res.render('admin/login', {
    title: 'Login - Admin',
    message: { type: 'error', text: 'Email atau password salah' }
  });
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
});

// Dashboard
router.get('/', isAuthenticated, (req, res) => {
  const stats = {
    berita: db.prepare('SELECT COUNT(*) as count FROM berita').get().count,
    cabang: db.prepare('SELECT COUNT(*) as count FROM cabang').get().count,
    unitBisnis: db.prepare('SELECT COUNT(*) as count FROM unit_bisnis').get().count,
    messages: db.prepare('SELECT COUNT(*) as count FROM messages WHERE read = 0').get().count
  };

  res.render('admin/dashboard', {
    user: req.session.user,
    stats,
    active: 'dashboard'
  });
});

module.exports = { router, isAuthenticated };
