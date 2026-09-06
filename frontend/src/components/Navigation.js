import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './UI';

const Navigation = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Cloud Cost Optimizer
        </Link>
        
        <ul className="navbar-nav">
          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link to="/upload" className="nav-link">Upload Report</Link>
              </li>
              <li className="nav-item">
                <Link to="/analysis" className="nav-link">Cost Analysis</Link>
              </li>
              <li className="nav-item">
                <Link to="/recommendations" className="nav-link">Recommendations</Link>
              </li>
              <li className="nav-item">
                <Link to="/analytics" className="nav-link">Analytics</Link>
              </li>
              <li className="nav-item">
                <div className="user-menu">
                  <span className="nav-link user-name">
                    Hi, {user?.first_name || user?.username}
                  </span>
                  <button className="btn btn-outline btn-sm" onClick={logout}>
                    Logout
                  </button>
                </div>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link">Login</Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="btn btn-primary">Get Started</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;