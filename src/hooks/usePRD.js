import { useState } from 'react';
import axios from 'axios';
import { useAuth } from './useAuth';

export const usePRD = () => {
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
  
  const getAllPRDs = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });
      
      // Route benar: /prd tanpa prefix /api karena sudah ada di baseURL
      const response = await api.get(`/prd${queryParams.toString() ? '?' + queryParams.toString() : ''}`);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch PRDs';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const getPRDById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(`/prd/${id}`);
      return response.data;
    } catch (err) {
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
      
      const response = await api.put(`/prd/${id}`, prdData);
      return response.data;
    } catch (err) {
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
      
      const response = await api.patch(`/prd/${id}/archive`);
      return response.data;
    } catch (err) {
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
