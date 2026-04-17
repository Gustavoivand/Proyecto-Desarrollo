import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RegistrarIncidencia from './pages/RegistrarIncidencia';
import BandejaIncidencias from './pages/BandejaIncidencias';
import DetalleIncidencia from './pages/DetalleIncidencia';
import MisTareas from './pages/MisTareas';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/nueva-incidencia" element={<RegistrarIncidencia />} />
            <Route path="/bandeja" element={<BandejaIncidencias />} />
            <Route path="/incidencia/:id" element={<DetalleIncidencia />} />
            <Route path="/mis-tareas" element={<MisTareas />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
