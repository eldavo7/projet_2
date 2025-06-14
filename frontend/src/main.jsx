import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
// NOUVEAU: Importez BrowserRouter ici pour envelopper toute l'application
import { BrowserRouter } from 'react-router-dom'; 
import './style.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* C'est ICI que nous enveloppons App avec BrowserRouter */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
