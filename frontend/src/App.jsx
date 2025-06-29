// frontend/src/App.jsx

import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import Login from './Login';
import Register from './Register';
import HomeUser from './HomeUser'; 
import AdminDashboard from './AdminDashboard';
import Conditions from './assets/Conditions'; 
// Assurez-vous que ForgotPassword et ResetPassword utilisent 'export default' dans leurs fichiers
import ForgotPassword from './ForgotPassword'; 
import ResetPassword from './ResetPassword';   

// Composant Wrapper pour les routes authentifiées et protégées par rôle
function PrivateRoute({ children, userRole, requiredRole }) {
  const navigate = useNavigate(); 

  useEffect(() => {
    if (!userRole) {
      navigate('/', { replace: true }); 
    } else if (requiredRole && userRole !== requiredRole) {
      navigate('/home', { replace: true }); 
    }
  }, [userRole, requiredRole, navigate]); 

  return (userRole && (!requiredRole || userRole === requiredRole)) ? children : null;
}

export default function App() {
  const [role, setRole] = useState(localStorage.getItem('role') || null); 

  useEffect(() => {
    if (role) {
      localStorage.setItem('role', role);
    } else {
      localStorage.removeItem('role');
    }
  }, [role]);

  const handleLoginSuccess = (userRole) => {
    setRole(userRole); 
  };

  return (
    // Le <BrowserRouter> doit être dans main.jsx, PAS ici.
    <Routes>
      <Route path="/" element={<Login onLogin={handleLoginSuccess} />} />
      <Route path="/register" element={<Register />} /> 
      <Route path="/conditions" element={<Conditions />} />
      
      {/* Routes pour la réinitialisation de mot de passe */}
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} /> 

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
