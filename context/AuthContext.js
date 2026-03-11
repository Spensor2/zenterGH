import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authAPI, tokenHelpers } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // ── Check stored session on app launch ──
  useEffect(() => {
    checkStoredAuth();
  }, []);

  const checkStoredAuth = async () => {
    try {
      const storedToken = await tokenHelpers.getToken();
      const storedUser = await tokenHelpers.getUser();

      if (storedToken && storedUser) {
        // Validate token with server
        const response = await authAPI.getMe();

        if (response.ok && response.data.success) {
          setToken(storedToken);
          setUser(response.data.user);
        } else {
          // Token expired or invalid — clear
          await tokenHelpers.clearAll();
        }
      }
    } catch (error) {
      console.log("Auth check failed:", error);
      await tokenHelpers.clearAll();
    } finally {
      setIsLoading(false);
    }
  };

  // ── LOGIN ──
  const login = useCallback(async (email, password) => {
    setIsAuthenticating(true);
    try {
      const response = await authAPI.login(email, password);

      if (response.ok && response.data.success) {
        const { token: newToken, user: userData } = response.data;

        await tokenHelpers.saveToken(newToken);
        await tokenHelpers.saveUser(userData);

        setToken(newToken);
        setUser(userData);

        return { success: true, message: response.data.message };
      }

      return { success: false, message: response.data.message || "Login failed" };
    } catch (error) {
      return { success: false, message: "Something went wrong. Try again." };
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  // ── SIGNUP ──
  const signup = useCallback(async (fullName, email, phone, password) => {
    setIsAuthenticating(true);
    try {
      const response = await authAPI.signup(fullName, email, phone, password);

      if (response.ok && response.data.success) {
        const { token: newToken, user: userData } = response.data;

        await tokenHelpers.saveToken(newToken);
        await tokenHelpers.saveUser(userData);

        setToken(newToken);
        setUser(userData);

        return { success: true, message: response.data.message };
      }

      return { success: false, message: response.data.message || "Signup failed" };
    } catch (error) {
      return { success: false, message: "Something went wrong. Try again." };
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  // ── LOGOUT ──
  const logout = useCallback(async () => {
    await tokenHelpers.clearAll();
    setToken(null);
    setUser(null);
  }, []);

  // ── UPDATE USER locally ──
  const updateUser = useCallback(async (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    await tokenHelpers.saveUser(newUser);
  }, [user]);

  const value = {
    user,
    token,
    isLoading,
    isAuthenticating,
    isLoggedIn: !!token && !!user,
    login,
    signup,
    logout,
    updateUser,
    checkStoredAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;