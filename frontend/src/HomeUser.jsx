// frontend/src/HomeUser.jsx

import { useEffect, useState } from 'react';
import { getUserHome, createPost, getPosts } from './api'; // Importe les fonctions API nécessaires
import { useNavigate } from 'react-router-dom';

export default function HomeUser() {
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]); // Pour stocker les publications
  const [postContent, setPostContent] = useState(''); // Contenu texte du nouveau post
  const [selectedFile, setSelectedFile] = useState(null); // Fichier média sélectionné
  const [filePreview, setFilePreview] = useState(null); // URL de prévisualisation du fichier
  const [loading, setLoading] = useState(true);
  const [postLoading, setPostLoading] = useState(false); // Chargement lors de la création de post
  const [error, setError] = useState(null);
  const [postError, setPostError] = useState(null); // Erreur lors de la création de post

  const navigate = useNavigate();

  // --- Fonctions de récupération de données ---

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || role !== 'user') {
      navigate('/', { replace: true });
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // Récupérer les données de l'utilisateur
        const userResult = await getUserHome(token);
        if (userResult.success) {
          setUserData(userResult.data);
        } else {
          setError(userResult.message || 'Échec de la récupération des données utilisateur.');
          if (userResult.message && (userResult.message.includes('non autorisé') || userResult.message.includes('expirée'))) {
            handleLogout();
          }
        }

        // Récupérer toutes les publications
        const postsResult = await getPosts(token);
        if (postsResult.success) {
          setPosts(postsResult.posts);
        } else {
          setError(prevError => prevError ? `${prevError}\n${postsResult.message}` : postsResult.message);
          if (postsResult.message && (postsResult.message.includes('non autorisé') || postsResult.message.includes('expirée'))) {
            handleLogout();
          }
        }

      } catch (err) {
        console.error("Erreur lors du chargement de la page HomeUser:", err);
        setError("Erreur lors de la récupération des données. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Nettoyage de l'URL de prévisualisation lors du démontage du composant
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [navigate]);

  // --- Fonctions de gestion des posts ---

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Créer une URL de prévisualisation pour l'image/vidéo
      setFilePreview(URL.createObjectURL(file));
      setPostError(null);
    } else {
      setSelectedFile(null);
      setFilePreview(null);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setPostError(null);
    setPostLoading(true);

    if (!postContent.trim() && !selectedFile) {
      setPostError("Votre publication ne peut pas être vide.");
      setPostLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setPostError("Vous devez être connecté pour publier.");
      handleLogout();
      setPostLoading(false);
      return;
    }

    // Utilisation de FormData pour envoyer du texte et un fichier
    const formData = new FormData();
    formData.append('content', postContent);
    if (selectedFile) {
      formData.append('media', selectedFile); // 'media' doit correspondre au nom dans Multer sur le backend
    }

    try {
      const result = await createPost(formData, token);
      if (result.success) {
        setPostContent(''); // Vider le champ de texte
        setSelectedFile(null); // Réinitialiser le fichier sélectionné
        setFilePreview(null); // Supprimer la prévisualisation
        setPostError(null); // Effacer les erreurs de post précédentes

        // Ajouter la nouvelle publication au début du flux
        setPosts(prevPosts => [result.post, ...prevPosts]);
        console.log('Post créé:', result.post);
        // Si vous voulez un message de succès temporaire
        // alert(result.message); 
      } else {
        setPostError(result.message);
      }
    } catch (err) {
      console.error("Erreur lors de la création de la publication:", err);
      setPostError("Erreur lors de l'envoi de la publication. Veuillez réessayer.");
    } finally {
      setPostLoading(false);
    }
  };

  // --- Fonction de déconnexion ---

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/', { replace: true });
  };

  // --- Rendu conditionnel ---

  if (loading) {
    return <div className="dashboard-container">Chargement de votre espace personnel...</div>;
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <p className="error-message">{error}</p>
        <button onClick={handleLogout} className="logout-button">Retour à la connexion</button>
      </div>
    );
  }

  return (
    <div className="home-user-container"> {/* Nouveau conteneur pour la page HomeUser */}
      <div className="home-user-header">
        <h2>Bienvenue, {userData ? userData.pseudo : 'Utilisateur'} !</h2>
        <button onClick={handleLogout} className="logout-button">Déconnexion</button>
      </div>

      {/* Section de création de publication */}
      <div className="post-creation-card">
        <h3>Créer une publication</h3>
        <form onSubmit={handlePostSubmit} className="post-form">
          <textarea
            placeholder="Exprimez-vous, partagez vos idées..."
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            rows="3"
            disabled={postLoading}
          ></textarea>
          
          <div className="file-input-group">
            <label htmlFor="media-upload" className="file-input-label">
              <span role="img" aria-label="upload icon">📤</span> Ajouter une photo/vidéo
            </label>
            <input
              type="file"
              id="media-upload"
              name="media" // Important: doit correspondre à upload.single('media') dans Multer
              accept="image/*,video/*" // Filtre les types de fichiers acceptés
              onChange={handleFileChange}
              disabled={postLoading}
              style={{ display: 'none' }} // Cache l'input par défaut
            />
          </div>

          {filePreview && (
            <div className="file-preview">
              {selectedFile.type.startsWith('image/') ? (
                <img src={filePreview} alt="Prévisualisation" className="post-image-preview" />
              ) : (
                <video src={filePreview} controls className="post-video-preview"></video>
              )}
              <button type="button" onClick={() => { setSelectedFile(null); setFilePreview(null); }} className="clear-file-button">X</button>
            </div>
          )}

          <button type="submit" disabled={postLoading}>
            {postLoading ? 'Publication en cours...' : 'Publier'}
          </button>
          {postError && <p className="error-message">{postError}</p>}
        </form>
      </div>

      {/* Section d'affichage des publications (le fil d'actualité) */}
      <div className="posts-feed">
        <h3>Fil d'actualité</h3>
        {posts.length === 0 && !loading ? (
          <p>Aucune publication pour le moment. Soyez le premier à poster !</p>
        ) : (
          posts.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <span className="post-author">{post.pseudo || 'Utilisateur inconnu'}</span>
                <span className="post-date">{new Date(post.created_at).toLocaleString()}</span>
              </div>
              <p className="post-content">{post.content}</p>
              {post.media_url && post.media_type === 'image' && (
                <img src={`http://localhost:3001${post.media_url}`} alt="Post média" className="post-media-image" />
              )}
              {post.media_url && post.media_type === 'video' && (
                <video src={`http://localhost:3001${post.media_url}`} controls className="post-media-video"></video>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
}
