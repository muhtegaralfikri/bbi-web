const express = require('express');
const router = express.Router();
const { db } = require('../../config/database');
const { isAuthenticated } = require('../admin');

router.get('/', isAuthenticated, (req, res) => {
  db.all('SELECT * FROM messages ORDER BY created_at DESC', [], (err, messages) => {
    if (err) {
      console.error(err);
      return res.render('error', { message: 'Database Error' });
    }
    res.render('admin/messages/index', {
      user: req.session.user,
      messages,
      active: 'messages'
    });
  });
});

router.get('/:id', isAuthenticated, (req, res) => {
  db.run('UPDATE messages SET read = 1 WHERE id = ?', [req.params.id], (err) => {
    if (err) console.error('Error marking message as read:', err);
    
    db.get('SELECT * FROM messages WHERE id = ?', [req.params.id], (err2, message) => {
         if (err2 || !message) {
            return res.redirect('/admin/messages');
         }
         res.render('admin/messages/detail', {
            user: req.session.user,
            message,
            active: 'messages'
          });
    });
  });
});

router.post('/:id/delete', isAuthenticated, (req, res) => {
  db.run('DELETE FROM messages WHERE id = ?', [req.params.id], (err) => {
    if (err) console.error(err);
    res.redirect('/admin/messages');
  });
});

module.exports = router;
