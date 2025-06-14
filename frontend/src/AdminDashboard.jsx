// frontend/src/AdminDashboard.jsx

import { useEffect, useState } from 'react';
import { getAdminDashboard } from './api'; // Importe la fonction API pour le tableau de bord admin
import { useNavigate } from 'react-router-dom'; // Pour la redirection après déconnexion

export default function AdminDashboard() {
  const [users, setUsers] = useState([]); // Pour stocker la liste des utilisateurs (exemple de données admin)
  const [loading, setLoading] = useState(true); // État de chargement
  const [error, setError] = useState(null); // Pour gérer les erreurs lors de la récupération des données

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      const token = localStorage.getItem('token'); // Récupère le token JWT du localStorage
      if (!token) {
        // Si pas de token, redirige vers la page de connexion
        navigate('/', { replace: true });
        return;
      }

      try {
        const result = await getAdminDashboard(token); // Passe le token à la fonction API
        console.log('Données reçues du backend pour AdminDashboard:', result); // Laissez le log pour le débogage

        if (result.success) {
          // CORRECTION ICI: Accédez à result.data.data pour obtenir le tableau d'utilisateurs
          setUsers(result.data.data || []); // Met à jour l'état avec les données d'utilisateurs
        } else {
          setError(result.message || 'Échec de la récupération des données admin.');
          // Si l'erreur est liée à l'authentification (ex: token invalide/expiré), redirige
          if (result.message && (result.message.includes('non autorisé') || result.message.includes('invalide'))) {
            handleLogout(); // Déconnecte l'utilisateur si le token est invalide
          }
        }
      } catch (err) {
        console.error("Erreur lors du chargement de l'Admin Dashboard:", err);
        setError("Erreur lors de la récupération des données. Veuillez réessayer.");
      } finally {
        setLoading(false); // Arrête l'état de chargement
      }
    };

    fetchAdminData();
  }, [navigate]); // Dépendance à navigate pour éviter les warnings

  // Fonction de déconnexion
  const handleLogout = () => {
    localStorage.removeItem('token'); // Supprime le token du localStorage
    // Vous pouvez aussi réinitialiser d'autres états globaux ici si nécessaire
    navigate('/', { replace: true }); // Redirige vers la page de connexion
  };

  if (loading) {
    return <div className="dashboard-container">Chargement du tableau de bord admin...</div>;
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <p className="error-message">{error}</p>
        <button onClick={handleLogout} className="logout-button">Retour à la connexion</button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h2>Tableau de Bord Administrateur</h2>
      <p>Bienvenue, Administrateur ! Voici la liste des utilisateurs enregistrés :</p>
      
      {users.length > 0 ? (
        <ul>
          {users.map(user => (
            // Assurez-vous que les propriétés 'id', 'pseudo', 'email', 'role' existent dans vos objets utilisateur
            <li key={user.id}>
              <strong>Pseudo:</strong> {user.pseudo} | 
              <strong> Email:</strong> {user.email} | 
              <strong> Rôle:</strong> {user.role}
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucun utilisateur enregistré trouvé.</p>
      )}

      <button onClick={handleLogout} className="logout-button">Déconnexion</button>
    </div>
  );
}
