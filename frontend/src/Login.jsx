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
  // NOUVEAU: État pour gérer la visibilité du mot de passe (défaut: caché)
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
        // Stocke le token et le rôle dans le localStorage pour persister la connexion
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role); 

        onLogin(data.role); // Informe le composant parent (App.jsx) du rôle
        
        // Redirection vers les chemins de route corrects (en minuscules)
        if (data.role === 'admin') {
          navigate('/admin');
        } else if (data.role === 'user') {
          navigate('/home');
        } else {
          // Gérer un rôle inattendu si nécessaire
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
        
        {/* CORRIGÉ: Conteneur OBLIGATOIRE pour le champ de mot de passe et le bouton toggle */}
        {/* L'input et le bouton DOIVENT être dans cette div pour un positionnement CSS correct */}
        <div className="password-input-group">
          <input
            type={showPassword ? "text" : "password"} // Type change en fonction de showPassword
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button" // Important: type="button" pour éviter la soumission du formulaire
            onClick={() => setShowPassword(!showPassword)}
            className="toggle-password-visibility"
            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          >
            {/* Icônes basées sur l'image fournie (œil barré pour masqué, œil pour affiché) */}
            {showPassword ? '👁️' : '⊘'} 
          </button>
        </div>

        <div className="form-group cgu-checkbox">
          {/* CORRIGÉ: Retirer la classe 'form-group' du label, elle est déjà sur la div parente */}
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

      </form>
    </div>
  );
}
