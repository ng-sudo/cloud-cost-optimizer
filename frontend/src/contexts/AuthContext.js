import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('access_token');
      
      if (storedUser && token) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          localStorage.clear();
        }
      }
      setLoading(false);
    };
    
    initAuth();
  }, []);

  const login = async (email, password) => {
    const response = await authAPI.login({ email, password });
    const { user, access, refresh } = response.data;
    
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    
    setUser(user);
    return response.data;
  };

  const register = async (data) => {
    const response = await authAPI.register(data);
    const { user, access, refresh } = response.data;
    
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    
    setUser(user);
    return response.data;
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await authAPI.logout(refreshToken);
      }
    } catch (e) {
      // Ignore errors
    }
    
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};