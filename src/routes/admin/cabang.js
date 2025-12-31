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
    cb(null, 'cabang-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/', isAuthenticated, (req, res) => {
  const cabang = db.prepare('SELECT * FROM cabang ORDER BY name ASC').all();
  res.render('admin/cabang/index', {
    user: req.session.user,
    cabang,
    active: 'cabang'
  });
});

router.get('/create', isAuthenticated, (req, res) => {
  res.render('admin/cabang/form', {
    user: req.session.user,
    active: 'cabang'
  });
});

router.post('/', isAuthenticated, upload.single('image'), (req, res) => {
  const { name, address, phone, email, map_link } = req.body;

  db.prepare(`
    INSERT INTO cabang (name, address, phone, email, map_link, image)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(name, address, phone, email, map_link, req.file ? '/uploads/' + req.file.filename : null);

  res.redirect('/admin/cabang');
});

router.get('/:id/edit', isAuthenticated, (req, res) => {
  const cabang = db.prepare('SELECT * FROM cabang WHERE id = ?').get(req.params.id);
  res.render('admin/cabang/form', {
    user: req.session.user,
    cabang,
    active: 'cabang'
  });
});

router.post('/:id', isAuthenticated, upload.single('image'), (req, res) => {
  const { name, address, phone, email, map_link } = req.body;

  let query = 'UPDATE cabang SET name = ?, address = ?, phone = ?, email = ?, map_link = ?';
  let params = [name, address, phone, email, map_link];

  if (req.file) {
    query += ', image = ?';
    params.push('/uploads/' + req.file.filename);
  }

  query += ' WHERE id = ?';
  params.push(req.params.id);

  db.prepare(query).run(...params);
  res.redirect('/admin/cabang');
});

router.post('/:id/delete', isAuthenticated, (req, res) => {
  db.prepare('DELETE FROM cabang WHERE id = ?').run(req.params.id);
  res.redirect('/admin/cabang');
});

module.exports = router;
