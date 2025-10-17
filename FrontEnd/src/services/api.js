import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000", 
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && token !== "undefined" && token !== "null") {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("authorUser");
      localStorage.removeItem("readerUser");
      
      const currentPath = window.location.pathname;
      console.log('🔐 401 Unauthorized - Redirecting from:', currentPath);
      
      if (currentPath.includes('/dashboard/author') || currentPath.includes('/author')) {
        window.location.href = "/login/author";
      } else if (currentPath.includes('/dashboard/reader') || currentPath.includes('/reader')) {
        window.location.href = "/login/reader";
      } else {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export const setAuthHeader = (token) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
};

export const jsonHeaders = (token) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

export default API;