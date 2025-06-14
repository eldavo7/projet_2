// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token;

    // Vérifie si le token est présent dans les headers d'autorisation (Bearer token)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Récupère le token de l'en-tête
            token = req.headers.authorization.split(' ')[1];

            // Vérifie le token avec la clé secrète
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attache l'utilisateur (via son ID et son rôle) à l'objet de requête
            // Cela rend l'utilisateur accessible dans les routes suivantes (req.user)
            req.user = { id: decoded.id, role: decoded.role };

            next(); // Passe au middleware/route suivant
        } catch (error) {
            console.error('Erreur de validation du token:', error);
            return res.status(401).json({ message: 'Non autorisé, token invalide.' });
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
        next(); // L'utilisateur a le bon rôle, passe au middleware/route suivant
    };
};

module.exports = { protect, authorizeRoles };
