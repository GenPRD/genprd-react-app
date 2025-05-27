import { ArrowLeftIcon, PencilIcon, TrashIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'

const PRDHeader = ({ prd, onEdit, onDelete, onDownload, isEditing }) => {
  const navigate = useNavigate()

  return (
    <div className="mb-6">
      <button
        onClick={() => navigate('/prds')}
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeftIcon className="w-5 h-5 mr-2" />
        Back to PRDs
      </button>

      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{prd.product_name}</h2>
          <p className="mt-1 text-sm text-gray-500">
            Version {prd.document_version} • {prd.document_stage}
          </p>
        </div>
        <div className="flex space-x-3">
          {!isEditing && (
            <>
              <button
                onClick={onEdit}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <PencilIcon className="w-5 h-5 mr-2" />
                Edit
              </button>
              <button
                onClick={onDownload}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                Download
              </button>
              <button
                onClick={onDelete}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                <TrashIcon className="w-5 h-5 mr-2" />
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default PRDHeader 