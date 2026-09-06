import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Analysis from './pages/Analysis';
import Recommendations from './pages/Recommendations';
import Analytics from './pages/Analytics';
import ReportDetail from './pages/ReportDetail';
import './index.css';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} />
      
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/reports/:reportId" element={<ReportDetail />} />
        <Route path="/analysis/:reportId" element={<Analysis />} />
        <Route path="/recommendations/:reportId" element={<Recommendations />} />
        <Route path="/analytics/:reportId" element={<Analytics />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="page">
          <Navigation />
          <main className="page-content">
            <AppRoutes />
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;