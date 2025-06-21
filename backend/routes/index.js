// backend/routes/index.js

const express = require('express');
const router = express.Router();

// Importe les routeurs individuels
const authRoutes = require('./auth');
const adminRoutes = require('./admin');
const userRoutes = require('./users'); // NOUVEAU: Importe les routes utilisateur

// Utilise les routeurs sous des chemins spécifiques
router.use('/auth', authRoutes);    // Routes d'authentification (login, register, forgot-password, reset-password)
router.use('/admin', adminRoutes);  // Routes pour l'administration (protégées par le rôle 'admin')
router.use('/user', userRoutes);    // NOUVEAU: Routes pour les utilisateurs (protégées par le rôle 'user')


// Route de base de l'API
router.get('/', (req, res) => {
    res.json({ message: 'Bienvenue sur l\'API de votre application !' });
});

module.exports = router;
