import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MonitorPlay, ClipboardList, PlusCircle, UserCheck } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Inicio', path: '/', icon: <MonitorPlay size={18} /> },
    { name: 'Nueva Incidencia', path: '/nueva-incidencia', icon: <PlusCircle size={18} /> },
    { name: 'Bandeja', path: '/bandeja', icon: <ClipboardList size={18} /> },
    { name: 'Mis Tareas', path: '/mis-tareas', icon: <UserCheck size={18} /> },
  ];

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <img src="/logo_full.svg" alt="SoftCorporation Logo" style={{ height: '34px', width: 'auto' }} />
      </Link>
      <div className="nav-links">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
