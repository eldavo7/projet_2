// frontend/src/api.jsx

const API_BASE_URL = 'http://localhost:3001/api'; // Assurez-vous que c'est le bon port et le bon chemin de votre backend

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

// NOUVEAU: Fonction pour demander un lien de réinitialisation de mot de passe
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
        // Le backend envoie toujours un message générique pour des raisons de sécurité,
        // même si l'email n'existe pas, pour ne pas révéler les adresses email enregistrées.
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

// NOUVEAU: Fonction pour réinitialiser le mot de passe avec un token
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

// NOUVEAU: Fonction pour récupérer les données spécifiques à l'utilisateur depuis le HomeUser
export const getUserHome = async (token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/users/dashboard`, { // Nouvelle route backend
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // IMPORTANT: Envoyez le token pour l'authentification
            },
        });
        const data = await response.json();
        if (response.ok) {
            // Le backend renvoie souvent les données dans une propriété 'data'
            return { success: true, data: data.data, message: data.message }; 
        } else {
            // Gérer les erreurs d'authentification (token invalide/expiré)
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

// Vous pouvez ajouter d'autres fonctions API ici si nécessaire
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
