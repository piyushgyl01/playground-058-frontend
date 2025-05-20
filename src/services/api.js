import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3002/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["x-auth-token"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  login: (userData) => api.post("/auth/login", userData),
  getCurrentUser: () => api.get("/auth/me"),
};

export const profileAPI = {
  getProfile: () => api.get("/profile/me"),
  createProfile: (profileData) => api.post("/profile", profileData),
  updateProfile: (profileData) => api.post("/profile", profileData),
};

export const jobsAPI = {
  getJobs: () => api.get("/jobs"),
  getJobById: (id) => api.get(`/jobs/${id}`),
  getRecommendations: () => api.get("/recommendations"),
};

export default api;
