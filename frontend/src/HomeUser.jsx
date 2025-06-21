// frontend/src/HomeUser.jsx

import { useEffect, useState } from 'react';
import { getUserHome } from './api'; 
import { useNavigate } from 'react-router-dom'; 

export default function HomeUser() {
  const [userData, setUserData] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token'); 
      if (!token) {
        navigate('/', { replace: true }); 
        return;
      }

      try {
        const result = await getUserHome(token); 
        if (result.success) {
          setUserData(result.data); 
        } else {
          setError(result.message || 'Échec de la récupération des données utilisateur.');
          if (result.message && (result.message.includes('non autorisé') || result.message.includes('expirée'))) {
            handleLogout(); 
          }
        }
      } catch (err) {
        console.error("Erreur lors du chargement de la page HomeUser:", err);
        setError("Erreur lors de la récupération des données utilisateur. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role'); 
    navigate('/', { replace: true });
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
        </div>
      ) : (
        <p>Aucune information utilisateur disponible.</p>
      )}

      <button onClick={handleLogout} className="logout-button">Déconnexion</button>
    </div>
  );
}
