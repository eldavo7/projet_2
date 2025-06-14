// backend/routes/admin.js

const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware'); // Importe les middlewares
const db = require('../config/db'); // Importe la connexion à la base de données

// Route protégée pour le tableau de bord administrateur
// Seuls les utilisateurs avec le rôle 'admin' peuvent accéder à cette route.
router.get('/dashboard', protect, authorizeRoles('admin'), async (req, res) => {
    try {
        // Récupère tous les utilisateurs de la base de données
        // IMPORTANT: Ne renvoyez JAMAIS le password_hash au frontend !
        const [users] = await db.promise().query(
            'SELECT id, pseudo, email, telephone, adresse, role FROM users'
        );

        res.status(200).json({ success: true, data: users });

    } catch (error) {
        console.error('Erreur lors de la récupération des données admin:', error);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
    }
});

// Vous pouvez ajouter d'autres routes spécifiques aux administrateurs ici (ex: gérer les utilisateurs)

module.exports = router;
