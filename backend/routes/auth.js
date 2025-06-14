// backend/routes/auth.js

const express = require('express');
const router = express.Router();
// IMPORTANT : Assurez-vous que votre db.js exporte bien 'db' (const db = mysql.createConnection(...))
// et non 'connection', comme nous l'avons discuté précédemment.
const db = require('../config/db'); // Importe la connexion à la base de données (devrait être 'db')
const bcrypt = require('bcryptjs'); // Pour le hachage des mots de passe
const jwt = require('jsonwebtoken'); // Pour la création de tokens JWT
require('dotenv').config(); // Pour accéder à JWT_SECRET depuis le fichier .env

// Récupère la clé secrète JWT.
// Cette variable est définie dans votre fichier .env (JWT_SECRET=...)
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error('ERREUR: JWT_SECRET n\'est pas défini dans le fichier .env. La sécurité est compromise.');
    process.exit(1); // Arrête l'application si la clé n'est pas définie, c'est critique
}

// --- Route d'Inscription (Register) ---
router.post('/register', async (req, res) => {
    // Récupère les données du corps de la requête.
    // Assurez-vous que le frontend envoie bien ces champs.
    const { pseudo, email, telephone, adresse, password, acceptCgu } = req.body;

    // 1. Validation des données côté serveur (essentiel !)
    if (!pseudo || !email || !password || !acceptCgu) {
        return res.status(400).json({ message: 'Tous les champs obligatoires (Pseudo, Email, Mot de passe, Acceptation CGU) doivent être remplis.' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères.' });
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ message: 'Format d\'email invalide.' });
    }
    if (!acceptCgu) { // Vérifie que l'utilisateur a explicitement accepté les CGU
        return res.status(400).json({ message: 'Vous devez accepter les Conditions Générales d\'Utilisation pour vous inscrire.' });
    }

    try {
        // 2. Vérifier si le pseudo, l'email ou le téléphone existent déjà dans la base de données
        let query = 'SELECT pseudo, email, telephone FROM users WHERE pseudo = ? OR email = ?';
        const params = [pseudo, email];

        if (telephone) { // Ajoute la vérification du téléphone seulement si le champ est fourni
            query += ' OR telephone = ?';
            params.push(telephone);
        }

        // Exécute la requête de vérification
        const [existingUsers] = await db.promise().query(query, params);

        if (existingUsers.length > 0) {
            // Vérifie quel champ est en doublon pour un message d'erreur plus précis
            if (existingUsers.some(user => user.pseudo === pseudo)) {
                return res.status(409).json({ message: 'Ce pseudo est déjà pris.' });
            }
            if (existingUsers.some(user => user.email === email)) {
                return res.status(409).json({ message: 'Cet email est déjà utilisé.' });
            }
            if (telephone && existingUsers.some(user => user.telephone === telephone)) {
                return res.status(409).json({ message: 'Ce numéro de téléphone est déjà utilisé.' });
            }
        }

        // 3. Hacher le mot de passe
        // Génère un "sel" (salt) aléatoire qui sera ajouté au mot de passe avant le hachage.
        // Cela rend les attaques par "rainbow table" inefficaces.
        const salt = await bcrypt.genSalt(10); 
        // Hache le mot de passe avec le sel. Le hachage est irréversible.
        const password_hash = await bcrypt.hash(password, salt); 

        // 4. Insérer le nouvel utilisateur dans la base de données
        // Les valeurs `telephone` et `adresse` seront `NULL` si elles sont vides du frontend.
        // Le rôle par défaut est 'user'. `cgu_accepted_at` est défini à l'heure actuelle.
        const [result] = await db.promise().query(
            'INSERT INTO users (pseudo, email, telephone, adresse, password_hash, role, cgu_accepted_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
            [pseudo, email, telephone || null, adresse || null, password_hash, 'user'] 
        );

        // Vérifie si l'insertion a réussi
        if (result.affectedRows > 0) {
            res.status(201).json({ success: true, message: 'Inscription réussie ! Vous pouvez maintenant vous connecter.' });
        } else {
            // Si affectedRows est 0, l'insertion n'a pas eu lieu (rare mais possible).
            res.status(500).json({ success: false, message: 'Erreur lors de l\'insertion de l\'utilisateur.' });
        }

    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur lors de l\'inscription.' });
    }
});


// --- Route de Connexion (Login) ---
router.post('/login', async (req, res) => {
    // L'utilisateur peut se connecter avec son pseudo OU son email
    const { username, password } = req.body; 

    // Validation des champs obligatoires
    if (!username || !password) {
        return res.status(400).json({ message: 'Pseudo/Email et mot de passe sont requis pour la connexion.' });
    }

    try {
        // Chercher l'utilisateur dans la base de données par pseudo ou email
        const [users] = await db.promise().query(
            'SELECT id, pseudo, email, password_hash, role FROM users WHERE pseudo = ? OR email = ?',
            [username, username] // Tente de trouver l'utilisateur avec le username fourni comme pseudo ou email
        );

        const user = users[0]; // Récupère le premier utilisateur trouvé

        // Si aucun utilisateur n'est trouvé
        if (!user) {
            return res.status(401).json({ message: 'Identifiants invalides.' });
        }

        // Comparer le mot de passe fourni par l'utilisateur avec le hachage stocké dans la base de données.
        // bcrypt.compare() gère automatiquement le salage.
        const isMatch = await bcrypt.compare(password, user.password_hash);

        // Si les mots de passe ne correspondent pas
        if (!isMatch) {
            return res.status(401).json({ message: 'Identifiants invalides.' });
        }

        // Authentification réussie : Créer un JSON Web Token (JWT)
        // Le JWT contient des informations sur l'utilisateur (id, rôle, pseudo) encodées.
        // Il est signé avec JWT_SECRET, ce qui permet de vérifier son intégrité.
        const token = jwt.sign(
            { id: user.id, role: user.role, pseudo: user.pseudo },
            JWT_SECRET,
            { expiresIn: '1h' } // Le token sera valide pendant 1 heure
        );

        // Envoyer une réponse de succès avec le rôle de l'utilisateur et le token.
        // Le frontend devra stocker ce token (par ex. dans le localStorage) pour les requêtes futures.
        res.status(200).json({
            success: true,
            message: 'Connexion réussie',
            role: user.role,
            token: token 
        });

    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur lors de la connexion.' });
    }
});

module.exports = router;
