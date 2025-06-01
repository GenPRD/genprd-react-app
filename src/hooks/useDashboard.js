import { useState } from 'react';
import axios from 'axios';
import { useAuth } from './useAuth';

export const useDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();
  
  // Buat instance axios dengan base URL dan auth header
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  
  // Tambahkan interceptor untuk menyertakan token pada setiap request
  api.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  const getDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/dashboard');
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch dashboard stats';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getDashboardStats
  };
};