import { useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from './useAuth';

// Base API client setup
// Create the client outside the hook, memoize it if token changes
const createApiClient = (token) => {
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  
  // Add request interceptor for token only once per client instance
  api.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Add timestamp to prevent caching
      const url = new URL(config.url, 'http://localhost'); // Use a base URL for URL constructor
      url.searchParams.append('_t', Date.now().toString()); // Ensure timestamp is a string
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
  
  // Use useMemo to create the API client only when the token changes
  const api = useMemo(() => createApiClient(token), [token]);
  
  // Memoize makeRequest to ensure stability
  const makeRequest = useCallback(async (requestFn) => {
    setLoading(true);
    setError(null); // Clear previous errors on new request
    
    try {
      // Execute the provided async function, passing the memoized api instance
      const result = await requestFn(api);
      // Do NOT set success state here, let the calling hook/component handle the result
      return result;
    } catch (err) {
      console.error('API request failed:', err.message);
      const errorMsg = err.response?.data?.message || 'API request failed';
      setError(errorMsg); // Set error state in the base hook
      throw err; // Re-throw to allow components to catch
    } finally {
      setLoading(false);
    }
  }, [api]); // `api` is a dependency because `requestFn` uses it
  
  // Expose setError for specific cases if needed, but generally prefer makeRequest handling
  return { makeRequest, loading, error, setLoading, setError };
};

// Test API endpoint - no auth required
export const useTestAPI = () => {
  const { makeRequest, loading, error } = useApi();

  const testConnection = useCallback(async () => {
    try {
      const result = await makeRequest(async (api) => {
        const response = await api.get('/');
        return response.data;
      });
      return result;
    } catch (err) {
      console.error('Error in testConnection:', err);
      throw err; // Re-throw the error
    }
  }, [makeRequest]); // Depend on makeRequest

  return { testConnection, loading, error };
};

// Dashboard API calls
export const useDashboard = () => {
  const { makeRequest, loading, error } = useApi();

  const [dashboardData, setDashboardData] = useState(null);

  console.log('📊 useDashboard state:', { loading, error, hasData: !!dashboardData });

  const getDashboard = useCallback(async () => {
    console.log('📊 useDashboard: Calling getDashboard...');
    try {
      const data = await makeRequest(async (api) => {
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
      setDashboardData(data); // Set data in the specific hook
      console.log('📊 useDashboard: setDashboardData called');
      return { status: 'success', data }; // Return success status and data
    } catch (err) {
      console.error('❌ Error in getDashboard fetch:', err);
      setDashboardData(null); // Clear data on error
      throw err; // Re-throw the error
    }
  }, [makeRequest]); // Depend on makeRequest

  return { getDashboard, dashboardData, loading, error };
};

// User profile API calls
export const useUserProfile = () => {
  const { makeRequest, loading, error } = useApi();

  const getUserProfile = useCallback(async () => {
    try {
      const result = await makeRequest(async (api) => {
        const response = await api.get('/users/profile');
        return response.data;
      });
      return result;
    } catch (err) {
      console.error('Error in getUserProfile fetch:', err);
      throw err; // Re-throw the error
    }
  }, [makeRequest]); // Depend on makeRequest

  const updateUserProfile = useCallback(async (profileData) => {
    try {
      const result = await makeRequest(async (api) => {
        const response = await api.put('/users/profile', profileData);
        return response.data;
      });
      return result;
    } catch (err) {
      console.error('Error in updateUserProfile fetch:', err);
      throw err; // Re-throw the error
    }
  }, [makeRequest]); // Depend on makeRequest

  return { getUserProfile, updateUserProfile, loading, error };
};

// Personnel API calls
export const usePersonnel = () => {
  const { makeRequest, loading, error } = useApi();

  const getAllPersonnel = useCallback(async () => {
    try {
      const result = await makeRequest(async (api) => {
        const response = await api.get('/personnel');
        return response.data;
      });
      return result;
    } catch (err) {
      console.error('Error in getAllPersonnel fetch:', err);
      throw err; // Re-throw the error
    }
  }, [makeRequest]); // Depend on makeRequest

  const getPersonnelById = useCallback(async (id) => {
    try {
      const result = await makeRequest(async (api) => {
        const response = await api.get(`/personnel/${id}`);
        return response.data;
      });
      return result;
    } catch (err) {
      console.error('Error in getPersonnelById fetch:', err);
      throw err; // Re-throw the error
    }
  }, [makeRequest]); // Depend on makeRequest

  const createPersonnel = useCallback(async (personnelData) => {
    try {
      const result = await makeRequest(async (api) => {
        const response = await api.post('/personnel', personnelData);
        return response.data;
      });
      return result;
    } catch (err) {
      console.error('Error in createPersonnel fetch:', err);
      throw err; // Re-throw the error
    }
  }, [makeRequest]); // Depend on makeRequest

  const updatePersonnel = useCallback(async (id, personnelData) => {
    try {
      const result = await makeRequest(async (api) => {
        const response = await api.put(`/personnel/${id}`, personnelData);
        return response.data;
      });
      return result;
    } catch (err) {
      console.error('Error in updatePersonnel fetch:', err);
      throw err; // Re-throw the error
    }
  }, [makeRequest]); // Depend on makeRequest

  const deletePersonnel = useCallback(async (id) => {
    try {
      const result = await makeRequest(async (api) => {
        const response = await api.delete(`/personnel/${id}`);
        return response.data;
      });
      return result;
    } catch (err) {
      console.error('Error in deletePersonnel fetch:', err);
      throw err; // Re-throw the error
    }
  }, [makeRequest]); // Depend on makeRequest

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

  const getAllPRDs = useCallback(async (filters = {}) => {
    try {
      const result = await makeRequest(async (api) => {
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, value);
          }
        });
        const response = await api.get(`/prd${queryParams.toString() ? '?' + queryParams.toString() : ''}`);
        return response.data;
      });
      return result;
    } catch (err) {
      console.error('Error in getAllPRDs fetch:', err);
      throw err; // Re-throw the error
    }
  }, [makeRequest]); // Depend on makeRequest

  const getPRDById = useCallback(async (id) => {
    try {
      const result = await makeRequest(async (api) => {
        const response = await api.get(`/prd/${id}`);
        return response.data;
      });
      return result;
    } catch (err) {
      console.error('Error in getPRDById fetch:', err);
      throw err; // Re-throw the error
    }
  }, [makeRequest]); // Depend on makeRequest

  const getRecentPRDs = useCallback(async (limit = 10) => {
    try {
      const result = await makeRequest(async (api) => {
        const response = await api.get(`/prd/recent?limit=${limit}`);
        return response.data;
      });
      return result;
    } catch (err) {
      console.error('Error in getRecentPRDs fetch:', err);
      throw err; // Re-throw the error
    }
  }, [makeRequest]); // Depend on makeRequest

  const createPRD = useCallback(async (prdData) => {
    try {
      const result = await makeRequest(async (api) => {
        const response = await api.post('/prd', prdData);
        return response.data;
      });
      return result;
    } catch (err) {
      console.error('Error in createPRD fetch:', err);
      throw err; // Re-throw the error
    }
  }, [makeRequest]); // Depend on makeRequest

  const updatePRD = useCallback(async (id, prdData) => {
    try {
      const result = await makeRequest(async (api) => {
        const response = await api.put(`/prd/${id}`, prdData);
        return response.data;
      });
      return result;
    } catch (err) {
      console.error('Error in updatePRD fetch:', err);
      throw err; // Re-throw the error
    }
  }, [makeRequest]); // Depend on makeRequest

  const deletePRD = useCallback(async (id) => {
    try {
      const result = await makeRequest(async (api) => {
        const response = await api.delete(`/prd/${id}`);
        return response.data;
      });
      return result;
    } catch (err) {
      console.error('Error in deletePRD fetch:', err);
      throw err; // Re-throw the error
    }
  }, [makeRequest]); // Depend on makeRequest

  const archivePRD = useCallback(async (id) => {
    try {
      const result = await makeRequest(async (api) => {
        const response = await api.patch(`/prd/${id}/archive`);
        return response.data;
      });
      return result;
    } catch (err) {
      console.error('Error in archivePRD fetch:', err);
      throw err; // Re-throw the error
    }
  }, [makeRequest]); // Depend on makeRequest
  
  const togglePinPRD = useCallback(async (id) => {
    try {
      const result = await makeRequest(async (api) => {
        const response = await api.patch(`/prd/${id}/pin`);
        return response.data;
      });
      return result;
    } catch (err) {
      console.error('Error in togglePinPRD fetch:', err);
      throw err; // Re-throw the error
    }
  }, [makeRequest]); // Depend on makeRequest
  
  const updatePRDStage = useCallback(async (id, stage) => {
    try {
      const result = await makeRequest(async (api) => {
        const response = await api.patch(`/prd/${id}/stage`, { document_stage: stage });
        return response.data;
      });
      return result;
    } catch (err) {
      console.error('Error in updatePRDStage fetch:', err);
      throw err; // Re-throw the error
    }
  }, [makeRequest]); // Depend on makeRequest

  const downloadPRD = useCallback(async (id, options = {}) => {
    try {
      const result = await makeRequest(async (api) => {
        const queryParams = new URLSearchParams();
        Object.entries(options).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, value);
          }
        });
        
        // First, call backend API to get the download URL
        const response = await api.get(`/prd/${id}/download${queryParams.toString() ? '?' + queryParams.toString() : ''}`);
        
        if (response.data?.status === 'success' && response.data?.data?.download_url) {
          const downloadUrl = response.data.data.download_url;
          const fileName = response.data.data.file_name || `prd_${id}.pdf`; // Use filename from backend or fallback

          // Second, fetch the PDF content from the download URL
          console.log('Fetching PDF content from:', downloadUrl);
          const pdfResponse = await axios.get(downloadUrl, {
            responseType: 'blob', // Important for getting binary data
          });
          console.log('PDF content fetched successfully.');

          // Third, create an object URL from the blob and trigger the download
          const blob = new Blob([pdfResponse.data], { type: 'application/pdf' });
          const blobUrl = window.URL.createObjectURL(blob);

          const link = document.createElement('a');
          link.href = blobUrl;
          link.setAttribute('download', fileName);
          document.body.appendChild(link);

          // Trigger the download
          link.click();

          // Clean up the object URL and the link element
          window.URL.revokeObjectURL(blobUrl);
          document.body.removeChild(link);

          console.log('Download triggered successfully.');
          // Return a simple success indication, not the full data from the backend
          return { status: 'success', message: 'Download triggered' };
        } else {
          // Handle case where backend call is successful but doesn't return a download URL
          const errorMessage = response.data?.message || 'Backend did not provide a download URL.';
          throw new Error(errorMessage);
        }

      });
      return result; // makeRequest already throws on error
    } catch (err) {
      console.error('Error in downloadPRD fetch:', err);
      // makeRequest has already set the error state
      throw err; // Re-throw to allow component to catch
    }
  }, [makeRequest]); // Depend on makeRequest
  
  const getDashboardStats = useCallback(async () => {
    try {
      const result = await makeRequest(async (api) => {
        const response = await api.get('/dashboard');
        return response.data;
      });
      return result;
    } catch (err) {
      console.error('Error in getDashboardStats fetch:', err);
      throw err; // Re-throw the error
    }
  }, [makeRequest]); // Depend on makeRequest

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