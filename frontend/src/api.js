// frontend/src/api.js

const API_BASE_URL = 'http://localhost:3001/api'; 

// Fonction de connexion
export const login = async (username, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        if (response.ok) {
            return { success: true, role: data.role, token: data.token };
        } else {
            return { success: false, message: data.message || 'Échec de la connexion' };
        }
    } catch (error) {
        console.error('Erreur réseau ou du serveur lors de la connexion:', error);
        return { success: false, message: 'Erreur de connexion : impossible de joindre le serveur.' };
    }
};

// Fonction d'inscription
export const register = async (userData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        const data = await response.json();
        if (response.ok) {
            return { success: true, message: data.message };
        } else {
            return { success: false, message: data.message || 'Échec de l\'inscription' };
        }
    } catch (error) {
        console.error('Erreur réseau ou du serveur lors de l\'inscription:', error);
        return { success: false, message: 'Erreur d\'inscription : impossible de joindre le serveur.' };
    }
};

// Fonction pour demander un lien de réinitialisation de mot de passe
export const requestPasswordReset = async (email) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });
        const data = await response.json();
        if (response.ok) {
            return { success: true, message: data.message };
        } else {
            return { success: false, message: data.message || 'Échec de la demande de réinitialisation.' };
        }
    } catch (error) {
        console.error('Erreur réseau ou du serveur lors de la demande de réinitialisation:', error);
        return { success: false, message: 'Erreur: Impossible de joindre le serveur pour la demande de réinitialisation.' };
    }
};

// Fonction pour réinitialiser le mot de passe avec un token
export const resetUserPassword = async (token, newPassword) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, newPassword }),
        });
        const data = await response.json();
        if (response.ok) {
            return { success: true, message: data.message };
        } else {
            return { success: false, message: data.message || 'Échec de la réinitialisation du mot de passe.' };
        }
    } catch (error) {
        console.error('Erreur réseau ou du serveur lors de la réinitialisation du mot de passe:', error);
        return { success: false, message: 'Erreur: Impossible de joindre le serveur pour la réinitialisation du mot de passe.' };
    }
};

// Fonction pour récupérer les données spécifiques à l'utilisateur
export const getUserHome = async (token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/users/dashboard`, { 
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
        });
        const data = await response.json();
        if (response.ok) {
            return { success: true, data: data.data, message: data.message }; 
        } else {
            if (response.status === 401 || response.status === 403) {
                return { success: false, message: data.message || 'Accès non autorisé ou session expirée. Veuillez vous reconnecter.' };
            }
            return { success: false, message: data.message || 'Échec de la récupération des données utilisateur.' };
        }
    } catch (error) {
        console.error('Erreur réseau ou du serveur lors de la récupération des données utilisateur:', error);
        return { success: false, message: 'Erreur de connexion : impossible de joindre le serveur pour les données utilisateur.' };
    }
};

// Fonction pour récupérer les données du tableau de bord administrateur
export const getAdminDashboard = async (token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        const data = await response.json();
        if (response.ok) {
            return { success: true, data: data.data || [], message: data.message };
        } else {
            if (response.status === 401 || response.status === 403) {
                return { success: false, message: data.message || 'Accès non autorisé ou session expirée. Veuillez vous reconnecter.' };
            }
            return { success: false, message: data.message || 'Échec de la récupération des données admin.' };
        }
    } catch (error) {
        console.error('Erreur réseau ou du serveur lors de la récupération des données admin:', error);
        return { success: false, message: 'Erreur de connexion : impossible de joindre le serveur pour les données admin.' };
    }
};

// NOUVEAU: Fonction pour créer une publication
export const createPost = async (postData, token) => {
    try {
        // Pour les téléchargements de fichiers (multipart/form-data), ne définissez PAS le Content-Type.
        // Le navigateur le fera automatiquement avec les bonnes limites de boundary.
        const response = await fetch(`${API_BASE_URL}/posts/posts`, { // Chemin vers la nouvelle route
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}` 
            },
            body: postData, // postData sera un objet FormData
        });
        const data = await response.json();
        if (response.ok) {
            return { success: true, message: data.message, post: data.post };
        } else {
            return { success: false, message: data.message || 'Échec de la création de la publication.' };
        }
    } catch (error) {
        console.error('Erreur réseau ou du serveur lors de la création de la publication:', error);
        return { success: false, message: 'Erreur: Impossible de joindre le serveur pour créer la publication.' };
    }
};

// NOUVEAU: Fonction pour récupérer toutes les publications
export const getPosts = async (token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/posts/posts`, { // Chemin vers la nouvelle route
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
        });
        const data = await response.json();
        if (response.ok) {
            return { success: true, posts: data.posts }; // Le backend renvoie un objet { posts: [...] }
        } else {
            if (response.status === 401 || response.status === 403) {
                return { success: false, message: data.message || 'Accès non autorisé ou session expirée. Veuillez vous reconnecter.' };
            }
            return { success: false, message: data.message || 'Échec de la récupération des publications.' };
        }
    } catch (error) {
        console.error('Erreur réseau ou du serveur lors de la récupération des publications:', error);
        return { success: false, message: 'Erreur: Impossible de joindre le serveur pour récupérer les publications.' };
    }
};
