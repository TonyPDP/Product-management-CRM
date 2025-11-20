// src/services/api.js

// Use environment variable or fallback to localhost for development
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const getToken = () => localStorage.getItem("token");
const setToken = (token) => localStorage.setItem("token", token);
const removeToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

const setUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

const apiCall = async (endpoint, options = {}) => {
  const token = getToken();

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);

    // Handle non-JSON responses (like HTML error pages)
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Non-JSON response received:", await response.text());
      throw new Error("Сервер вернул некорректный ответ");
    }

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        removeToken();
        window.location.href = "/";
        throw new Error("Сессия истекла. Пожалуйста, войдите снова");
      }
      const error = await response.json();
      throw new Error(error.error || "Что-то пошло не так");
    }

    return response.json();
  } catch (error) {
    // Handle network errors
    if (error.message === "Failed to fetch") {
      throw new Error("Не удалось подключиться к серверу. Проверьте подключение к интернету");
    }
    throw error;
  }
};

export const authAPI = {
  login: async (email, password) => {
    const data = await apiCall("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setToken(data.token);
    setUser(data.user);
    return data;
  },

  logout: () => {
    removeToken();
  },

  getCurrentUser: async () => {
    const cachedUser = getUser();
    if (cachedUser) return cachedUser;

    const user = await apiCall("/auth/me");
    setUser(user);
    return user;
  },

  isAuthenticated: () => !!getToken(),

  getStoredUser: () => getUser(),
};

export const productAPI = {
  getAll: () => apiCall("/products"),

  getById: (id) => apiCall(`/products/${id}`),

  create: (product) =>
    apiCall("/products", {
      method: "POST",
      body: JSON.stringify(product),
    }),

  update: (id, product) =>
    apiCall(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(product),
    }),

  delete: (id) =>
    apiCall(`/products/${id}`, {
      method: "DELETE",
    }),

  bulkDelete: (ids) =>
    apiCall("/products/bulk-delete", {
      method: "POST",
      body: JSON.stringify({ ids }),
    }),

  getStatistics: () => apiCall("/statistics"),
};

export const notificationAPI = {
  getAll: () => apiCall("/notifications"),

  markAsRead: (id) =>
    apiCall(`/notifications/${id}/read`, {
      method: "POST",
    }),

  markAllAsRead: () =>
    apiCall("/notifications/read-all", {
      method: "POST",
    }),
};