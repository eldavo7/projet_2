// frontend/src/App.jsx

import { useState } from 'react';
import Login from './Login';
import HomeUser from './HomeUser';
import AdminDashboard from './AdminDashboard';
import Conditions from './assets/Conditions';

export default function App() {
  const [role, setRole] = useState(null);
  // NOUVEAU: État pour gérer quelle vue afficher quand l'utilisateur n'est pas connecté
  const [authScreen, setAuthScreen] = useState('login'); 

  // Fonction pour gérer la connexion réussie et réinitialiser la vue
  const handleLoginSuccess = (userRole) => {
    setRole(userRole);
    // Après connexion, on s'assure que la vue est 'login' au cas où l'utilisateur
    // serait sur la page des conditions avant de se connecter.
    setAuthScreen('login'); 
  };

  // NOUVEAU: Fonction pour passer à la vue des Conditions Générales d'Utilisation
  const handleViewCgu = () => {
    setAuthScreen('conditions');
  };

  // NOUVEAU: Fonction pour revenir à la vue de connexion
  const handleBackToLogin = () => {
    setAuthScreen('login');
  };

  if (!role) {
    // Si l'utilisateur n'est pas connecté, on décide quelle vue afficher
    if (authScreen === 'login') {
      // On passe une nouvelle prop 'onViewCgu' au composant Login
      return <Login onLogin={handleLoginSuccess} onViewCgu={handleViewCgu} />;
    } else if (authScreen === 'conditions') {
      // Si la vue est 'conditions', on affiche le composant Conditions
      // et on lui passe une prop 'onBackToLogin' pour revenir à la connexion
      return <Conditions onBackToLogin={handleBackToLogin} />;
    }
  }

  // Si un rôle est défini, affiche le tableau de bord approprié
  if (role === 'admin') {
    return <AdminDashboard />;
  }

  if (role === 'user') {
    return <HomeUser />;
  }

  // Cas de secours pour un rôle inconnu
  return <p>Rôle inconnu</p>;
}
