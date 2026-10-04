import React from 'react';
import { NavLink, Link } from 'react-router-dom';

const navigationRoutes = [
  { path: '/products', label: 'Productos' },
  { path: '/providers', label: 'Proveedores' },
  { path: '/users', label: 'Usuarios' },
  { path: '/sales', label: 'Ventas' },
];

const NavigationBar = () => {
  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold text-uppercase tracking-wider" to="/">
          MarketSoft
        </Link>

        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#appNavbar"
          aria-controls="appNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="appNavbar">
          <ul className="navbar-nav ms-auto mb-2 mb-md-0 gap-md-1">
            {navigationRoutes.map(({ path, label }) => (
              <li className="nav-item" key={path}>
                <NavLink 
                  to={path} 
                  className={({ isActive }) => 
                    `nav-link px-3 ${isActive ? 'active fw-bold text-white' : 'text-white-50'}`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;