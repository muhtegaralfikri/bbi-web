const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { db } = require('../../config/database');
const { isAuthenticated } = require('../admin');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'unit-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/', isAuthenticated, (req, res) => {
  const unitBisnis = db.prepare('SELECT * FROM unit_bisnis ORDER BY order_num ASC, created_at DESC').all();
  res.render('admin/unit-bisnis/index', {
    user: req.session.user,
    unitBisnis,
    active: 'unit-bisnis'
  });
});

router.get('/create', isAuthenticated, (req, res) => {
  res.render('admin/unit-bisnis/form', {
    user: req.session.user,
    active: 'unit-bisnis'
  });
});

router.post('/', isAuthenticated, upload.single('image'), (req, res) => {
  const { name, description, icon, link, order_num } = req.body;

  db.prepare(`
    INSERT INTO unit_bisnis (name, description, icon, image, link, order_num)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(name, description, icon, req.file ? '/uploads/' + req.file.filename : null, link, order_num || 0);

  res.redirect('/admin/unit-bisnis');
});

router.get('/:id/edit', isAuthenticated, (req, res) => {
  const unit = db.prepare('SELECT * FROM unit_bisnis WHERE id = ?').get(req.params.id);
  res.render('admin/unit-bisnis/form', {
    user: req.session.user,
    unit,
    active: 'unit-bisnis'
  });
});

router.post('/:id', isAuthenticated, upload.single('image'), (req, res) => {
  const { name, description, icon, link, order_num } = req.body;

  let query = 'UPDATE unit_bisnis SET name = ?, description = ?, icon = ?, link = ?, order_num = ?';
  let params = [name, description, icon, link, order_num || 0];

  if (req.file) {
    query += ', image = ?';
    params.push('/uploads/' + req.file.filename);
  }

  query += ' WHERE id = ?';
  params.push(req.params.id);

  db.prepare(query).run(...params);
  res.redirect('/admin/unit-bisnis');
});

router.post('/:id/delete', isAuthenticated, (req, res) => {
  db.prepare('DELETE FROM unit_bisnis WHERE id = ?').run(req.params.id);
  res.redirect('/admin/unit-bisnis');
});

module.exports = router;
