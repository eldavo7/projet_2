// backend/config/db.js

const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'votre_nom_de_base_de_donnees',
    // NOUVEAU: Configure le pilote MySQL pour traiter les dates en UTC
    timezone: 'Z' 
});

db.connect(err => {
    if (err) {
        console.error('Erreur de connexion à la base de données:', err);
        return;
    }
    console.log('Connecté à la base de données MySQL.');
});

module.exports = db;
