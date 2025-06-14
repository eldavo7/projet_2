// frontend/src/HomeUser.jsx

import { useEffect, useState } from 'react';
import { getUserHome } from './api'; // Importe la fonction API pour la page utilisateur
import { useNavigate } from 'react-router-dom'; // Pour la redirection après déconnexion

export default function HomeUser() {
  const [userData, setUserData] = useState(null); // Pour stocker les données de l'utilisateur
  const [loading, setLoading] = useState(true); // État de chargement
  const [error, setError] = useState(null); // Pour gérer les erreurs

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token'); // Récupère le token JWT
      if (!token) {
        // Si pas de token, redirige vers la page de connexion
        navigate('/', { replace: true });
        return;
      }

      try {
        const result = await getUserHome(token); // Passe le token à la fonction API
        if (result.success) {
          setUserData(result.data); // Stocke toutes les données reçues (ex: { pseudo: "...", email: "..." })
        } else {
          setError(result.message || 'Échec de la récupération des données utilisateur.');
          // Si l'erreur est liée à l'authentification (ex: token invalide/expiré), redirige
          if (result.message && (result.message.includes('non autorisé') || result.message.includes('invalide'))) {
            handleLogout(); // Déconnecte l'utilisateur si le token est invalide
          }
        }
      } catch (err) {
        console.error("Erreur lors du chargement de la page HomeUser:", err);
        setError("Erreur lors de la récupération des données. Veuillez réessayer.");
      } finally {
        setLoading(false); // Arrête l'état de chargement
      }
    };

    fetchUserData();
  }, [navigate]); // Dépendance à navigate

  // Fonction de déconnexion
  const handleLogout = () => {
    localStorage.removeItem('token'); // Supprime le token du localStorage
    navigate('/', { replace: true }); // Redirige vers la page de connexion
  };

  if (loading) {
    return <div className="dashboard-container">Chargement des données utilisateur...</div>;
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
      <h2>Bienvenue sur votre espace, {userData ? userData.pseudo : 'Utilisateur'} !</h2>
      {userData ? (
        <div>
          <p>Email: {userData.email}</p>
          {userData.telephone && <p>Téléphone: {userData.telephone}</p>}
          {userData.adresse && <p>Adresse: {userData.adresse}</p>}
          {/* Vous pouvez afficher d'autres informations ici */}
        </div>
      ) : (
        <p>Aucune information utilisateur disponible.</p>
      )}

      <button onClick={handleLogout} className="logout-button">Déconnexion</button>
    </div>
  );
}
