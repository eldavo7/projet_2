// backend/server.js

const express = require('express');
const cors = require('cors'); 
const bodyParser = require('body-parser'); 
const path = require('path'); // NOUVEAU: Importe le module path

// Importation des routeurs individuels
const authRoutes = require('./routes/auth');     
const userRoutes = require('./routes/users');    
const adminRoutes = require('./routes/admin');   
const postsRoutes = require('./routes/posts');   // NOUVEAU: Importe les routes des publications

const app = express();
const PORT = process.env.PORT || 3001; 

// Middleware
app.use(cors()); 
// IMPORTANT: Pour Multer, express.json() et bodyParser.json() DOIVENT ÊTRE AVANT multer.
// bodyParser.json() est pour les données JSON, Multer est pour les formulaires multipart/form-data.
// Si vous utilisez express.json(), vous n'avez pas forcément besoin de bodyParser.json() pour les JSON.
app.use(express.json()); 
app.use(bodyParser.urlencoded({ extended: true })); // Pour parser les données de formulaires URL-encoded
app.use(bodyParser.json()); // Pour parser les corps de requêtes JSON

// NOUVEAU: Servir les fichiers statiques depuis le dossier 'public'
// Cela rendra les fichiers dans 'backend/public/uploads' accessibles via '/uploads/...'
app.use(express.static(path.join(__dirname, 'public')));


// Montage des routes API
app.use('/api/auth', authRoutes);     
app.use('/api/users', userRoutes);    
app.use('/api/admin', adminRoutes);   
app.use('/api/posts', postsRoutes);   // NOUVEAU: Monte les routes des publications sous /api/posts

// Route de test simple pour vérifier que le serveur est accessible
app.get('/', (req, res) => {
    res.send('Serveur backend opérationnel !');
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur backend démarré sur le port ${PORT}`);
});
