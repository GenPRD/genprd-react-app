import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: API_BASE_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  // Tambahkan withCredentials jika menggunakan cookies
  withCredentials: true
})

// Add request interceptor to include token from localStorage in every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor to handle token expiry
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // If error is 401 and not a retry request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Try to refresh token - customize this as per your API
        // const refreshResponse = await axios.post('/auth/refresh', {}, {
        //   withCredentials: true
        // });
        
        // If token refresh successful
        // const newToken = refreshResponse.data.token;
        // localStorage.setItem('auth_token', newToken);
        
        // Retry original request with new token
        // originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        // return api(originalRequest);
        
        // For now, just redirect to login
        console.warn('Session expired, redirecting to login...')
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
        window.location.href = '/login'
        
      } catch (refreshError) {
        // If refresh fails, redirect to login
        console.error('Failed to refresh authentication:', refreshError)
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default api