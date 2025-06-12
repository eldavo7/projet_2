const express = require('express');
const router = express.Router();
const connection = require('../config/db');

// Login simple (pas sécurisé, juste pour l'exemple)
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  connection.query(
    'SELECT * FROM users WHERE username = ? AND password = ?',
    [username, password],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length > 0) {
        // Renvoie le rôle utilisateur (user/admin)
        res.json({ success: true, role: results[0].role });
      } else {
        res.status(401).json({ success: false, message: 'Identifiants invalides' });
      }
    }
  );
});

module.exports = router;
