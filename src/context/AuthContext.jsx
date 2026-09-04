import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '@/utils/storageService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for active admin user session
    const activeUser = storageService.getAuthUser();
    if (activeUser) {
      setUser(activeUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = storageService.login(email, password);
      if (response && response.success && response.user) {
        setUser(response.user);
        return { success: true, user: response.user };
      }
      return { success: false, message: response?.message || 'Invalid email or password' };
    } catch (error) {
      return { success: false, message: error.message || 'Login failed' };
    }
  };

  const logout = () => {
    storageService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout }}>
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
