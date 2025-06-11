import { useState } from 'react';
import { login } from './api';
import './style.css';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();

    if (!acceptTerms) {
      setError("Vous devez accepter les conditions générales d'utilisation.");
      return;
    }

    const data = await login(username, password, acceptTerms);
    if (data.success) {
      onLogin(data.role);
    } else {
      setError(data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Connexion</h2>

      <input
        placeholder="Nom d'utilisateur"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />

      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={acceptTerms}
          onChange={e => setAcceptTerms(e.target.checked)}
        />
        J’accepte les <a href="/conditions" target="_blank" rel="noopener noreferrer">Conditions Générales d’Utilisation</a>
      </label>

      <button type="submit">Se connecter</button>

      {error && <p className='error-message' style={{ color: 'red', marginTop: 10 }}>{error}</p>}
    </form>
  );
}
/*
import { useState } from 'react';
import { login } from './api';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    const data = await login(username, password);
    if (data.success) {
      onLogin(data.role);
    } else {
      setError(data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Connexion</h2>
      <input
        placeholder="Nom d'utilisateur"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button type="submit">Se connecter</button>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </form>
  );
}
*/