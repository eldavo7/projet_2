import { useEffect, useState } from 'react';
import { getAdminDashboard } from './api';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getAdminDashboard().then(data => setUsers(data));
  }, []);

  return (
    <div>
      <h2>Dashboard Admin</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.username} - {user.role}</li>
        ))}
      </ul>
    </div>
  );
}
