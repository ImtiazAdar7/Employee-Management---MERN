import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

/* 🔹 Attach access token */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* 🔹 Handle expired token */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Access token expired
    if (
      error.response?.status === 403 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        // Clear everything and redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(
          "http://localhost:5000/api/auth/refresh",
          { refreshToken }
        );

        // Store new tokens
        localStorage.setItem("accessToken", res.data.accessToken);
        
        // If backend sends new refresh token (token rotation), store it too
        if (res.data.refreshToken) {
          localStorage.setItem("refreshToken", res.data.refreshToken);
        }
        
        // Update authorization header
        originalRequest.headers.Authorization = "Bearer " + res.data.accessToken;

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - clear everything and redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;