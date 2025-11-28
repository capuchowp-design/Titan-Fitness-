import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; 
import TitanFitnessApp from './TitanFitnessApp'; // Importa seu componente principal

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <TitanFitnessApp />
  </React.StrictMode>
);
