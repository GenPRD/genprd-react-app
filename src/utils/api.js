import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor to handle auth errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // Try to refresh the token
      const refreshToken = localStorage.getItem('refresh_token')
      if (refreshToken) {
        try {
          console.log('🔄 Attempting token refresh...')
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken
          })

          if (response.data.status === 'success') {
            const newToken = response.data.access_token
            localStorage.setItem('jwt_token', newToken)
            console.log('✅ Token refreshed successfully')

            // Retry the original request with new token
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            return api(originalRequest)
          }
        } catch (refreshError) {
          console.error('❌ Token refresh failed:', refreshError)
          // Refresh failed, redirect to login
          localStorage.removeItem('jwt_token')
          localStorage.removeItem('refresh_token')
          localStorage.removeItem('user_data')
          window.location.href = '/login?error=session_expired'
          return Promise.reject(refreshError)
        }
      }

      // No refresh token or refresh failed
      localStorage.removeItem('jwt_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user_data')
      window.location.href = '/login?error=unauthorized'
    }

    return Promise.reject(error)
  }
)

export default api