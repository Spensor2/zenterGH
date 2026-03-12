import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://zenter-backend-production.up.railway.app";
const API_TIMEOUT = 15000;

const request = async (endpoint, method = "GET", body = null, auth = true) => {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const token = await AsyncStorage.getItem("authToken");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT);
  config.signal = controller.signal;

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    clearTimeout(timeout);
    const data = await response.json();
    return { ok: response.ok, status: response.status, data };
  } catch (error) {
    clearTimeout(timeout);
    if (error.name === "AbortError") {
      return { ok: false, status: 0, data: { success: false, message: "Request timed out" } };
    }
    return { ok: false, status: 0, data: { success: false, message: "Network error. Check your connection." } };
  }
};

const authAPI = {
  login: (email, password) =>
    request("/api/auth/login", "POST", { email, password }, false),

  signup: (fullName, email, phone, password) =>
    request("/api/auth/signup", "POST", { fullName, email, phone, password }, false),

  googleAuth: (googleData) =>
    request("/api/auth/google", "POST", googleData, false),

  getMe: () =>
    request("/api/auth/me", "GET", null, true),

  health: () =>
    request("/api/auth/health", "GET", null, false),
};

const tokenHelpers = {
  saveToken: async (token) => await AsyncStorage.setItem("authToken", token),
  getToken: async () => await AsyncStorage.getItem("authToken"),
  removeToken: async () => await AsyncStorage.removeItem("authToken"),
  saveUser: async (user) => await AsyncStorage.setItem("userData", JSON.stringify(user)),
  getUser: async () => {
    const data = await AsyncStorage.getItem("userData");
    return data ? JSON.parse(data) : null;
  },
  removeUser: async () => await AsyncStorage.removeItem("userData"),
  clearAll: async () => await AsyncStorage.multiRemove(["authToken", "userData"]),
};

export { authAPI, tokenHelpers, BASE_URL };