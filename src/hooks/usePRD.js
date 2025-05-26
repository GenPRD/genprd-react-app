import { useState } from 'react'
import api from '../utils/api'

export const usePRD = () => {
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
