import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Add default class to body for theme
document.body.classList.add('light-mode');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
