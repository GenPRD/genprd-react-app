import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { usePRD } from '../hooks/usePRD'
import { usePersonnel } from '../hooks/useApi'

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

function formatDateString(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`
}
function calculateDuration(start, end) {
  if (!start || !end) return ''
  const s = new Date(start)
  const e = new Date(end)
  const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24))
  return `${diff} days`
}

// MultiSelectDropdown: simple, supports custom/manual input
function MultiSelectDropdown({ label, options, value, onChange, placeholder, allowCustom = true }) {
  const [input, setInput] = useState('')
  const available = options.filter(opt => !value.includes(opt))
  const handleAdd = (item) => {
    if (item && !value.includes(item)) {
      onChange([...value, item])
      setInput('')
    }
  }
  const handleRemove = (item) => {
    onChange(value.filter(v => v !== item))
  }
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((v, i) => (
          <span key={i} className="inline-flex items-center bg-blue-100 text-blue-800 rounded px-2 py-1 text-xs">
            {v}
            <button type="button" className="ml-1 text-blue-500 hover:text-red-500" onClick={() => handleRemove(v)}>&times;</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <select className="border rounded px-2 py-1 flex-1" value="" onChange={e => { handleAdd(e.target.value) }}>
          <option value="">{placeholder || 'Select...'}</option>
          {available.map((opt, i) => (
            <option key={i} value={opt}>{opt}</option>
          ))}
        </select>
        {allowCustom && (
          <input className="border rounded px-2 py-1 flex-1" placeholder="Custom input..." value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAdd(input) } }}
          />
        )}
        {allowCustom && <button type="button" className="btn-secondary" onClick={() => handleAdd(input)}>Add</button>}
      </div>
    </div>
  )
}

const darciRoleLabels = {
  decider: 'Decider (Final decision maker)',
  accountable: 'Accountable (Mainly responsible)',
  responsible: 'Responsible (Task executor)',
  consulted: 'Consulted (Advisor)',
  informed: 'Informed (Kept informed)',
}

const darciRoleDesc = {
  decider: 'Makes the final decision regarding the product.',
  accountable: 'Ultimately responsible for the product\'s success.',
  responsible: 'Executes day-to-day tasks related to the product.',
  consulted: 'Provides input and expertise.',
  informed: 'Kept up to date on product progress.',
}

const PRDForm = () => {
  const navigate = useNavigate()
  const { createPRD } = usePRD()
  const { getAllPersonnel } = usePersonnel()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState(null)
  const [personnels, setPersonnels] = useState([])
  const [formData, setFormData] = useState({
    product_name: '',
    document_version: '1.0',
    document_owners: [],
    developers: [],
    stakeholders: [],
    project_overview: '',
    darci_roles: {
      decider: [],
      accountable: [],
      responsible: [],
      consulted: [],
      informed: []
    },
    start_date: '',
    end_date: '',
    generate_content: true,
    document_stage: 'draft',
  })

  useEffect(() => {
    getAllPersonnel().then(res => {
      if (res.status === 'success') {
        setPersonnels(res.data.map(p => p.name))
      }
    })
  }, [])

  // Step 1: version, name, owners, devs, stakeholders
  const step1 = (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Document Version</label>
        <input type="text" className="border rounded px-2 py-1 w-full" value={formData.document_version} onChange={e => setFormData(f => ({ ...f, document_version: e.target.value }))} />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
        <input type="text" className="border rounded px-2 py-1 w-full" value={formData.product_name} onChange={e => setFormData(f => ({ ...f, product_name: e.target.value }))} />
      </div>
      <MultiSelectDropdown
        label="Document Owners"
        options={personnels}
        value={formData.document_owners}
        onChange={arr => setFormData(f => ({ ...f, document_owners: arr }))}
        placeholder="Select personnel or enter manually"
        allowCustom={true}
      />
      <MultiSelectDropdown
        label="Developers"
        options={personnels}
        value={formData.developers}
        onChange={arr => setFormData(f => ({ ...f, developers: arr }))}
        placeholder="Select personnel or enter manually"
        allowCustom={true}
      />
      <MultiSelectDropdown
        label="Stakeholders"
        options={personnels}
        value={formData.stakeholders}
        onChange={arr => setFormData(f => ({ ...f, stakeholders: arr }))}
        placeholder="Select personnel or enter manually"
        allowCustom={true}
      />
    </>
  )

  // Step 2: Project Overview
  const step2 = (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Project Overview</label>
        <textarea className="border rounded px-2 py-1 w-full min-h-[100px]" value={formData.project_overview} onChange={e => setFormData(f => ({ ...f, project_overview: e.target.value }))} placeholder="Describe your project overview" />
        <div className="text-xs text-gray-500 mt-2">Please provide a clear and concise overview of the project, including goals, target users, and main value proposition.</div>
      </div>
    </>
  )

  // Step 3: DARCI roles
  const step3 = (
    <>
      <div className="mb-4">
        <div className="font-semibold text-gray-700 mb-1">What is DARCI?</div>
        <div className="text-xs text-gray-600 mb-2">DARCI is a project role framework: <b>Decider</b> (final decision maker), <b>Accountable</b> (mainly responsible), <b>Responsible</b> (task executor), <b>Consulted</b> (advisor), <b>Informed</b> (kept informed).</div>
      </div>
      {Object.keys(formData.darci_roles).map(role => (
        <MultiSelectDropdown
          key={role}
          label={`${darciRoleLabels[role]}${darciRoleDesc[role] ? ' - ' + darciRoleDesc[role] : ''}`}
          options={personnels}
          value={formData.darci_roles[role]}
          onChange={arr => setFormData(f => ({ ...f, darci_roles: { ...f.darci_roles, [role]: arr } }))}
          placeholder={`Select personnel for ${role}`}
          allowCustom={false}
        />
      ))}
    </>
  )

  // Step 4: Dates
  const step4 = (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
        <input type="date" className="border rounded px-2 py-1 w-full" value={formData.start_date} onChange={e => setFormData(f => ({ ...f, start_date: e.target.value }))} />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
        <input type="date" className="border rounded px-2 py-1 w-full" value={formData.end_date} onChange={e => setFormData(f => ({ ...f, end_date: e.target.value }))} />
      </div>
      {formData.start_date && formData.end_date && (
        <div className="text-sm text-gray-700 mb-2">Schedule: <b>{formatDateString(formData.start_date)}</b> - <b>{formatDateString(formData.end_date)}</b> ({calculateDuration(formData.start_date, formData.end_date)})</div>
      )}
    </>
  )

  const steps = [step1, step2, step3, step4]

  const handleNext = () => {
    setFormError(null)
    if (step === 1) {
      if (!formData.product_name || !formData.document_version) {
        setFormError('Please fill in product name and document version.')
        return
      }
    }
    if (step === 2) {
      if (!formData.project_overview) {
        setFormError('Project overview is required.')
        return
      }
    }
    if (step === 3) {
      if (!Object.values(formData.darci_roles).some(arr => arr.length > 0)) {
        setFormError('At least one DARCI role must be filled.')
        return
      }
    }
    if (step === 4) {
      if (!formData.start_date || !formData.end_date) {
        setFormError('Start and end date are required.')
        return
      }
    }
    setStep(s => s + 1)
  }

  const handlePrev = () => {
    setFormError(null)
    setStep(s => s - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)
    setLoading(true)
    try {
      const payload = {
        ...formData,
        document_owner: formData.document_owners,
        developer: formData.developers,
        stakeholders: formData.stakeholders,
      }
      const res = await createPRD(payload)
      if (res.status === 'success') {
        navigate(`/prds/${res.data.id}`)
      } else {
        setFormError(res.message || 'Failed to create PRD.')
      }
    } catch (err) {
      setFormError(err.message || 'Failed to create PRD.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Create New PRD</h2>
        <Link to="/prds" className="btn-secondary">Back to PRDs</Link>
      </div>
      <div className="bg-white shadow rounded-lg p-8">
        <form onSubmit={handleSubmit}>
          {formError && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{formError}</div>}
          {steps[step - 1]}
          <div className="flex justify-between mt-8">
            {step > 1 && <button type="button" className="btn-secondary" onClick={handlePrev}>Back</button>}
            {step < steps.length && <button type="button" className="btn-primary ml-auto" onClick={handleNext}>Next</button>}
            {step === steps.length && <button type="submit" className="btn-primary ml-auto" disabled={loading}>{loading ? 'Creating...' : 'Create PRD'}</button>}
          </div>
        </form>
        {loading && (
          <div className="flex items-center justify-center mt-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
            <span className="ml-4 text-gray-600">Generating PRD with AI...</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default PRDForm