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
            // Stockez le token et/ou le rôle dans le localStorage ou un contexte global
            // Par exemple: localStorage.setItem('token', data.token);
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

// Fonction pour récupérer les données de la page HomeUser
export const getUserHome = async (token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/users/home`, { // Exemple de route backend
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Incluez le token JWT pour les requêtes protégées
            },
        });
        const data = await response.json();
        if (response.ok) {
            return { success: true, data: data };
        } else {
            return { success: false, message: data.message || 'Échec de la récupération des données utilisateur' };
        }
    } catch (error) {
        console.error('Erreur réseau ou du serveur lors de la récupération des données HomeUser:', error);
        return { success: false, message: 'Erreur: Impossible de joindre le serveur pour HomeUser.' };
    }
};

// Fonction pour récupérer les données du tableau de bord Admin
export const getAdminDashboard = async (token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/dashboard`, { // Exemple de route backend pour l'admin
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Incluez le token JWT pour les requêtes protégées
            },
        });
        const data = await response.json();
        if (response.ok) {
            return { success: true, data: data };
        } else {
            return { success: false, message: data.message || 'Échec de la récupération des données admin' };
        }
    } catch (error) {
        console.error('Erreur réseau ou du serveur lors de la récupération des données AdminDashboard:', error);
        return { success: false, message: 'Erreur: Impossible de joindre le serveur pour AdminDashboard.' };
    }
};

// Vous pouvez ajouter d'autres fonctions pour les users ou admin ici
// export const getProfile = async (token) => { ... };
