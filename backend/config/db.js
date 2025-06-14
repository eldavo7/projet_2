// backend/config/db.js

const mysql = require('mysql2'); // NOUVEAU: Utilisez mysql2
require('dotenv').config(); // NOUVEAU: Charge les variables d'environnement depuis un fichier .env

const db = mysql.createConnection({ // NOUVEAU: Utilisez 'db' comme nom de variable
    host: process.env.DB_HOST || 'localhost', // NOUVEAU: Utilise la variable d'environnement
    user: process.env.DB_USER || 'root',      // NOUVEAU: Utilise la variable d'environnement
    password: process.env.DB_PASSWORD || '',  // NOUVEAU: Utilise la variable d'environnement
    database: process.env.DB_NAME || 'votre_nom_de_base_de_donnees' // NOUVEAU: Utilise la variable d'environnement
});

db.connect(err => {
    if (err) {
        console.error('Erreur de connexion à la base de données:', err); // NOUVEAU: Loggez l'erreur au lieu de la jeter directement
        // Si la connexion à la base de données est critique pour le démarrage,
        // vous pouvez décommenter la ligne suivante pour arrêter le processus Node.js.
        // process.exit(1); 
        return; // Empêche l'exécution du reste du code si la connexion échoue
    }
    console.log('Connecté à la base de données MySQL.');
});

module.exports = db; // NOUVEAU: Exportez 'db'
