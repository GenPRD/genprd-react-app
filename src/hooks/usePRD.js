import { useState } from 'react';
import axios from 'axios';
import { useAuth } from './useAuth';
import { handleApiError } from '../utils/errorHandling';

export const usePRD = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();
  
  // Buat instance axios dengan base URL dan auth header
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    headers: {
      'Content-Type': 'application/json',
    },
    // PERBAIKAN: Hapus withCredentials karena kita menggunakan token dalam header
    // withCredentials: true
  });
  
  // Tambahkan interceptor untuk menyertakan token pada setiap request
  api.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      // Tambahkan timestamp untuk menghindari caching
      if (config.url.includes('?')) {
        config.url += `&_t=${Date.now()}`;
      } else {
        config.url += `?_t=${Date.now()}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor for better error handling
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.error('API request failed:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data
      });
      
      return Promise.reject(error);
    }
  );
  
  const getAllPRDs = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // Buat query params
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });
      
      const response = await api.get(`/prd${queryParams.toString() ? '?' + queryParams.toString() : ''}`);
      return response.data;
    } catch (err) {
      handleApiError(err, setError);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // getPRDById with retry mechanism
  const getPRDById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      // Tambahkan timestamp untuk mencegah caching
      const response = await api.get(`/prd/${id}`); 
      // Parameter timestamp sudah ditambahkan via interceptor
      
      return response.data;
    } catch (err) {
      console.error('Error fetching PRD:', err);
      
      const errorMsg = err.response?.data?.message || 'Failed to fetch PRD';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const getRecentPRDs = async (limit = 10) => {
    try {
      setLoading(true);
      setError(null);
      
      // Route benar sesuai dengan definisi di prd.routes.js
      const response = await api.get(`/prd/recent?limit=${limit}`);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch recent PRDs';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const createPRD = async (prdData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/prd', prdData);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create PRD';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const updatePRD = async (id, prdData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Ensure correct API endpoint based on your backend
      // If the API endpoint should be /prd/{id} and not /api/prds/{id}
      const response = await api.put(`/prd/${id}`, prdData);
      
      console.log('Update PRD response:', response.data);
      return response.data;
    } catch (err) {
      console.error('Error updating PRD:', {
        id,
        error: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      const errorMsg = err.response?.data?.message || 'Failed to update PRD';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const deletePRD = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      // Perbaiki path API
      const response = await api.delete(`/prd/${id}`);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete PRD';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const archivePRD = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      // Perbaiki path API - ganti dari /prd/${id}/archive menjadi:
      const response = await api.patch(`/prd/${id}/archive`);
      return response.data;
    } catch (err) {
      // Log detail error 
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        endpoint: `/prd/${id}/archive`, // atau endpoint yang sedang diakses
      });
      
      const errorMsg = err.response?.data?.message || 'Failed to archive PRD';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const togglePinPRD = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      // Perbaiki path API - ganti dari /prd/${id}/pin menjadi:
      const response = await api.patch(`/prd/${id}/pin`);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to toggle pin status';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const updatePRDStage = async (id, stage) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.patch(`/prd/${id}/stage`, { document_stage: stage });
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update PRD stage';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const downloadPRD = async (id, options = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams();
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value);
        }
      });
      
      const response = await api.get(`/prd/${id}/download${queryParams.toString() ? '?' + queryParams.toString() : ''}`);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to download PRD';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // PERBAIKAN: getDashboardStats tidak termasuk dalam prd.routes.js
  // Alih-alih menggunakan route /prd/dashboard, gunakan /dashboard sesuai index.js
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
    setLoading, // Expose setLoading function
    getAllPRDs,
    getPRDById,
    getRecentPRDs,
    createPRD,
    updatePRD,
    deletePRD,
    archivePRD,
    togglePinPRD,
    updatePRDStage,
    downloadPRD,
    getDashboardStats
  };
};
