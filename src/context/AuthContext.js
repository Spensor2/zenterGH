import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../services/api";

const authAPI = {
  login: (email, password) => fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then(r => r.json().then(data => ({ ok: r.ok, data }))),

  signup: (fullName, email, phone, password) => fetch(`${BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fullName, email, phone, password }),
  }).then(r => r.json().then(data => ({ ok: r.ok, data }))),

  getMe: () => {
    const token = AsyncStorage.getItem("authToken");
    return token ? fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json().then(data => ({ ok: r.ok, data }))) : Promise.resolve({ ok: false, data: {} });
  }
};

const tokenHelpers = {
  saveToken: (token) => AsyncStorage.setItem("authToken", token),
  getToken: () => AsyncStorage.getItem("authToken"),
  clearAll: () => AsyncStorage.multiRemove(["authToken", "userData"]),
  saveUser: (user) => AsyncStorage.setItem("userData", JSON.stringify(user)),
  getUser: () => AsyncStorage.getItem("userData").then(data => data ? JSON.parse(data) : null),
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    checkStoredAuth();
  }, []);

  const checkStoredAuth = async () => {
    try {
      const storedToken = await tokenHelpers.getToken();
      const storedUser = await tokenHelpers.getUser();

      if (storedToken && storedUser) {
        const response = await authAPI.getMe();
        if (response.ok && response.data.success) {
          setToken(storedToken);
          setUser(response.data.user);
        } else {
          await tokenHelpers.clearAll();
        }
      }
    } catch (error) {
      await tokenHelpers.clearAll();
    } finally {
      setIsLoading(false);
    }
  };

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

  /* ── GOOGLE AUTH ── */
  const googleAuth = useCallback(async (googleData) => {
    setIsAuthenticating(true);
    try {
      const response = await authAPI.googleAuth(googleData);
      if (response.ok && response.data.success) {
        const { token: newToken, user: userData } = response.data;
        await tokenHelpers.saveToken(newToken);
        await tokenHelpers.saveUser(userData);
        setToken(newToken);
        setUser(userData);
        return { success: true, message: response.data.message };
      }
      return { success: false, message: response.data.message || "Google sign-in failed" };
    } catch (error) {
      return { success: false, message: "Something went wrong. Try again." };
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await tokenHelpers.clearAll();
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback(async (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    await tokenHelpers.saveUser(newUser);
  }, [user]);

  const value = {
    user, token, isLoading, isAuthenticating,
    isLoggedIn: !!token && !!user,
    login, signup, googleAuth, logout, updateUser, checkStoredAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export default AuthContext;