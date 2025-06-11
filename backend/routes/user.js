const express = require('express');
const router = express.Router();

router.get('/home', (req, res) => {
  // Simple message pour la route user
  res.json({ message: 'Bienvenue sur la page utilisateur !' });
});

module.exports = router;
