// frontend/src/Login.jsx

import { useState } from 'react';
import { login } from './api';

// NOUVEAU: Ajoutez 'onViewCgu' aux props
export default function Login({ onLogin, onViewCgu }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [acceptCgu, setAcceptCgu] = useState(false); 
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); 

    if (!acceptCgu) {
      setError("Veuillez accepter les Conditions Générales d'Utilisation pour vous connecter.");
      return; 
    }

    try {
      const data = await login(username, password);
      if (data.success) {
        onLogin(data.role);
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error("Erreur lors de la connexion:", err);
      setError("Une erreur est survenue lors de la tentative de connexion.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Connexion</h2>
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="form-group cgu-checkbox">
          <input
            type="checkbox"
            id="acceptCgu"
            checked={acceptCgu}
            onChange={(e) => setAcceptCgu(e.target.checked)}
          />
          <label htmlFor="acceptCgu">
            <a href="./assets/Conditions.jsx" className='cgu' target="_blank" onClick={(e) => {
              e.preventDefault(); // Empêche le comportement par défaut du lien (rechargement de la page)
              onViewCgu(); // Appelle la fonction passée par App.jsx pour changer l'écran
            }}> J'ai lu et j'accepte les Conditions Générales d'Utilisation</a>
          </label>
        </div>

        <button type="submit">Se connecter</button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
}
