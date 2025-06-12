// frontend/src/assets/Conditions.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom'; // NOUVEAU: Importation de useNavigate

// NOUVEAU: Le composant n'a plus besoin de la prop onBackToLogin
function Conditions() {
  const navigate = useNavigate(); // NOUVEAU: Initialisation du hook de navigation

  return (
    <div className="conditions-container">
      <h2>Conditions Générales d'Utilisation</h2>
      <p>Bienvenue sur notre application. En utilisant nos services, vous acceptez les présentes conditions générales d'utilisation...</p>
      <p>Voici les détails de nos CGU :</p>
      <ul>
        <li>Article 1: Objet des Conditions Générales d'Utilisation</li>
        <li>Article 2: Accès au service</li>
        <li>Article 3: Propriété intellectuelle</li>
        <li>Article 4: Données personnelles</li>
        <li>Article 5: Limitation de responsabilité</li>
        <li>Article 6: Modifications des CGU</li>
        <li>Article 7: Droit applicable et juridiction compétente</li>
      </ul>
      <p>Date de la dernière mise à jour : 12 juin 2025</p>

      {/* MODIFICATION: Utilisation de onClick avec navigate pour revenir à la route principale */}
      <button onClick={() => navigate('/')} className="back-button">
        Retour à la connexion
      </button>
    </div>
  );
}

export default Conditions;
