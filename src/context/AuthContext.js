import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../services/api";

const authAPI = {
  login: (email, password) =>
    fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }).then(r => r.json().then(data => ({ ok: r.ok, data }))),

  signup: (fullName, email, phone, password) =>
    fetch(`${BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, phone, password }),
    }).then(r => r.json().then(data => ({ ok: r.ok, data }))),

  getMe: async () => {
    const token = await AsyncStorage.getItem("authToken");

    if (!token) return { ok: false, data: {} };

    return fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(r => r.json().then(data => ({ ok: r.ok, data })));
  },
};

const tokenHelpers = {
  saveToken: (token) => AsyncStorage.setItem("authToken", token),
  getToken: () => AsyncStorage.getItem("authToken"),
  clearAll: () => AsyncStorage.multiRemove(["authToken", "userData"]),
  saveUser: (user) => AsyncStorage.setItem("userData", JSON.stringify(user)),
  getUser: () =>
    AsyncStorage.getItem("userData").then(data =>
      data ? JSON.parse(data) : null
    ),
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
        setToken(storedToken);
        setUser(storedUser);
      }
    } catch {
      await tokenHelpers.clearAll();
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ LOGIN

  const login = useCallback(async (email, password) => {
    setIsAuthenticating(true);

    try {
      const response = await authAPI.login(email, password);

      if (response.ok && response.data.success) {
        const newToken = response.data.token;

        await tokenHelpers.saveToken(newToken);

        const me = await authAPI.getMe();

        if (me.ok && me.data.success) {
          await tokenHelpers.saveUser(me.data.user);
          setUser(me.data.user);
          setToken(newToken);
          return { success: true };
        }
      }

      return { success: false, message: "Login failed" };

    } catch (e) {
      return { success: false, message: "Error" };
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  // ✅ SIGNUP (FIXED)

  const signup = useCallback(async (fullName, email, phone, password) => {
    setIsAuthenticating(true);
  
    try {
      const response = await authAPI.signup(
        fullName,
        email,
        phone,
        password
      );
  
      console.log("SIGNUP RESPONSE", response);
  
      if (response.ok && response.data.success) {
        const newToken = response.data.token;
  
        // save token only
        await tokenHelpers.saveToken(newToken);
  
        setToken(newToken);
  
        // DO NOT call /me here
        // user will be loaded later
  
        return { success: true };
      }
  
      return {
        success: false,
        message: response.data?.message || "Signup failed",
      };
  
    } catch (e) {
      console.log("SIGNUP ERROR", e);
      return { success: false, message: "Network error" };
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await tokenHelpers.clearAll();
    setToken(null);
    setUser(null);
  }, []);

  const value = {
    user,
    token,
    isLoading,
    isAuthenticating,
    isLoggedIn: !!token && !!user,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};