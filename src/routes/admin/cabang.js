const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { db } = require('../../config/database');
const { isAuthenticated } = require('../admin');
const { optimizeImage } = require('../../middleware/imageOptimizer');

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
  db.all('SELECT * FROM cabang ORDER BY name ASC', [], (err, cabang) => {
    if (err) {
      console.error(err);
      return res.render('error', { message: 'Database Error' });
    }
    res.render('admin/cabang/index', {
      user: req.session.user,
      cabang,
      active: 'cabang'
    });
  });
});

router.get('/create', isAuthenticated, (req, res) => {
  res.render('admin/cabang/form', {
    user: req.session.user,
    active: 'cabang'
  });
});

router.post('/', isAuthenticated, upload.single('image'), optimizeImage, (req, res) => {
  const { name, address, phone, email, map_link } = req.body;

  db.run(`
    INSERT INTO cabang (name, address, phone, email, map_link, image)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [name, address, phone, email, map_link, req.file ? '/uploads/' + req.file.filename : null], (err) => {
      if (err) console.error(err);
      res.redirect('/admin/cabang');
  });
});

router.get('/:id/edit', isAuthenticated, (req, res) => {
  db.get('SELECT * FROM cabang WHERE id = ?', [req.params.id], (err, cabang) => {
    if (err || !cabang) {
       return res.redirect('/admin/cabang');
    }
    res.render('admin/cabang/form', {
      user: req.session.user,
      cabang,
      active: 'cabang'
    });
  });
});

router.post('/:id', isAuthenticated, upload.single('image'), optimizeImage, (req, res) => {
  const { name, address, phone, email, map_link } = req.body;

  let query = 'UPDATE cabang SET name = ?, address = ?, phone = ?, email = ?, map_link = ?';
  let params = [name, address, phone, email, map_link];

  if (req.file) {
    query += ', image = ?';
    params.push('/uploads/' + req.file.filename);
  }

  query += ' WHERE id = ?';
  params.push(req.params.id);

  db.run(query, params, (err) => {
    if (err) console.error(err);
    res.redirect('/admin/cabang');
  });
});

router.post('/:id/delete', isAuthenticated, (req, res) => {
  db.run('DELETE FROM cabang WHERE id = ?', [req.params.id], (err) => {
    if (err) console.error(err);
    res.redirect('/admin/cabang');
  });
});

module.exports = router;
