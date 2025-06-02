import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './useAuth';

// Base API client setup
const createApiClient = (token) => {
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  
  // Add request interceptor for token
  api.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Add timestamp to prevent caching
      const url = new URL(config.url, 'http://localhost');
      url.searchParams.append('_t', Date.now());
      config.url = url.pathname + url.search;
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  return api;
};

// Base hook for API operations
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();
  
  const api = createApiClient(token);
  
  const makeRequest = useCallback(async (requestFn) => {
    setLoading(true);
    setError(null);
    
    try {
      return await requestFn();
    } catch (err) {
      console.error('API request failed:', err.message);
      const errorMsg = err.response?.data?.message || 'API request failed';
      setError(errorMsg);
      throw err;
    }
  }, []);
  
  return { makeRequest, loading, error, setLoading, setError };
};

// Test API endpoint - no auth required
export const useTestAPI = () => {
  const { makeRequest, loading, error, setLoading, setError } = useApi();
  const { token } = useAuth();
  const api = createApiClient(token);

  const testConnection = async () => {
    try {
      const result = await makeRequest(async () => {
        const response = await api.get('/');
        return response.data;
      });
      return result;
    } catch (err) {
      console.error('Error in testConnection:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { testConnection, loading, error };
};

// Dashboard API calls
export const useDashboard = () => {
  const { makeRequest, loading, error, setLoading, setError } = useApi();
  const [dashboardData, setDashboardData] = useState(null);
  const { token } = useAuth();
  const api = createApiClient(token);

  console.log('📊 useDashboard state:', { loading, error, hasData: !!dashboardData });

  const getDashboard = async () => {
    console.log('📊 useDashboard: Calling getDashboard...');
    try {
      const data = await makeRequest(async () => {
        console.log('📊 useDashboard: makeRequest: Fetching /dashboard...');
        const response = await api.get('/dashboard');
        console.log('📊 useDashboard: makeRequest: Received response:', response.data);
        if (response.data && response.data.data) {
          return response.data.data;
        }
        console.warn('📊 useDashboard: makeRequest: Unexpected response structure', response.data);
        return {};
      });
      console.log('📊 useDashboard: makeRequest resolved with data:', data);
      setDashboardData(data);
      console.log('📊 useDashboard: setDashboardData called');
      return { status: 'success', data };
    } catch (err) {
      console.error('❌ Error in getDashboard fetch:', err);
      setDashboardData(null);
      throw err;
    } finally {
      console.log('📊 useDashboard: getDashboard finally block reached');
      setLoading(false);
      console.log('📊 useDashboard: setLoading(false) called');
    }
  };

  return { getDashboard, dashboardData, loading, error };
};

// User profile API calls
export const useUserProfile = () => {
  const { makeRequest, loading, error, setLoading } = useApi();
  const { token } = useAuth();
  const api = createApiClient(token);

  const getUserProfile = async () => {
    try {
      const result = await makeRequest(async () => {
        const response = await api.get('/users/profile');
        return response.data;
      });
      return result;
    } catch (err) {
      console.error('Error in getUserProfile fetch:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (profileData) => {
    try {
      const result = await makeRequest(async () => {
        const response = await api.put('/users/profile', profileData);
        return response.data;
      });
      return result;
    } catch (err) {
      console.error('Error in updateUserProfile fetch:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { getUserProfile, updateUserProfile, loading, error };
};

// Personnel API calls
export const usePersonnel = () => {
  const { makeRequest, loading, error, setLoading } = useApi();
  const { token } = useAuth();
  const api = createApiClient(token);

  const getAllPersonnel = async () => {
    try {
      const result = await makeRequest(async () => {
        const response = await api.get('/personnel');
        return response.data;
      });
      return result;
    } catch (err) {
      console.error('Error in getAllPersonnel fetch:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPersonnelById = async (id) => {
    try {
      const result = await makeRequest(async () => {
        const response = await api.get(`/personnel/${id}`);
        return response.data;
      });
      return result;
    } catch (err) {
      console.error('Error in getPersonnelById fetch:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createPersonnel = async (personnelData) => {
    try {
      const result = await makeRequest(async () => {
        const response = await api.post('/personnel', personnelData);
        return response.data;
      });
      return result;
    } catch (err) {
      console.error('Error in createPersonnel fetch:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePersonnel = async (id, personnelData) => {
    try {
      const result = await makeRequest(async () => {
        const response = await api.put(`/personnel/${id}`, personnelData);
        return response.data;
      });
      return result;
    } catch (err) {
      console.error('Error in updatePersonnel fetch:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePersonnel = async (id) => {
    try {
      const result = await makeRequest(async () => {
        const response = await api.delete(`/personnel/${id}`);
        return response.data;
      });
      return result;
    } catch (err) {
      console.error('Error in deletePersonnel fetch:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    getAllPersonnel,
    getPersonnelById,
    createPersonnel,
    updatePersonnel,
    deletePersonnel,
    loading,
    error
  };
};

// PRD API calls
export const usePRD = () => {
  const { makeRequest, loading, error, setLoading } = useApi();
  const { token } = useAuth();
  const api = createApiClient(token);

  const getAllPRDs = async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });
      
      const result = await makeRequest(async () => {
        // Konsistenkan path - gunakan /prd bukan /api/prds
        const response = await api.get(`/prd${queryParams.toString() ? '?' + queryParams.toString() : ''}`);
        return response.data;
      });
      return result;
    } catch (err) {
      console.error('Error in getAllPRDs fetch:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPRDById = async (id) => {
    try {
      const result = await makeRequest(async () => {
        const response = await api.get(`/prd/${id}`);
        return response.data;
      });
      return result;
    } catch (err) {
      console.error('Error in getPRDById fetch:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getRecentPRDs = async (limit = 10) => {
    try {
      const result = await makeRequest(async () => {
        const response = await api.get(`/prd/recent?limit=${limit}`);
        return response.data;
      });
      return result;
    } catch (err) {
      console.error('Error in getRecentPRDs fetch:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createPRD = async (prdData) => {
    try {
      const result = await makeRequest(async () => {
        // Konsistenkan path API
        const response = await api.post('/prd', prdData);
        return response.data;
      });
      return result;
    } catch (err) {
      console.error('Error in createPRD fetch:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePRD = async (id, prdData) => {
    try {
      const result = await makeRequest(async () => {
        // Konsistenkan path API
        const response = await api.put(`/prd/${id}`, prdData);
        return response.data;
      });
      return result;
    } catch (err) {
      console.error('Error in updatePRD fetch:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePRD = async (id) => {
    try {
      const result = await makeRequest(async () => {
        // Konsistenkan path API
        const response = await api.delete(`/prd/${id}`);
        return response.data;
      });
      return result;
    } catch (err) {
      console.error('Error in deletePRD fetch:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const archivePRD = async (id) => {
    try {
      const result = await makeRequest(async () => {
        // Konsistenkan path API
        const response = await api.patch(`/prd/${id}/archive`);
        return response.data;
      });
      return result;
    } catch (err) {
      console.error('Error in archivePRD fetch:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const togglePinPRD = async (id) => {
    try {
      const result = await makeRequest(async () => {
        const response = await api.patch(`/prd/${id}/pin`);
        return response.data;
      });
      return result;
    } catch (err) {
      console.error('Error in togglePinPRD fetch:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const updatePRDStage = async (id, stage) => {
    try {
      const result = await makeRequest(async () => {
        const response = await api.patch(`/prd/${id}/stage`, { document_stage: stage });
        return response.data;
      });
      return result;
    } catch (err) {
      console.error('Error in updatePRDStage fetch:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const downloadPRD = async (id, options = {}) => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value);
        }
      });
      
      const result = await makeRequest(async () => {
        const response = await api.get(`/prd/${id}/download${queryParams.toString() ? '?' + queryParams.toString() : ''}`);
        return response.data;
      });
      return result;
    } catch (err) {
      console.error('Error in downloadPRD fetch:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const getDashboardStats = async () => {
    try {
      const result = await makeRequest(async () => {
        const response = await api.get('/prd/dashboard');
        return response.data;
      });
      return result;
    } catch (err) {
      console.error('Error in getDashboardStats fetch:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
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
    getDashboardStats,
    loading,
    error,
    setLoading // Expose for PRDDetail to control loading state
  };
};