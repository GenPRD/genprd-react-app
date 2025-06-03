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
      
      console.log('Updating PRD with data:', prdData); // Debug log
      
      const response = await api.put(`/prd/${id}`, prdData);
      
      console.log('Update PRD response:', response.data); // Debug log
      
      if (response.data?.status === 'success') {
        return response.data;
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (err) {
      console.error('Error updating PRD:', {
        id,
        error: err.message,
        response: err.response?.data,
        status: err.response?.status,
        data: prdData // Log the data we tried to send
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
      console.error('Error updating PRD stage:', err);
      const errorMsg = err.response?.data?.message || 'Failed to update PRD stage';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Perbarui fungsi downloadPRD untuk tidak lagi mengubah document_stage dan langsung trigger download
  const downloadPRD = async (id, options = {}) => {
    try {
      setLoading(true);
      setError(null); // Clear previous errors
      
      // Tambahkan parameter update_stage=false untuk mencegah perubahan stage
      const queryParams = new URLSearchParams({ update_stage: 'false', ...options });
      
      // Pertama, panggil API backend untuk mendapatkan URL unduhan
      const response = await api.get(`/prd/${id}/download?${queryParams.toString()}`);
      
      if (response.data?.status === 'success' && response.data?.data?.download_url) {
        const downloadUrl = response.data.data.download_url;
        const fileName = response.data.data.file_name || `prd_${id}.pdf`; // Gunakan nama file dari backend atau fallback

        // Kedua, ambil konten PDF dari URL unduhan
        console.log('Fetching PDF content from:', downloadUrl);
        const pdfResponse = await axios.get(downloadUrl, {
          responseType: 'blob', // Penting untuk mendapatkan data biner
        });
        console.log('PDF content fetched successfully.');

        // Ketiga, buat URL objek dari blob dan trigger unduhan
        const blob = new Blob([pdfResponse.data], { type: 'application/pdf' });
        const blobUrl = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);

        // Trigger unduhan
        link.click();

        // Bersihkan URL objek dan elemen link
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(link);

        console.log('Download triggered successfully.');
        // Kembalikan indikasi sukses sederhana, bukan data penuh dari backend
        return { status: 'success', message: 'Download triggered' };
      } else {
        // Handle case where backend call is successful but doesn't return a download URL
        const errorMessage = response.data?.message || 'Backend did not provide a download URL.';
        setError(errorMessage);
        throw new Error(errorMessage);
      }

    } catch (err) {
      console.error('Error in downloadPRD hook:', err);
      
      // Extract detailed error message from backend response if available
      const backendErrorMessage = err.response?.data?.message;
      const defaultErrorMessage = 'Failed to download PRD. Please try again later.';
      const errorMessage = backendErrorMessage || err.message || defaultErrorMessage;
      
      setError(errorMessage);
      throw err; // Re-throw the error so the component can catch it too
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
    setLoading,
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
