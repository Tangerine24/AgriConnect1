import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Check local storage for session
    const storedUser = localStorage.getItem('agriconnect_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user', e);
      }
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('agriconnect_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('agriconnect_user');
  };

  const googleLogin = async ({ email, name, role = 'farmer' }) => {
    const res = await axios.post('/api/auth/google', {
      email,
      name,
      googleId: `google-${Date.now()}`,
      role
    });
    login(res.data.user);
    return res.data.user;
  };

  const role = user?.role || 'guest';
  const isFarmer = role === 'farmer';
  const isBuyer = role === 'buyer';
  const isAdmin = role === 'admin';

  return (
    <AuthContext.Provider value={{
      user,
      role,
      isFarmer,
      isBuyer,
      isAdmin,
      login,
      logout,
      googleLogin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
