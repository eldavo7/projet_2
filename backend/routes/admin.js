const express = require('express');
const router = express.Router();
const connection = require('../config/db');

router.get('/dashboard', (req, res) => {
  connection.query('SELECT id, username, role FROM users', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

module.exports = router;
