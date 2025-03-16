import React from 'react';
import { Routes, Route, Navigate  } from 'react-router-dom';
import Photos from './photos';
import MesaSom from './mesasom';

function App() {
  return (
    <div>

      <Routes> 
        <Route path="/" element={<Navigate to="/mesasom" />} />
        <Route path="/photos" element={<Photos />} />
        <Route path="/mesasom" element={<MesaSom />} />
      </Routes>
    </div>
  );
}

export default App;
