import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePRD } from '../hooks/usePRD'
import { usePersonnel } from '../hooks/useApi'
import Layout from '../components/layout/Layout'

const PRDForm = () => {
  const navigate = useNavigate()
  const { createPRD, loading, error } = usePRD()
  const { getAllPersonnel } = usePersonnel()
  
  const [formData, setFormData] = useState({
    product_name: '',
    document_version: '1.0',
    project_overview: '',
    start_date: '',
    end_date: ''
  })
  const [formError, setFormError] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)

    if (!formData.product_name) {
      setFormError('Product name is required')
      return
    }

    if (!formData.project_overview) {
      setFormError('Project overview is required')
      return
    }

    try {
      const response = await createPRD({
        ...formData,
        generate_content: true
      })

      if (response.status === 'success') {
        navigate(`/prds/${response.data.id}`)
      } else {
        throw new Error(response.message || 'Failed to create PRD')
      }
    } catch (error) {
      setFormError(error.message || 'Failed to create PRD')
    }
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New PRD</h2>

            {formError && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="product_name" className="block text-sm font-medium text-gray-700">
                  Product Name
                </label>
                <input
                  type="text"
                  id="product_name"
                  name="product_name"
                  value={formData.product_name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label htmlFor="document_version" className="block text-sm font-medium text-gray-700">
                  Document Version
                </label>
                <input
                  type="text"
                  id="document_version"
                  name="document_version"
                  value={formData.document_version}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="project_overview" className="block text-sm font-medium text-gray-700">
                  Project Overview
                </label>
                <textarea
                  id="project_overview"
                  name="project_overview"
                  value={formData.project_overview}
                  onChange={handleInputChange}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Describe your project overview"
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="start_date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="end_date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating...' : 'Create PRD'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default PRDForm