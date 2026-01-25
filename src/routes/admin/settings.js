const express = require('express');
const router = express.Router();
const { db } = require('../../config/database');
const { isAuthenticated } = require('../admin');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'video_file') {
      cb(null, 'public/uploads/videos/');
    } else if (file.fieldname === 'video_thumbnail') {
      cb(null, 'public/uploads/');
    } else {
      cb(null, 'public/uploads/');
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB max for video
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'video_file') {
      const allowedTypes = ['.mp4', '.webm', '.ogg'];
      const ext = path.extname(file.originalname).toLowerCase();
      if (allowedTypes.includes(ext)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only MP4, WebM, and OGG are allowed for video.'));
      }
    } else if (file.fieldname === 'video_thumbnail') {
      const allowedTypes = ['.jpg', '.jpeg', '.png', '.webp'];
      const ext = path.extname(file.originalname).toLowerCase();
      if (allowedTypes.includes(ext)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only JPG, PNG, and WebP are allowed for thumbnail.'));
      }
    } else {
      cb(null, true);
    }
  }
});

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

router.post('/', isAuthenticated, upload.fields([{ name: 'video_file' }, { name: 'video_thumbnail' }]), (req, res) => {
  console.log('=== SETTINGS POST RECEIVED ===');
  console.log('Request body:', req.body);
  console.log('Files:', req.files);
  
  const {
    company_name, company_desc, company_address, company_phone,
    company_email, company_whatsapp, company_website,
    company_maps, company_maps_link,
    social_instagram, social_youtube,
    delete_video
  } = req.body;

  const settings = [];

  if (company_name !== undefined) settings.push({ key: 'company_name', value: company_name });
  if (company_desc !== undefined) settings.push({ key: 'company_desc', value: company_desc });
  if (company_address !== undefined) settings.push({ key: 'company_address', value: company_address });
  if (company_phone !== undefined) settings.push({ key: 'company_phone', value: company_phone });
  if (company_email !== undefined) settings.push({ key: 'company_email', value: company_email });
  if (company_whatsapp !== undefined) settings.push({ key: 'company_whatsapp', value: company_whatsapp });
  if (company_website !== undefined) settings.push({ key: 'company_website', value: company_website });
  if (company_maps !== undefined) settings.push({ key: 'company_maps', value: company_maps });
  if (company_maps_link !== undefined) settings.push({ key: 'company_maps_link', value: company_maps_link });
  if (social_instagram !== undefined) settings.push({ key: 'social_instagram', value: social_instagram });
  if (social_youtube !== undefined) settings.push({ key: 'social_youtube', value: social_youtube });

  // Handle video file upload
  if (req.files && req.files.video_file && req.files.video_file[0]) {
    const videoPath = '/uploads/videos/' + req.files.video_file[0].filename;
    settings.push({ key: 'video_file', value: videoPath });
  }

  // Handle video thumbnail upload
  if (req.files && req.files.video_thumbnail && req.files.video_thumbnail[0]) {
    const thumbnailPath = '/uploads/' + req.files.video_thumbnail[0].filename;
    settings.push({ key: 'video_thumbnail', value: thumbnailPath });
  }

  // Handle video deletion
  if (delete_video === '1') {
    settings.push({ key: 'video_file', value: '' });
    settings.push({ key: 'video_thumbnail', value: '' });
  }

  // Save each setting
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
