import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, setAuthTokens, clearAuthTokens, getStoredUser, setStoredUser } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = getStoredUser();
      const token = localStorage.getItem('access_token');
      
      if (storedUser && token) {
        setUser(storedUser);
      }
      setLoading(false);
    };
    
    initAuth();
  }, []);

  const register = async (data) => {
    const response = await authService.register(data);
    const { user: userData, access, refresh } = response.data;
    setAuthTokens(access, refresh);
    setStoredUser(userData);
    setUser(userData);
    return response.data;
  };

  const login = async (data) => {
    const response = await authService.login(data);
    const { user: userData, access, refresh } = response.data;
    setAuthTokens(access, refresh);
    setStoredUser(userData);
    setUser(userData);
    return response.data;
  };

  const logout = async () => {
    try {
      await authService.logout({ refresh: localStorage.getItem('refresh_token') });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthTokens();
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!user,
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