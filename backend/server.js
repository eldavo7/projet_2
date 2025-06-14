// backend/server.js

const express = require('express');
const cors = require('cors'); // Pour gérer les requêtes cross-origin
const bodyParser = require('body-parser'); // Pour parser les corps de requêtes JSON

const authRoutes = require('./routes/auth');     // Routes d'authentification
const userRoutes = require('./routes/users');    // NOUVEAU: Routes spécifiques aux utilisateurs
const adminRoutes = require('./routes/admin');   // NOUVEAU: Routes spécifiques aux administrateurs

const app = express();
const PORT = process.env.PORT || 3001; // Le port de votre serveur backend

// Middleware
app.use(cors()); // Active CORS pour toutes les requêtes
app.use(bodyParser.json()); // Pour parser les corps de requêtes au format JSON
app.use(express.json()); // Alternative/complément à bodyParser.json() avec Express 4.16+

// Routes
app.use('/api/auth', authRoutes);     // Les routes d'authentification seront préfixées par /api/auth
app.use('/api/users', userRoutes);    // NOUVEAU: Les routes utilisateurs seront préfixées par /api/users
app.use('/api/admin', adminRoutes);   // NOUVEAU: Les routes administrateurs seront préfixées par /api/admin

// Route de test simple
app.get('/', (req, res) => {
    res.send('Serveur backend opérationnel !');
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur backend démarré sur le port ${PORT}`);
});
