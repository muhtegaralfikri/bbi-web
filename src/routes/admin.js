const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { db } = require('../config/database');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../public/uploads/berita');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // secure filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'berita-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

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

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) {
      console.error('Database error:', err);
      return res.render('admin/login', {
        title: 'Login - Admin',
        message: { type: 'error', text: 'Terjadi kesalahan sistem' }
      });
    }

    if (user && user.password && bcrypt.compareSync(password, user.password)) {
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
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
});

// Admin Panel - Unified view
router.get('/', isAuthenticated, (req, res) => {
  const editId = req.query.edit;
  const editType = req.query.type;
  
  // Fetch all data for admin panel
  db.all('SELECT * FROM berita ORDER BY created_at DESC', [], (err, berita) => {
    if (err) berita = [];
    
    db.all('SELECT * FROM cabang ORDER BY name ASC', [], (err, cabang) => {
      if (err) cabang = [];
      
      db.all(`SELECT c.*, b.title as berita_title 
              FROM comments c 
              LEFT JOIN berita b ON c.berita_id = b.id 
              ORDER BY c.created_at DESC`, [], (err, comments) => {
        if (err) comments = [];
        
        // Get edit data if editing
        let editData = null;
        if (editId && editType === 'berita') {
          editData = berita.find(b => b.id == editId);
        } else if (editId && editType === 'cabang') {
          editData = cabang.find(c => c.id == editId);
        }
        
        res.render('admin/index', {
          user: req.session.user,
          berita: berita || [],
          cabang: cabang || [],
          comments: comments || [],
          settings: res.locals.settings || {},
          activeTab: req.query.tab || 'berita',
          editData,
          editType,
          editId
        });
      });
    });
  });
});

// ========== BERITA CRUD ==========
// Create berita
router.post('/berita/create', isAuthenticated, upload.single('image'), (req, res) => {
  const { title, summary, content, status } = req.body;
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const image = req.file ? '/uploads/berita/' + req.file.filename : null;
  const published = status === 'published' ? 1 : 0;
  
  db.run(
    'INSERT INTO berita (title, slug, summary, content, image, category, published) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [title, slug, summary, content, image, 'umum', published],
    (err) => {
      if (err) console.error('Error creating berita:', err);
      res.redirect('/admin?tab=berita');
    }
  );
});

// Update berita
router.post('/berita/:id/update', isAuthenticated, upload.single('image'), (req, res) => {
  const { title, summary, content, status } = req.body;
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const published = status === 'published' ? 1 : 0;
  
  // Dynamic query construction based on whether image is uploaded
  let query = 'UPDATE berita SET title = ?, slug = ?, summary = ?, content = ?, published = ?, updated_at = CURRENT_TIMESTAMP';
  let params = [title, slug, summary, content, published];
  
  if (req.file) {
    query += ', image = ?';
    params.push('/uploads/berita/' + req.file.filename);
  }
  
  query += ' WHERE id = ?';
  params.push(req.params.id);
  
  db.run(query, params, (err) => {
    if (err) console.error('Error updating berita:', err);
    res.redirect('/admin?tab=berita');
  });
});

// Delete berita
router.post('/berita/:id/delete', isAuthenticated, (req, res) => {
  db.run('DELETE FROM berita WHERE id = ?', [req.params.id], (err) => {
    res.redirect('/admin?tab=berita');
  });
});

// ========== CABANG CRUD ==========
// Create cabang
router.post('/cabang/create', isAuthenticated, (req, res) => {
  const { name, address, phone, email, map_embed } = req.body;
  
  db.run(
    'INSERT INTO cabang (name, address, phone, email, map_embed) VALUES (?, ?, ?, ?, ?)',
    [name, address, phone, email, map_embed],
    (err) => {
      if (err) console.error('Error creating cabang:', err);
      res.redirect('/admin?tab=cabang');
    }
  );
});

// Update cabang
router.post('/cabang/:id/update', isAuthenticated, (req, res) => {
  const { name, address, phone, email, map_embed } = req.body;
  
  db.run(
    'UPDATE cabang SET name = ?, address = ?, phone = ?, email = ?, map_embed = ? WHERE id = ?',
    [name, address, phone, email, map_embed, req.params.id],
    (err) => {
      if (err) console.error('Error updating cabang:', err);
      res.redirect('/admin?tab=cabang');
    }
  );
});

// Delete cabang
router.post('/cabang/:id/delete', isAuthenticated, (req, res) => {
  db.run('DELETE FROM cabang WHERE id = ?', [req.params.id], (err) => {
    res.redirect('/admin?tab=cabang');
  });
});

// ========== COMMENTS ==========
// Comment Routes
router.post('/comments/:id/approve', isAuthenticated, (req, res) => {
  const id = req.params.id;
  db.run('UPDATE comments SET approved = 1 WHERE id = ?', [id], (err) => {
    if (err) console.error(err);
    res.redirect('/admin?tab=comments');
  });
});

router.post('/comments/:id/delete', isAuthenticated, (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM comments WHERE id = ?', [id], (err) => {
    if (err) console.error(err);
    res.redirect('/admin?tab=comments');
  });
});

// ========== SETTINGS ==========
// Update settings
router.post('/settings', isAuthenticated, (req, res) => {
  const settings = req.body;
  const keys = Object.keys(settings);
  
  let completed = 0;
  keys.forEach(key => {
    db.run(
      'INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)',
      [key, settings[key]],
      (err) => {
        completed++;
        if (completed === keys.length) {
          res.redirect('/admin?tab=settings');
        }
      }
    );
  });
  
  if (keys.length === 0) {
    res.redirect('/admin?tab=settings');
  }
});

module.exports = { router, isAuthenticated };
