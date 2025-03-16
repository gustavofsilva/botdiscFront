import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Photos from './photos';
import MesaSom from './mesasom';

function App() {
  return (
    <div>

      {/* Defina as rotas */}
      <Routes>
        <Route path="/" element={<h2>Bem-vindo à página inicial!</h2>} />
        <Route path="/photos" element={<Photos />} />
        <Route path="/mesasom" element={<MesaSom />} />
      </Routes>
    </div>
  );
}

export default App;
