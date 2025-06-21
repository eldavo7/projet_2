// backend/routes/auth.js

const express = require('express');
const router = express.Router();
const db = require('../config/db'); 
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 
const crypto = require('crypto'); // NEW: For generating random tokens
const nodemailer = require('nodemailer'); // NEW: For sending emails (to be configured!)
require('dotenv').config(); 

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error('ERROR: JWT_SECRET is not defined in the .env file. Security is compromised.');
    process.exit(1); 
}

// --- Nodemailer Configuration (IMPORTANT: CUSTOMIZE!) ---
// For a development environment, you can use Mailtrap or Ethereal Email for testing.
// For production, use your email service provider's information (Gmail, SendGrid, Mailgun, etc.).
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.example.com', // Ex: 'smtp.mailtrap.io' or 'smtp.gmail.com'
    port: process.env.EMAIL_PORT || 587, // Or 465 for SSL
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports (starttls)
    auth: {
        user: process.env.EMAIL_USER || 'your-email@example.com', // Your sending email address
        pass: process.env.EMAIL_PASS || 'your-email-password' // Your email password or API key
    },
    tls: {
        rejectUnauthorized: false // Useful for some dev/test servers (avoid in prod if possible)
    }
});

// --- Register Route ---
// CORRECTED PATH: '/register'
router.post('/register', async (req, res) => {
    const { pseudo, email, telephone, adresse, password, acceptCgu } = req.body;

    if (!pseudo || !email || !password || !acceptCgu) {
        return res.status(400).json({ message: 'All required fields (Pseudo, Email, Password, CGU Acceptance) must be filled.' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must contain at least 6 characters.' });
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ message: 'Invalid email format.' });
    }
    if (!acceptCgu) { 
        return res.status(400).json({ message: 'You must accept the General Terms of Use to register.' });
    }

    try {
        let query = 'SELECT pseudo, email, telephone FROM users WHERE pseudo = ? OR email = ?';
        const params = [pseudo, email];

        if (telephone) { 
            query += ' OR telephone = ?';
            params.push(telephone);
        }

        const [existingUsers] = await db.promise().query(query, params);

        if (existingUsers.length > 0) {
            if (existingUsers.some(user => user.pseudo === pseudo)) {
                return res.status(409).json({ message: 'This pseudo is already taken.' });
            }
            if (existingUsers.some(user => user.email === email)) {
                return res.status(409).json({ message: 'This email is already in use.' });
            }
            if (telephone && existingUsers.some(user => user.telephone === telephone)) {
                return res.status(409).json({ message: 'This phone number is already in use.' });
            }
        }

        const salt = await bcrypt.genSalt(10); 
        const password_hash = await bcrypt.hash(password, salt); 

        const [result] = await db.promise().query(
            'INSERT INTO users (pseudo, email, telephone, adresse, password_hash, role, cgu_accepted_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
            [pseudo, email, telephone || null, adresse || null, password_hash, 'user'] 
        );

        if (result.affectedRows > 0) {
            res.status(201).json({ success: true, message: 'Registration successful! You can now log in.' });
        } else {
            res.status(500).json({ success: false, message: 'Error inserting user.' });
        }

    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ success: false, message: 'Internal server error during registration.' });
    }
});


// --- Login Route ---
// CORRECTED PATH: '/login'
router.post('/login', async (req, res) => {
    const { username, password } = req.body; 

    if (!username || !password) {
        return res.status(400).json({ message: 'Pseudo/Email and password are required for login.' });
    }

    try {
        const [users] = await db.promise().query(
            'SELECT id, pseudo, email, password_hash, role FROM users WHERE pseudo = ? OR email = ?',
            [username, username] 
        );

        const user = users[0]; 

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, pseudo: user.pseudo },
            JWT_SECRET,
            { expiresIn: '1h' } 
        );

        res.status(200).json({
            success: true,
            message: 'Login successful',
            role: user.role,
            token: token 
        });

    } catch (error) { 
        console.error('Error during login:', error);
        res.status(500).json({ success: false, message: 'Internal server error during login.' });
    }
});

// --- NEW: Forgot Password Request Route ---
// CORRECTED PATH: '/forgot-password'
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    try {
        const [users] = await db.promise().query('SELECT id, email, pseudo FROM users WHERE email = ?', [email]);
        const user = users[0];

        // SECURITY: Always return a generic message to avoid indicating if the email exists or not.
        if (!user) {
            return res.status(200).json({ success: true, message: 'If the email address is registered, a password reset link has been sent.' });
        }

        // Generate a unique token for the reset (long and random)
        const resetToken = crypto.randomBytes(32).toString('hex');
        // Define an expiration date for the token (e.g., 1 hour from now)
        const resetExpires = new Date(Date.now() + 3600000); // 1 hour in milliseconds

        // Save the token and its expiration in the database for this user
        await db.promise().query(
            'UPDATE users SET reset_password_token = ?, reset_password_expires = ? WHERE id = ?',
            [resetToken, resetExpires, user.id]
        );

        // --- EMAIL SENDING (SIMULATED or REAL) ---
        // Build the reset URL that will be sent by email to the client
        // Make sure localhost:5173 is your frontend address
        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`; // Corrected frontend route

        const mailOptions = {
            from: process.env.EMAIL_USER, 
            to: user.email,               
            subject: 'Password Reset Request',
            html: `
                <p>You have requested to reset your password.</p>
                <p>Please click on this link to reset your password:</p>
                <a href="${resetUrl}">${resetUrl}</a>
                <p>This link will expire in one hour.</p>
                <p>If you did not request this reset, please ignore this email.</p>
            `
        };

        // --- EMAIL SENDING SIMULATION (for development) ---
        if (process.env.NODE_ENV === 'development' && (!process.env.EMAIL_HOST || !process.env.EMAIL_USER)) {
            console.log('\n--- EMAIL SENDING SIMULATION ---');
            console.log('Email NOT sent (Nodemailer config missing or in dev without setup).');
            console.log('Reset link (to paste in browser) :', resetUrl);
            console.log('User :', user.email);
            console.log('--- END SIMULATION ---\n');
        } else {
            // --- REAL EMAIL SENDING (in production or if Nodemailer is configured) ---
            await transporter.sendMail(mailOptions);
            console.log('Reset email sent to:', user.email);
        }
        
        res.status(200).json({ success: true, message: 'If the email address is registered, a password reset link has been sent.' });

    } catch (error) {
        console.error('Error during forgot password request:', error);
        res.status(500).json({ success: false, message: 'Internal server error during password reset request.' });
    }
});

// --- NEW: Password Reset Route (via token) ---
// CORRECTED PATH: '/reset-password'
router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({ success: false, message: 'Token and new password are required.' });
    }
    if (newPassword.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must contain at least 6 characters.' });
    }

    try {
        // Find the user by reset token and check its expiration
        const [users] = await db.promise().query(
            'SELECT id FROM users WHERE reset_password_token = ? AND reset_password_expires > NOW()',
            [token]
        );

        const user = users[0];

        if (!user) {
            return res.status(400).json({ success: false, message: 'The reset link is invalid or has expired.' });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(newPassword, salt);

        // Update the user's password and invalidate the token
        await db.promise().query(
            'UPDATE users SET password_hash = ?, reset_password_token = NULL, reset_password_expires = NULL WHERE id = ?',
            [password_hash, user.id]
        );

        res.status(200).json({ success: true, message: 'Your password has been successfully reset. You can now log in.' });

    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({ success: false, message: 'Internal server error during password reset.' });
    }
});

module.exports = router;
