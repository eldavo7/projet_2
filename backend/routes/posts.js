// backend/routes/posts.js

const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// --- Configuration de Multer pour le stockage des fichiers ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(new Error('Type de fichier non supporté. Seules les images et vidéos sont autorisées.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
});

// --- Route pour créer une nouvelle publication ---
router.post('/posts', protect, upload.single('media'), async (req, res) => {
    const { content } = req.body;
    const userId = req.user.id;
    
    let mediaUrl = null;
    let mediaType = 'none';

    if (req.file) {
        mediaUrl = `/uploads/${req.file.filename}`;
        if (req.file.mimetype.startsWith('image/')) {
            mediaType = 'image';
        } else if (req.file.mimetype.startsWith('video/')) {
            mediaType = 'video';
        }
    }

    if (!content && !mediaUrl) {
        return res.status(400).json({ success: false, message: 'Le post ne peut pas être vide (texte ou média requis).' });
    }

    try {
        // MODIFICATION CLÉ ICI: Utiliser UTC_TIMESTAMP() pour insérer la date en UTC
        const [result] = await db.promise().query(
            'INSERT INTO posts (user_id, content, media_url, media_type, created_at) VALUES (?, ?, ?, ?, UTC_TIMESTAMP())',
            [userId, content || null, mediaUrl, mediaType]
        );

        if (result.affectedRows > 0) {
            const [newPost] = await db.promise().query(
                'SELECT p.*, u.pseudo FROM posts p JOIN users u ON p.user_id = u.id WHERE p.id = ?',
                [result.insertId]
            );
            
            // Le Date object reçu de la DB est déjà UTC grâce à timezone: 'Z' dans db.js
            // res.json() le convertira en string ISO 8601 avec 'Z'.
            return res.status(201).json({ success: true, message: 'Publication créée avec succès.', post: newPost[0] });
        } else {
            return res.status(500).json({ success: false, message: 'Erreur lors de la création de la publication.' });
        }

    } catch (error) {
        console.error('Erreur lors de la création de la publication:', error);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur lors de la création de la publication.' });
    }
});

// --- Route pour récupérer toutes les publications (flux d'actualité simple) ---
router.get('/posts', protect, async (req, res) => {
    try {
        // La requête récupère les dates, qui seront converties en Date objects (UTC) par mysql2
        const [posts] = await db.promise().query(`
            SELECT p.*, u.pseudo 
            FROM posts p 
            JOIN users u ON p.user_id = u.id 
            ORDER BY p.created_at DESC
        `);
        
        // Pas besoin de mapper et toISOString() ici, car les Date objects sont déjà UTC
        // et res.json() les convertira automatiquement en ISO strings avec 'Z'.
        res.status(200).json({ success: true, posts: posts });

    } catch (error) {
        console.error('Erreur lors de la récupération des publications:', error);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur lors de la récupération des publications.' });
    }
});

module.exports = router;
