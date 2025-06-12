const mysql = require('mysql');

// METTRE LE FICHIER .env
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',          // par défaut sous WAMP
  password: 'root',          // vide si pas de mot de passe
  database: 'projet_2'      // ta base dans phpMyAdmin
});

connection.connect(err => {
  if (err) throw err;
  console.log('MySQL connecté !');
});

module.exports = connection;
