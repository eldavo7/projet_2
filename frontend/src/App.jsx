// frontend/src/App.jsx

import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import Login from './Login';
import Register from './Register'; 
import HomeUser from './HomeUser'; 
import AdminDashboard from './AdminDashboard';
import Conditions from './assets/Conditions'; 

// Composant Wrapper pour les routes authentifiées et protégées par rôle
function PrivateRoute({ children, userRole, requiredRole }) {
  const navigate = useNavigate(); 

  useEffect(() => {
    // Si l'utilisateur n'est pas connecté du tout (rôle est null)
    if (!userRole) {
      navigate('/', { replace: true }); // Redirige vers la page de connexion
    } 
    // Si l'utilisateur est connecté mais n'a pas le rôle requis pour cette route
    else if (requiredRole && userRole !== requiredRole) {
      navigate('/home', { replace: true }); // Redirige vers la page d'accueil ou une page d'accès refusé
    }
  }, [userRole, requiredRole, navigate]); 

  return (userRole && (!requiredRole || userRole === requiredRole)) ? children : null;
}

export default function App() {
  // CORRECTION CRUCIALE ICI : Initialise le rôle à partir du localStorage
  // Cela permet de maintenir l'utilisateur connecté après un rafraîchissement de page
  const [role, setRole] = useState(localStorage.getItem('role') || null); 

  // Optionnel mais bonne pratique : synchroniser localStorage si le rôle change dynamiquement
  // (par ex., si un admin change le rôle d'un utilisateur sans re-login)
  useEffect(() => {
    if (role) {
      localStorage.setItem('role', role);
    } else {
      localStorage.removeItem('role');
    }
  }, [role]);

  const handleLoginSuccess = (userRole) => {
    setRole(userRole); 
    // La sauvegarde du token et du rôle dans localStorage est déjà gérée dans Login.jsx
  };

  return (
    // <Router> est dans main.jsx
    <Routes>
      <Route path="/" element={<Login onLogin={handleLoginSuccess} />} />
      <Route path="/register" element={<Register />} /> 
      <Route path="/conditions" element={<Conditions />} />

      <Route 
        path="/home" 
        element={
          <PrivateRoute userRole={role} requiredRole="user">
            <HomeUser />
          </PrivateRoute>
        } 
      />

      <Route 
        path="/admin" 
        element={
          <PrivateRoute userRole={role} requiredRole="admin">
            <AdminDashboard />
          </PrivateRoute>
        } 
      />

      <Route path="*" element={<p>Page non trouvée</p>} />
    </Routes>
  );
}
