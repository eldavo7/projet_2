const express = require('express');
const router = express.Router();
const connection = require('../config/db');

// Login simple (pas sécurisé, juste pour l'exemple)
router.post('/login', (req, res) => {
  const { username, password, acceptCGU } = req.body;

  // ✅ Vérifie que les CGU sont acceptées
  if (!acceptCGU) {
    return res.status(400).json({ success: false, message: 'Vous devez accepter les conditions générales d\'utilisation.' });
  }

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
/*
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
*/