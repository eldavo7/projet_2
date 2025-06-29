// frontend/src/Login.jsx

import { useState } from 'react';
import { login } from './api';
import { useNavigate } from 'react-router-dom'; 

// Avertissement: Supprimez l'importation de './style.css' ici.
// Elle sera importée globalement dans main.jsx.
// import './style.css'; 

export default function Login({ onLogin }) { 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [acceptCgu, setAcceptCgu] = useState(false); 
  const [error, setError] = useState(null);
  // État pour gérer la visibilité du mot de passe (défaut: caché)
  const [showPassword, setShowPassword] = useState(false); 

  const navigate = useNavigate(); 

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
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role); 

        onLogin(data.role); 
        
        if (data.role === 'admin') {
          navigate('/admin');
        } else if (data.role === 'user') {
          navigate('/home');
        } else {
          navigate('/'); 
        }
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
          placeholder="Nom d'utilisateur ou Email" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        
        {/* Conteneur pour le champ de mot de passe et le bouton toggle */}
        <div className="password-input-group">
          <input
            type={showPassword ? "text" : "password"} // Type change en fonction de showPassword
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {/* NOUVEAU/CORRIGÉ: Un seul bouton avec la logique et les icônes */}
          <span
            type="button" // Important: type="button" pour éviter la soumission du formulaire
            onClick={() => setShowPassword(!showPassword)} // Utilise directement setShowPassword
            className="toggle-password-visibility"
            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          >
            {/* Icônes: '⊘' par défaut (caché), '👁️' si visible */}
            {showPassword ? '👁️' : '⊘'} 
          </span>
        </div>

        <div className="form-group cgu-checkbox">
          <input
            type="checkbox"
            id="acceptCgu"
            checked={acceptCgu}
            onChange={(e) => setAcceptCgu(e.target.checked)}
          />
          <label htmlFor="acceptCgu">
            J'ai lu et j'accepte les <a href="#" onClick={(e) => {
              e.preventDefault(); 
              navigate('/conditions'); 
            }}>Conditions Générales d'Utilisation</a>
          </label>
        </div>

        <button type="submit">Se connecter</button>
        {error && <p className="error-message">{error}</p>}

        <p className="link-to-register">
          Pas encore de compte ? <a href="#" onClick={() => navigate('/register')}>Inscrivez-vous ici</a>
        </p>

        <p className="link-to-register"> 
          <a href="#" onClick={() => navigate('/forgot-password')}>Mot de passe perdu ?</a>
        </p>
      </form>
    </div>
  );
}
