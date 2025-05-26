import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { usePRD } from '../hooks/usePRD'
import Layout from '../components/layout/Layout'
import { ArrowLeftIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

const PRDDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getPRDById, deletePRD, loading, error } = usePRD()
  const [prd, setPrd] = useState(null)

  useEffect(() => {
    fetchPRD()
  }, [id])

  const fetchPRD = async () => {
    try {
      const response = await getPRDById(id)
      if (response.status === 'success') {
        setPrd(response.data)
      }
    } catch (error) {
      console.error('Error fetching PRD:', error)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this PRD?')) {
      try {
        await deletePRD(id)
        navigate('/prds')
      } catch (error) {
        console.error('Error deleting PRD:', error)
      }
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-8">Loading...</div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center py-8 text-red-600">{error}</div>
      </Layout>
    )
  }

  if (!prd) {
    return (
      <Layout>
        <div className="text-center py-8">PRD not found</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/prds')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to PRDs
          </button>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{prd.product_name}</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Version {prd.document_version} • {prd.document_stage}
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => navigate(`/prds/${id}/edit`)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <PencilIcon className="w-5 h-5 mr-2" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                >
                  <TrashIcon className="w-5 h-5 mr-2" />
                  Delete
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Project Overview</h3>
                <p className="mt-2 text-gray-600 whitespace-pre-wrap">{prd.project_overview}</p>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Timeline</h3>
                  <dl className="mt-2 space-y-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Start Date</dt>
                      <dd className="mt-1 text-sm text-gray-900">{prd.start_date}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">End Date</dt>
                      <dd className="mt-1 text-sm text-gray-900">{prd.end_date}</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900">Document Info</h3>
                  <dl className="mt-2 space-y-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Created At</dt>
                      <dd className="mt-1 text-sm text-gray-900">{prd.created_at}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Updated At</dt>
                      <dd className="mt-1 text-sm text-gray-900">{prd.updated_at}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default PRDDetail