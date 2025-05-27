import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../utils/api'
import PRDHeader from '../components/prd/PRDHeader'
import { 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Grid,
  Chip,
  IconButton,
  Divider,
  Stack
} from '@mui/material'
import { 
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Archive as ArchiveBoxIcon
} from '@mui/icons-material'
import { PencilSquareIcon, ArrowDownTrayIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline'
import { TrashIcon as TrashIconOutline } from '@heroicons/react/24/outline';
import { usePRD } from '../hooks/usePRD'

// Add helper function for date formatting
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const calculateDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return 'N/A'
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end - start)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return `${diffDays} days`
}

const PRDDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { archivePRD } = usePRD()
  const [prd, setPRD] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(null)
    api.get(`/prd/${id}`)
      .then(res => {
        if (res.data.status === 'success') {
          setPRD(res.data.data)
          console.log('PRD detail loaded:', res.data.data)
        } else {
          setError('PRD not found')
        }
      })
      .catch(err => setError(err.message || 'Failed to fetch PRD'))
      .finally(() => setLoading(false))
  }, [id])

  const handleChange = (field, value) => {
    setPRD(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    try {
      setSaveError(null)
      const updated = await api.put(`/prd/${id}`, prd)
      setIsEditing(false)
      if (updated?.data?.data) setPRD(updated.data.data)
    } catch (err) {
      setSaveError(err.message || 'Failed to save changes')
    }
  }

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/prd/${id}`)
        navigate('/prds')
    } catch (err) {
      console.error('Error deleting PRD:', err)
    } finally {
      setShowDeleteModal(false);
    }
  }

  const handleDownload = async () => {
    try {
      const response = await api.get(`/prd/${id}/download`, { responseType: 'blob' })
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'prd.pdf';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error downloading PRD:', err)
    }
  }

  const handleArchiveClick = async () => {
    try {
      await archivePRD(id);
      setPRD(prev => ({ ...prev, document_stage: 'archived' }));
    } catch (error) {
      console.error('Error archiving PRD:', error);
    }
  };

  const handleSectionChange = (section, idx, field, value) => {
    setPRD(prev => {
      const updated = { ...prev }
      if (!updated.generated_sections) updated.generated_sections = {}
      if (!updated.generated_sections[section]) {
        if (section === 'overview') updated.generated_sections[section] = { sections: [] }
        else if (section === 'darci') updated.generated_sections[section] = { roles: [] }
        else if (section === 'user_stories') updated.generated_sections[section] = { stories: [] }
        else if (section === 'success_metrics') updated.generated_sections[section] = { metrics: [] }
        else if (section === 'project_timeline') updated.generated_sections[section] = { phases: [] }
      }
      let arrKey =
        section === 'overview' ? 'sections' :
        section === 'darci' ? 'roles' :
        section === 'user_stories' ? 'stories' :
        section === 'success_metrics' ? 'metrics' :
        section === 'project_timeline' ? 'phases' : ''
      if (!arrKey) return updated
      const arr = [...(updated.generated_sections[section][arrKey] || [])]
      arr[idx] = { ...arr[idx], [field]: value }
      updated.generated_sections[section][arrKey] = arr
      return updated
    })
  }

  const handleAddSection = (section) => {
    setPRD(prev => {
      const updated = { ...prev }
      if (!updated.generated_sections) updated.generated_sections = {}
      if (!updated.generated_sections[section]) {
        if (section === 'overview') updated.generated_sections[section] = { sections: [] }
        else if (section === 'darci') updated.generated_sections[section] = { roles: [] }
        else if (section === 'user_stories') updated.generated_sections[section] = { stories: [] }
        else if (section === 'success_metrics') updated.generated_sections[section] = { metrics: [] }
        else if (section === 'project_timeline') updated.generated_sections[section] = { phases: [] }
      }
      let arrKey =
        section === 'overview' ? 'sections' :
        section === 'darci' ? 'roles' :
        section === 'user_stories' ? 'stories' :
        section === 'success_metrics' ? 'metrics' :
        section === 'project_timeline' ? 'phases' : ''
      if (!arrKey) return updated
      const arr = [...(updated.generated_sections[section][arrKey] || [])]
      let newItem = {}
      if (section === 'overview') newItem = { title: '', content: '' }
      if (section === 'darci') newItem = { name: '', members: [], guidelines: '' }
      if (section === 'user_stories') newItem = { title: '', priority: '', user_story: '', acceptance_criteria: '' }
      if (section === 'success_metrics') newItem = { name: '', target: '', current: '', definition: '' }
      if (section === 'project_timeline') newItem = { pic: '', activity: '', time_period: '' }
      arr.push(newItem)
      updated.generated_sections[section][arrKey] = arr
      return updated
    })
  }

  const handleRemoveSection = (section, idx) => {
    setPRD(prev => {
      const updated = { ...prev }
      if (!updated.generated_sections || !updated.generated_sections[section]) return updated
      let arrKey =
        section === 'overview' ? 'sections' :
        section === 'darci' ? 'roles' :
        section === 'user_stories' ? 'stories' :
        section === 'success_metrics' ? 'metrics' :
        section === 'project_timeline' ? 'phases' : ''
      if (!arrKey) return updated
      const arr = [...(updated.generated_sections[section][arrKey] || [])]
      arr.splice(idx, 1)
      updated.generated_sections[section][arrKey] = arr
      return updated
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error || !prd) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Error</h2>
            <p className="mt-2 text-gray-600">{error || 'PRD not found'}</p>
            <button
              onClick={() => navigate('/prds')}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Back to PRDs
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{prd.product_name}</h2>
        <Link to="/prds" className="btn-secondary">Back to PRDs</Link>
        </div>
      <div className="bg-white rounded-xl shadow p-8 md:p-10 relative">
        <div className="flex items-center mb-6 justify-between">
          <div className="flex items-center flex-1 min-w-0">
            {isEditing ? (
              <input
                className="text-3xl font-bold text-gray-900 flex-1 border-b border-gray-200 focus:outline-none focus:border-gray-900 bg-gray-50 px-2 py-1"
                value={prd.product_name}
                onChange={e => handleChange('product_name', e.target.value)}
              />
            ) : (
              <h1 className="text-3xl font-bold text-gray-900 flex-1 truncate">{prd.product_name}</h1>
            )}
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-4 mr-2 ${
              prd.document_stage === 'draft' ? 'bg-gray-100 text-gray-800' :
              prd.document_stage === 'inprogress' ? 'bg-gray-200 text-gray-900' :
              prd.document_stage === 'finished' ? 'bg-green-100 text-green-800' :
              prd.document_stage === 'archived' ? 'bg-purple-100 text-purple-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {prd.document_stage}
            </span>
            <span className="text-xs text-gray-500 mr-4">Version {prd.document_version}</span>
              </div>
          <div className="flex items-center space-x-2">
            {!isEditing && (
              <>
                <button onClick={() => setIsEditing(true)} title="Edit" className="p-2 hover:bg-gray-100 rounded">
                  <PencilSquareIcon className="w-5 h-5 text-gray-500" />
                </button>
                <button onClick={handleDownload} title="Download" className="p-2 hover:bg-gray-100 rounded">
                  <ArrowDownTrayIcon className="w-5 h-5 text-gray-500" />
                </button>
                <button onClick={handleDeleteClick} title="Delete" className="p-2 hover:bg-gray-100 rounded">
                  <TrashIcon className="w-5 h-5 text-red-500" />
                </button>
                {prd.document_stage !== 'archived' && (
                  <button onClick={handleArchiveClick} title="Archive" className="p-2 text-gray-400 hover:text-purple-600 rounded">
                    <ArchiveBoxIcon className="w-5 h-5" />
                  </button>
                )}
              </>
            )}
            {isEditing && (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="btn-secondary"
                  type="button"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-gray-900 hover:bg-gray-800 text-white rounded-md shadow-sm px-4 py-2 text-sm font-medium"
                  type="button"
                >
                  Save Changes
                </button>
              </>
            )}
              </div>
            </div>

        <div className="mb-8">
          <div className="font-semibold text-gray-700 text-base mb-2">PRD Identity</div>
          {isEditing ? (
            <table className="w-full text-sm text-left text-gray-700 border border-gray-200 rounded bg-white">
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-2 pr-2 font-medium w-32 border-r border-gray-100">Start Date</td>
                  <td className="py-2 pr-4 border-r border-gray-100">
                    <input type="date" className="border rounded px-2 py-1" value={prd.start_date || ''} onChange={e => handleChange('start_date', e.target.value)} />
                  </td>
                  <td className="py-2 pr-2 font-medium w-32 border-r border-gray-100">End Date</td>
                  <td className="py-2">
                    <input type="date" className="border rounded px-2 py-1" value={prd.end_date || ''} onChange={e => handleChange('end_date', e.target.value)} />
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 pr-2 font-medium border-r border-gray-100">Duration</td>
                  <td className="py-2 pr-4 border-r border-gray-100">{calculateDuration(prd.start_date, prd.end_date)}</td>
                  <td className="py-2 pr-2 font-medium border-r border-gray-100">Owners</td>
                  <td className="py-2">
                    <input type="text" className="border rounded px-2 py-1 w-full" value={prd.document_owners?.join(', ') || ''} onChange={e => handleChange('document_owners', e.target.value.split(',').map(s => s.trim()))} />
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-2 font-medium border-r border-gray-100">Developers</td>
                  <td className="py-2 pr-4 border-r border-gray-100">
                    <input type="text" className="border rounded px-2 py-1 w-full" value={prd.developers?.join(', ') || ''} onChange={e => handleChange('developers', e.target.value.split(',').map(s => s.trim()))} />
                  </td>
                  <td className="py-2 pr-2 font-medium border-r border-gray-100">Stakeholders</td>
                  <td className="py-2">
                    <input type="text" className="border rounded px-2 py-1 w-full" value={prd.stakeholders?.join(', ') || ''} onChange={e => handleChange('stakeholders', e.target.value.split(',').map(s => s.trim()))} />
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            <table className="w-full text-sm text-left text-gray-700 border border-gray-200 rounded bg-white">
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-2 pr-2 font-medium w-32 border-r border-gray-100">Start Date</td>
                  <td className="py-2 pr-4 border-r border-gray-100">{formatDate(prd.start_date)}</td>
                  <td className="py-2 pr-2 font-medium w-32 border-r border-gray-100">End Date</td>
                  <td className="py-2">{formatDate(prd.end_date)}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 pr-2 font-medium border-r border-gray-100">Duration</td>
                  <td className="py-2 pr-4 border-r border-gray-100">{calculateDuration(prd.start_date, prd.end_date)}</td>
                  <td className="py-2 pr-2 font-medium border-r border-gray-100">Owners</td>
                  <td className="py-2">{prd.document_owners?.join(', ') || '-'}</td>
                </tr>
                <tr>
                  <td className="py-2 pr-2 font-medium border-r border-gray-100">Developers</td>
                  <td className="py-2 pr-4 border-r border-gray-100">{prd.developers?.join(', ') || '-'}</td>
                  <td className="py-2 pr-2 font-medium border-r border-gray-100">Stakeholders</td>
                  <td className="py-2">{prd.stakeholders?.join(', ') || '-'}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>

        <div className="mb-8">
          <div className="font-semibold text-gray-700 text-base mb-2">Project Overview</div>
          {isEditing ? (
            <textarea className="w-full border rounded px-2 py-1 mb-4" value={prd.project_overview || ''} onChange={e => handleChange('project_overview', e.target.value)} />
          ) : (
            <div className="text-base text-gray-900 mb-4 whitespace-pre-line">{prd.project_overview}</div>
          )}
          {prd.generated_sections?.overview?.sections && (
            <>
              {prd.generated_sections.overview.sections
                .filter(section => ['Objective', 'Problem Statement'].includes(section.title))
                .map((section, idx) => (
                  <div key={idx} className="mb-4">
                    <div className="font-semibold text-gray-700 text-base mb-1">{section.title}</div>
                    {isEditing ? (
                      <textarea className="w-full border rounded px-2 py-1" value={section.content || ''} onChange={e => handleSectionChange('overview', idx, 'content', e.target.value)} />
                    ) : (
                      <div className="text-base text-gray-900 whitespace-pre-line">{section.content}</div>
                    )}
                  </div>
                ))}
              {isEditing && (
                <button className="btn-secondary mt-2 inline-flex items-center" onClick={() => handleAddSection('overview')}>
                  <PlusIcon className="w-5 h-5 mr-2" />Add Section
                </button>
              )}
            </>
          )}
        </div>

        {prd.generated_sections?.darci?.roles && (
          <div className="mb-8">
            <div className="font-semibold text-gray-700 text-base mb-2">DARCI Roles</div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left text-gray-700 border border-gray-200 rounded bg-white">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-2 px-2 font-semibold border-r border-gray-200 text-base">Role</th>
                    <th className="py-2 px-2 font-semibold border-r border-gray-200 text-base">Members</th>
                    <th className="py-2 px-2 font-semibold text-base">Guidelines</th>
                  </tr>
                </thead>
                <tbody>
                  {['decider','accountable','responsible','consulted','informed'].map(roleType => {
                    const role = prd.generated_sections.darci.roles.find(r => r.name === roleType) || { name: roleType, members: [], guidelines: '' }
                    return (
                      <tr key={roleType} className="border-t border-gray-200">
                        <td className="py-2 px-2 font-medium capitalize border-r border-gray-200">{roleType.charAt(0).toUpperCase() + roleType.slice(1)}</td>
                        <td className="py-2 px-2 border-r border-gray-200">
                          {isEditing ? (
                            <input className="border rounded px-2 py-1 w-full" value={role.members?.join(', ') || ''} onChange={e => handleSectionChange('darci', prd.generated_sections.darci.roles.findIndex(r => r.name === roleType), 'members', e.target.value.split(',').map(s => s.trim()))} />
                          ) : role.members?.join(', ')}
                        </td>
                        <td className="py-2 px-2 text-gray-600">
                          {isEditing ? (
                            <input className="border rounded px-2 py-1 w-full" value={role.guidelines || ''} onChange={e => handleSectionChange('darci', prd.generated_sections.darci.roles.findIndex(r => r.name === roleType), 'guidelines', e.target.value)} />
                          ) : role.guidelines}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {prd.generated_sections?.user_stories?.stories && (
          <div className="mb-8">
            <div className="font-semibold text-gray-700 text-base mb-2">User Stories</div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left text-gray-700 border border-gray-200 rounded bg-white">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-2 px-2 font-semibold border-r border-gray-200 text-base">Title</th>
                    <th className="py-2 px-2 font-semibold border-r border-gray-200 text-base">Priority</th>
                    <th className="py-2 px-2 font-semibold border-r border-gray-200 text-base">User Story</th>
                    <th className="py-2 px-2 font-semibold text-base">Acceptance Criteria</th>
                    {isEditing && <th></th>}
                  </tr>
                </thead>
                <tbody>
                  {prd.generated_sections.user_stories.stories.map((story, idx) => (
                    <tr key={idx} className="border-t border-gray-200">
                      <td className="py-2 px-2 font-medium border-r border-gray-200">
                        {isEditing ? (
                          <input className="border rounded px-2 py-1 w-full" value={story.title} onChange={e => handleSectionChange('user_stories', idx, 'title', e.target.value)} />
                        ) : story.title}
                      </td>
                      <td className="py-2 px-2 border-r border-gray-200">
                        {isEditing ? (
                          <input className="border rounded px-2 py-1 w-full" value={story.priority} onChange={e => handleSectionChange('user_stories', idx, 'priority', e.target.value)} />
                        ) : story.priority}
                      </td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-200">
                        {isEditing ? (
                          <input className="border rounded px-2 py-1 w-full" value={story.user_story} onChange={e => handleSectionChange('user_stories', idx, 'user_story', e.target.value)} />
                        ) : story.user_story}
                      </td>
                      <td className="py-2 px-2 text-gray-600">
                        {isEditing ? (
                          <input className="border rounded px-2 py-1 w-full" value={story.acceptance_criteria} onChange={e => handleSectionChange('user_stories', idx, 'acceptance_criteria', e.target.value)} />
                        ) : story.acceptance_criteria}
                      </td>
                      {isEditing && (
                        <td><button className="text-red-500" onClick={() => handleRemoveSection('user_stories', idx)}>Delete</button></td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              {isEditing && (
                <button className="btn-secondary mt-2 inline-flex items-center" onClick={() => handleAddSection('user_stories')}>
                  <PlusIcon className="w-5 h-5 mr-2" />Add Story
                </button>
              )}
            </div>
          </div>
        )}

        {prd.generated_sections?.success_metrics?.metrics && (
          <div className="mb-8">
            <div className="font-semibold text-gray-700 text-base mb-2">Success Metrics</div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left text-gray-700 border border-gray-200 rounded bg-white">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-2 px-2 font-semibold border-r border-gray-200 text-base">Metric</th>
                    <th className="py-2 px-2 font-semibold border-r border-gray-200 text-base">Target</th>
                    <th className="py-2 px-2 font-semibold border-r border-gray-200 text-base">Current</th>
                    <th className="py-2 px-2 font-semibold text-base">Definition</th>
                    {isEditing && <th></th>}
                  </tr>
                </thead>
                <tbody>
                  {prd.generated_sections.success_metrics.metrics.map((metric, idx) => (
                    <tr key={idx} className="border-t border-gray-200">
                      <td className="py-2 px-2 font-medium border-r border-gray-200">
                        {isEditing ? (
                          <input className="border rounded px-2 py-1 w-full" value={metric.name} onChange={e => handleSectionChange('success_metrics', idx, 'name', e.target.value)} />
                        ) : metric.name}
                      </td>
                      <td className="py-2 px-2 border-r border-gray-200">
                        {isEditing ? (
                          <input className="border rounded px-2 py-1 w-full" value={metric.target} onChange={e => handleSectionChange('success_metrics', idx, 'target', e.target.value)} />
                        ) : metric.target}
                      </td>
                      <td className="py-2 px-2 border-r border-gray-200">
                        {isEditing ? (
                          <input className="border rounded px-2 py-1 w-full" value={metric.current} onChange={e => handleSectionChange('success_metrics', idx, 'current', e.target.value)} />
                        ) : metric.current}
                      </td>
                      <td className="py-2 px-2 text-gray-600">
                        {isEditing ? (
                          <input className="border rounded px-2 py-1 w-full" value={metric.definition} onChange={e => handleSectionChange('success_metrics', idx, 'definition', e.target.value)} />
                        ) : metric.definition}
                      </td>
                      {isEditing && (
                        <td><button className="text-red-500" onClick={() => handleRemoveSection('success_metrics', idx)}>Delete</button></td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              {isEditing && (
                <button className="btn-secondary mt-2 inline-flex items-center" onClick={() => handleAddSection('success_metrics')}>
                  <PlusIcon className="w-5 h-5 mr-2" />Add Metric
                </button>
              )}
            </div>
          </div>
        )}

        {prd.generated_sections?.project_timeline?.phases && (
          <div className="mb-8">
            <div className="font-semibold text-gray-700 text-base mb-2">Project Timeline</div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left text-gray-700 border border-gray-200 rounded bg-white">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-2 px-2 font-semibold border-r border-gray-200 text-base">PIC</th>
                    <th className="py-2 px-2 font-semibold border-r border-gray-200 text-base">Activity</th>
                    <th className="py-2 px-2 font-semibold border-r border-gray-200 text-base">Time Period</th>
                    <th className="py-2 px-2 font-semibold text-base">Duration</th>
                    {isEditing && <th></th>}
                  </tr>
                </thead>
                <tbody>
                  {prd.generated_sections.project_timeline.phases.map((phase, idx) => {
                    const [startDate, endDate] = phase.time_period.split(' - ')
                    return (
                      <tr key={idx} className="border-t border-gray-200">
                        <td className="py-2 px-2 border-r border-gray-200">
                          {isEditing ? (
                            <input className="border rounded px-2 py-1 w-full" value={phase.pic} onChange={e => handleSectionChange('project_timeline', idx, 'pic', e.target.value)} />
                          ) : phase.pic}
                        </td>
                        <td className="py-2 px-2 border-r border-gray-200">
                          {isEditing ? (
                            <input className="border rounded px-2 py-1 w-full" value={phase.activity} onChange={e => handleSectionChange('project_timeline', idx, 'activity', e.target.value)} />
                          ) : phase.activity}
                        </td>
                        <td className="py-2 px-2 border-r border-gray-200">
                          {isEditing ? (
                            <input className="border rounded px-2 py-1 w-full" value={phase.time_period} onChange={e => handleSectionChange('project_timeline', idx, 'time_period', e.target.value)} />
                          ) : `${formatDate(startDate)} - ${formatDate(endDate)}`}
                        </td>
                        <td className="py-2 px-2">
                          {isEditing ? (
                            <span>{calculateDuration(startDate, endDate)}</span>
                          ) : calculateDuration(startDate, endDate)}
                        </td>
                        {isEditing && (
                          <td><button className="text-red-500" onClick={() => handleRemoveSection('project_timeline', idx)}>Delete</button></td>
                        )}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {isEditing && (
                <button className="btn-secondary mt-2 inline-flex items-center" onClick={() => handleAddSection('project_timeline')}>
                  <PlusIcon className="w-5 h-5 mr-2" />Add Phase
                </button>
              )}
            </div>
          </div>
        )}

        {saveError && (
          <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <span className="text-sm text-red-700">{saveError}</span>
              </div>
                    </div>
                    </div>
        )}
                </div>

      {/* Delete Confirmation Modal (Implemented directly) */}
      {showDeleteModal && prd && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

            {/* Modal panel */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <TrashIconOutline className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Delete PRD
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete the PRD "<span className="font-semibold text-gray-700">{prd.product_name}</span>"?
                        This action cannot be undone.
                      </p>
                    </div>
                    </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleConfirmDelete}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
  )
}

export default PRDDetail