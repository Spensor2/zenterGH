// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { authAPI, tokenHelpers } from '../../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await tokenHelpers.getToken();
        if (token) {
          const response = await authAPI.getMe();
          if (response.ok) {
            setUser(response.data);
          } else {
            await tokenHelpers.clearAll();
          }
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const signup = async (fullName, email, phone, password) => {
    setError(null);
    try {
      const response = await authAPI.signup(fullName, email, phone, password);
      if (response.ok) {
        await tokenHelpers.saveToken(response.data.token);
        await tokenHelpers.saveUser(response.data.user);
        setUser(response.data.user);
        return { success: true };
      } else {
        setError(response.data.error);
        return { success: false, error: response.data.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const login = async (email, password) => {
    setError(null);
    try {
      const response = await authAPI.login(email, password);
      if (response.ok) {
        await tokenHelpers.saveToken(response.data.token);
        await tokenHelpers.saveUser(response.data.user);
        setUser(response.data.user);
        return { success: true };
      } else {
        setError(response.data.error);
        return { success: false, error: response.data.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const logout = async () => {
    await tokenHelpers.clearAll();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

