import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom'; // 👈 Importación
import './styles.css'; 


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 👈 Envolvemos toda la App en el Router */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);