// frontend/src/ResetPassword.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resetUserPassword } from './api'; // NOUVEAU: Importation de la fonction API

export default function ResetPassword() {
  const { token } = useParams(); // Récupère le token depuis l'URL
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(true); // Pour vérifier la validité initiale du token

  const navigate = useNavigate();

  // Optionnel: Vérifier la validité du token si nécessaire au chargement de la page
  useEffect(() => {
    if (!token) {
      setError("Token de réinitialisation manquant.");
      setTokenValid(false);
    } 
    // Plus tard, vous pourriez faire un appel API ici pour valider le token sur le backend avant d'afficher le formulaire.
    // try {
    //   const response = await fetch(`/api/auth/validate-reset-token`, {
    //     method: 'POST', body: JSON.stringify({ token }), headers: { 'Content-Type': 'application/json' }
    //   });
    //   if (!response.ok) { setTokenValid(false); setError("Token invalide ou expiré."); }
    // } catch (err) { setTokenValid(false); setError("Erreur de validation du token."); }
  }, [token]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    if (!newPassword || !confirmNewPassword) {
      setError("Veuillez remplir tous les champs de mot de passe.");
      setLoading(false);
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }
    if (newPassword.length < 6) {
        setError("Le nouveau mot de passe doit contenir au moins 6 caractères.");
        setLoading(false);
        return;
    }

    try {
      const result = await resetUserPassword(token, newPassword); // Appel à la fonction API
      if (result.success) {
        setMessage(result.message + " Vous allez être redirigé vers la page de connexion.");
        setNewPassword('');
        setConfirmNewPassword('');
        setTimeout(() => {
          navigate('/'); // Redirige vers la page de connexion
        }, 3000); 
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error("Erreur lors de la réinitialisation du mot de passe:", err);
      setError("Une erreur est survenue lors de la réinitialisation. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="login-container">
        <div className="login-form">
          <h2>Erreur</h2>
          <p className="error-message">{error || "Ce lien de réinitialisation est invalide ou a expiré."}</p>
          <p className="link-to-login">
            <a href="#" onClick={() => navigate('/forgot-password')}>Demander un nouveau lien</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container"> {/* Réutilise le style du conteneur de connexion */}
      <form className="login-form" onSubmit={handleSubmit}> {/* Réutilise le style du formulaire de connexion */}
        <h2>Réinitialiser le mot de passe</h2>
        <p>Veuillez entrer et confirmer votre nouveau mot de passe.</p>
        
        <input
          type="password"
          placeholder="Nouveau mot de passe"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Confirmer le nouveau mot de passe"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          required
          disabled={loading}
        />
        
        <button type="submit" disabled={loading}>
          {loading ? 'Réinitialisation en cours...' : 'Réinitialiser le mot de passe'}
        </button>
        
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
}
