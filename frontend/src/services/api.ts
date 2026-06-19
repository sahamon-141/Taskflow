import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

// Create custom Axios instance
const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// Flag to avoid multiple refresh calls
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string | PromiseLike<string>) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

// Request interceptor: Attach accessToken if present in localStorage
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("taskflow_access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle expired token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Check if error is 401 Unauthorized and not already retried
    if (
      error.response &&
      error.response.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      // If we are already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("taskflow_refresh_token");
      if (!refreshToken) {
        // No refresh token, clear auth and redirect to login
        clearLocalAuth();
        return Promise.reject(error);
      }

      try {
        const response = await axios.post("http://localhost:8080/api/auth/refresh", {
          refreshToken,
        });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

        localStorage.setItem("taskflow_access_token", newAccessToken);
        localStorage.setItem("taskflow_refresh_token", newRefreshToken);

        processQueue(null, newAccessToken);

        // Update Authorization header on original request
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, process queue with error, clear auth, redirect to login
        processQueue(refreshError, null);
        clearLocalAuth();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

function clearLocalAuth() {
  localStorage.removeItem("taskflow_access_token");
  localStorage.removeItem("taskflow_refresh_token");
  localStorage.removeItem("taskflow_user_email");
  localStorage.removeItem("taskflow_user_name");
  
  if (typeof window !== "undefined") {
    // Only redirect if we're not already on the login page to avoid loops
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  }
}

export default api;
