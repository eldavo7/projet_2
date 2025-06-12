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
