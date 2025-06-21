// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Assurez-vous que JWT_SECRET est accessible

const protect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = { id: decoded.id, role: decoded.role }; // Attache l'utilisateur à la requête
            next(); 
        } catch (error) {
            console.error('Erreur de validation du token:', error);
            return res.status(401).json({ message: 'Non autorisé, token invalide ou expiré.' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Non autorisé, pas de token fourni.' });
    }
};

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Accès refusé, vous n\'avez pas le rôle requis.' });
        }
        next(); 
    };
};

module.exports = { protect, authorizeRoles };
