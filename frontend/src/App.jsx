/*
import { useState } from 'react';
import Login from './Login';
import HomeUser from './HomeUser';
import AdminDashboard from './AdminDashboard';

export default function App() {
  const [role, setRole] = useState(null);

  if (!role) {
    return <Login onLogin={setRole} />;
  }

  if (role === 'admin') {
    return <AdminDashboard />;
  }

  if (role === 'user') {
    return <HomeUser />;
  }

  return <p>Rôle inconnu</p>;
}
*/
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import HomeUser from './HomeUser';
import AdminDashboard from './AdminDashboard';
import Conditions from './assets/Conditions'; // à créer

export default function App() {
  const [role, setRole] = useState(null);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            !role ? (
              <Login onLogin={setRole} />
            ) : role === 'admin' ? (
              <AdminDashboard />
            ) : role === 'user' ? (
              <HomeUser />
            ) : (
              <p>Rôle inconnu</p>
            )
          }
        />
        <Route path="/conditions" element={<Conditions />} />
      </Routes>
    </Router>
  );
}
