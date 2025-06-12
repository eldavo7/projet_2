// frontend/src/App.jsx

import React, { useState, useEffect } from 'react';
// Importations de React Router : PAS de BrowserRouter ici, car il est dans main.jsx
import { Routes, Route, useNavigate } from 'react-router-dom';

import Login from './Login';
import HomeUser from './HomeUser'; // Vérifiez la faute de frappe ici : 'IomeUser' -> 'HomeUser'
import AdminDashboard from './AdminDashboard';
// Assurez-vous que le chemin est correct pour Conditions.jsx
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
      // Redirige vers la page d'accueil ou une page d'accès refusé
      navigate('/home', { replace: true }); 
    }
  }, [userRole, requiredRole, navigate]); 

  return (userRole && (!requiredRole || userRole === requiredRole)) ? children : null;
}

export default function App() {
  const [role, setRole] = useState(null); 

  const handleLoginSuccess = (userRole) => {
    setRole(userRole); 
  };

  return (
    // Pas de <BrowserRouter> ici, car il est dans main.jsx
    <Routes>
      <Route path="/" element={<Login onLogin={handleLoginSuccess} />} />
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
