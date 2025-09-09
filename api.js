import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Add auth token to requests if available
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axios;
