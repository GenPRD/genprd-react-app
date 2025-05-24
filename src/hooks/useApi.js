import { useState } from 'react'
import api from '../utils/api'

// Generic API hook with loading states
export const useApi = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const makeRequest = async (requestFn) => {
    setLoading(true)
    setError(null)
    try {
      const result = await requestFn()
      return result
    } catch (err) {
      setError(err.message || 'An error occurred')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { makeRequest, loading, error, setError }
}

// Test API endpoint - no auth required
export const useTestAPI = () => {
  const { makeRequest, loading, error } = useApi()

  const testConnection = async () => {
    return makeRequest(async () => {
      const response = await api.get('/')
      return response.data
    })
  }

  return { testConnection, loading, error }
}

// Dashboard API calls
export const useDashboard = () => {
  const { makeRequest, loading, error } = useApi()

  const getDashboard = async () => {
    return makeRequest(async () => {
      const response = await api.get('/dashboard')
      return response.data
    })
  }

  return { getDashboard, loading, error }
}

// User profile API calls
export const useUserProfile = () => {
  const { makeRequest, loading, error } = useApi()

  const getUserProfile = async () => {
    return makeRequest(async () => {
      const response = await api.get('/users/profile')
      return response.data
    })
  }

  const updateUserProfile = async (profileData) => {
    return makeRequest(async () => {
      const response = await api.put('/users/profile', profileData)
      return response.data
    })
  }

  return { getUserProfile, updateUserProfile, loading, error }
}

// Personnel API calls
export const usePersonnel = () => {
  const { makeRequest, loading, error } = useApi()

  const getAllPersonnel = async () => {
    return makeRequest(async () => {
      const response = await api.get('/personnel')
      return response.data
    })
  }

  const getPersonnelById = async (id) => {
    return makeRequest(async () => {
      const response = await api.get(`/personnel/${id}`)
      return response.data
    })
  }

  const createPersonnel = async (personnelData) => {
    return makeRequest(async () => {
      const response = await api.post('/personnel', personnelData)
      return response.data
    })
  }

  const updatePersonnel = async (id, personnelData) => {
    return makeRequest(async () => {
      const response = await api.put(`/personnel/${id}`, personnelData)
      return response.data
    })
  }

  const deletePersonnel = async (id) => {
    return makeRequest(async () => {
      const response = await api.delete(`/personnel/${id}`)
      return response.data
    })
  }

  return {
    getAllPersonnel,
    getPersonnelById,
    createPersonnel,
    updatePersonnel,
    deletePersonnel,
    loading,
    error
  }
}

// PRD API calls
export const usePRD = () => {
  const { makeRequest, loading, error } = useApi()

  const getAllPRDs = async () => {
    return makeRequest(async () => {
      const response = await api.get('/prd')
      return response.data
    })
  }

  const getPRDById = async (id) => {
    return makeRequest(async () => {
      const response = await api.get(`/prd/${id}`)
      return response.data
    })
  }

  const createPRD = async (prdData) => {
    return makeRequest(async () => {
      const response = await api.post('/prd', prdData)
      return response.data
    })
  }

  const updatePRD = async (id, prdData) => {
    return makeRequest(async () => {
      const response = await api.put(`/prd/${id}`, prdData)
      return response.data
    })
  }

  const deletePRD = async (id) => {
    return makeRequest(async () => {
      const response = await api.delete(`/prd/${id}`)
      return response.data
    })
  }

  const archivePRD = async (id) => {
    return makeRequest(async () => {
      const response = await api.put(`/prd/${id}/archive`)
      return response.data
    })
  }

  const downloadPRD = async (id) => {
    return makeRequest(async () => {
      const response = await api.get(`/prd/${id}/download`)
      return response.data
    })
  }

  return {
    getAllPRDs,
    getPRDById,
    createPRD,
    updatePRD,
    deletePRD,
    archivePRD,
    downloadPRD,
    loading,
    error
  }
}