const express = require('express');
const router = express.Router();
const { db } = require('../../config/database');
const { isAuthenticated } = require('../admin');

router.get('/', isAuthenticated, (req, res) => {
  const messages = db.prepare('SELECT * FROM messages ORDER BY created_at DESC').all();
  res.render('admin/messages/index', {
    user: req.session.user,
    messages,
    active: 'messages'
  });
});

router.get('/:id', isAuthenticated, (req, res) => {
  // Mark as read
  db.prepare('UPDATE messages SET read = 1 WHERE id = ?').run(req.params.id);

  const message = db.prepare('SELECT * FROM messages WHERE id = ?').get(req.params.id);
  res.render('admin/messages/detail', {
    user: req.session.user,
    message,
    active: 'messages'
  });
});

router.post('/:id/delete', isAuthenticated, (req, res) => {
  db.prepare('DELETE FROM messages WHERE id = ?').run(req.params.id);
  res.redirect('/admin/messages');
});

module.exports = router;
