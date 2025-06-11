import { useEffect, useState } from 'react';
import { getUserHome } from './api';

export default function HomeUser() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    getUserHome().then(data => setMessage(data.message));
  }, []);

  return <h2>{message}</h2>;
}
