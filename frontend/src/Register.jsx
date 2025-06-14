// frontend/src/Register.jsx

import React, { useState } from 'react';
import { register } from './api'; // Importe la fonction d'inscription que nous venons de mettre à jour
import { useNavigate } from 'react-router-dom'; // Pour la navigation après inscription

export default function Register() {
  const [pseudo, setPseudo] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [adresse, setAdresse] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Pour vérifier la confirmation du mot de passe
  const [acceptCgu, setAcceptCgu] = useState(false); // État pour l'acceptation des CGU
  const [error, setError] = useState(null); // Pour afficher les messages d'erreur
  const [successMessage, setSuccessMessage] = useState(null); // Pour afficher les messages de succès

  const navigate = useNavigate(); // Initialisation du hook de navigation

  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page par défaut
    setError(null); // Réinitialise les messages d'erreur
    setSuccessMessage(null); // Réinitialise les messages de succès

    // Validations côté client avant d'envoyer au backend
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (!acceptCgu) {
      setError('Veuillez accepter les Conditions Générales d\'Utilisation pour vous inscrire.');
      return;
    }
    // Validation simple du format d'email côté client (le backend fait aussi cette validation)
    if (!/\S+@\S+\.\S+/.test(email)) {
        setError('Le format de l\'email est invalide.');
        return;
    }
    // Validation de la longueur minimale du mot de passe côté client
    if (password.length < 6) {
        setError('Le mot de passe doit contenir au moins 6 caractères.');
        return;
        // Vous pourriez ajouter d'autres validations ici (ex: caractères spéciaux, chiffres, majuscules)
    }

    // Crée l'objet des données utilisateur à envoyer au backend
    const userData = {
      pseudo,
      email,
      // Les champs 'telephone' et 'adresse' sont envoyés comme null si vides
      telephone: telephone || null, 
      adresse: adresse || null,     
      password,
      acceptCgu // Indique si les CGU ont été acceptées
    };

    try {
      // Appelle la fonction register de votre api.jsx
      const result = await register(userData);
      if (result.success) {
        setSuccessMessage(result.message); // Affiche le message de succès du backend
        // Redirige vers la page de connexion après un court délai
        setTimeout(() => {
          navigate('/'); // Redirige vers la page de connexion après l'inscription
        }, 2000); // Redirection après 2 secondes pour que l'utilisateur puisse lire le message
      } else {
        setError(result.message); // Affiche le message d'erreur du backend
      }
    } catch (err) {
      console.error('Erreur lors de l\'inscription:', err);
      setError('Erreur lors de l\'inscription. Veuillez réessayer. (Problème réseau ou serveur)');
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Inscription</h2>

        <input
          type="text"
          placeholder="Pseudo (ID unique)"
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
          required // Champ obligatoire
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required // Champ obligatoire
        />
        <input
          type="tel"
          placeholder="Téléphone (Optionnel)"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
        />
        <input
          type="text"
          placeholder="Adresse (Optionnel)"
          value={adresse}
          onChange={(e) => setAdresse(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required // Champ obligatoire
        />
        <input
          type="password"
          placeholder="Confirmer le mot de passe"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required // Champ obligatoire
        />

        {/* Case à cocher pour les Conditions Générales d'Utilisation */}
        <div className="form-group cgu-checkbox">
          <input
            type="checkbox"
            id="registerCgu"
            checked={acceptCgu}
            onChange={(e) => setAcceptCgu(e.target.checked)}
          />
          <label htmlFor="registerCgu">
            J'ai lu et j'accepte les 
            {/* Le lien navigue vers la route /conditions via React Router */}
            <a href="#" onClick={(e) => {
              e.preventDefault(); 
              navigate('/conditions'); 
            }}> Conditions Générales d'Utilisation</a>
          </label>
        </div>

        <button type="submit">S'inscrire</button>

        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        {/* Lien pour revenir à la page de connexion */}
        <p className="link-to-login">
          Déjà un compte ? <a href="#" onClick={() => navigate('/')}>Connectez-vous ici</a>
        </p>
      </form>
    </div>
  );
}
