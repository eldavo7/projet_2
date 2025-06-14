// backend/routes/users.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); // Importe le middleware de protection
const db = require('../config/db'); // Importe la connexion à la base de données

// Route protégée pour récupérer les informations de l'utilisateur connecté
// Seuls les utilisateurs authentifiés peuvent accéder à cette route.
router.get('/home', protect, async (req, res) => {
    try {
        // req.user est défini par le middleware 'protect' et contient l'ID et le rôle de l'utilisateur
        const userId = req.user.id;

        // Récupère les informations de l'utilisateur depuis la base de données
        // IMPORTANT: Ne renvoyez JAMAIS le password_hash au frontend !
        const [users] = await db.promise().query(
            'SELECT id, pseudo, email, telephone, adresse, role FROM users WHERE id = ?',
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        res.status(200).json({ success: true, data: users[0] });

    } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
    }
});

// Vous pouvez ajouter d'autres routes spécifiques aux utilisateurs ici (ex: mise à jour de profil)

module.exports = router;
