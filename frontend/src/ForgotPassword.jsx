// frontend/src/ForgotPassword.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestPasswordReset } from './api'; 

// IMPORTANT: Assurez-vous que cette ligne utilise 'export default'
export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    if (!email) {
      setError("Veuillez entrer votre adresse email.");
      setLoading(false);
      return;
    }

    try {
      const result = await requestPasswordReset(email); 
      if (result.success) {
        // Le message est générique pour des raisons de sécurité (ne pas révéler si l'email existe)
        setMessage(result.message); 
        setEmail(''); // Vide le champ après l'envoi
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error("Erreur lors de la demande de mot de passe oublié:", err);
      setError("Une erreur est survenue lors de la demande. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Réutilise le style du conteneur de connexion
    <div className="login-container"> 
      {/* Réutilise le style du formulaire de connexion */}
      <form className="login-form" onSubmit={handleSubmit}> 
        <h2>Mot de passe oublié ?</h2>
        <p>Veuillez entrer votre adresse email. Si un compte correspondant existe, nous vous enverrons un lien pour réinitialiser votre mot de passe.</p>
        
        <input
          type="email"
          placeholder="Votre adresse email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading} // Désactive l'input pendant le chargement
        />
        
        <button type="submit" disabled={loading}>
          {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
        </button>
        
        {/* Affiche les messages de succès ou d'erreur */}
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        {/* Lien pour revenir à la page de connexion */}
        <p className="link-to-login">
          <a href="#" onClick={() => navigate('/')}>Retour à la connexion</a>
        </p>
      </form>
    </div>
  );
}
