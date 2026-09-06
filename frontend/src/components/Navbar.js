import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 20V10M12 20V4M6 20v-6" />
            <path d="M2 20h20" />
          </svg>
          Cloud Cost Optimizer
        </Link>
        
        <div className="navbar-menu">
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/upload" className="nav-link">Upload Report</Link>
              <Link to="/analysis" className="nav-link">Cost Analysis</Link>
              <Link to="/recommendations" className="nav-link">Recommendations</Link>
              <Link to="/analytics" className="nav-link">Analytics</Link>
              <div className="nav-user">
                <span className="user-name">{user.first_name || user.username}</span>
                <button onClick={onLogout} className="btn btn-secondary btn-sm">Logout</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;