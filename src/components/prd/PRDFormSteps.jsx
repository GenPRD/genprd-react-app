import { SparklesIcon, CalendarIcon } from '@heroicons/react/24/outline';
import PersonnelTagInput from './PersonnelTagInput';
import { useState, useEffect } from 'react';

// Utility functions for formatting dates and calculating duration
export const formatDateString = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
};

export const calculateDuration = (start, end) => {
  if (!start || !end) return '';
  const s = new Date(start);
  const e = new Date(end);
  const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24));
  return `${diff} days`;
};

// DARCI role descriptions
export const darciRoleLabels = {
  decider: 'Decider',
  accountable: 'Accountable',
  responsible: 'Responsible',
  consulted: 'Consulted',
  informed: 'Informed',
};

export const darciRoleDesc = {
  decider: 'Who makes the final decisions?',
  accountable: 'Who is accountable for the outcome?',
  responsible: 'Who does the work?',
  consulted: 'Who provides input?',
  informed: 'Who needs to be kept informed?',
};

// Step 1: Project Information
export const ProjectInformationStep = ({ formData, setFormData, personnels }) => {
  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="product_name" className="block text-sm font-medium text-gray-700 mb-1">
          Product Name <span className="text-gray-900">*</span>
        </label>
        <input 
          type="text" 
          id="product_name"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500" 
          value={formData.product_name} 
          onChange={e => setFormData(prev => ({ ...prev, product_name: e.target.value }))} 
          placeholder="Enter product name" 
        />
      </div>
      
      <div>
        <label htmlFor="document_version" className="block text-sm font-medium text-gray-700 mb-1">
          Document Version <span className="text-gray-900">*</span>
        </label>
        <input 
          type="text" 
          id="document_version"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500" 
          value={formData.document_version} 
          onChange={e => setFormData(prev => ({ ...prev, document_version: e.target.value }))} 
          placeholder="e.g., v1.0" 
        />
      </div>
      
      <PersonnelTagInput
        label="Document Owners"
        value={formData.document_owners}
        onChange={(owners) => setFormData(prev => ({ ...prev, document_owners: owners }))}
        placeholder="Enter names and press Enter"
        options={personnels}
        required={true}
      />
      
      <PersonnelTagInput
        label="Developers"
        value={formData.developers}
        onChange={(devs) => setFormData(prev => ({ ...prev, developers: devs }))}
        placeholder="Enter names and press Enter"
        options={personnels}
      />
      
      <PersonnelTagInput
        label="Stakeholders"
        value={formData.stakeholders}
        onChange={(stakeholders) => setFormData(prev => ({ ...prev, stakeholders: stakeholders }))}
        placeholder="Enter names and press Enter"
        options={personnels}
      />
    </div>
  );
};

// Step 2: Project Overview
export const ProjectOverviewStep = ({ formData, setFormData }) => {
  return (
    <div>
      <div className="mb-6">
        <label htmlFor="project_overview" className="block text-sm font-medium text-gray-700 mb-1">
          Project Description <span className="text-gray-900">*</span>
        </label>
        <textarea
          id="project_overview"
          className="w-full border border-gray-300 rounded-md px-3 py-2 h-64 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
          value={formData.project_overview}
          onChange={e => setFormData(prev => ({ ...prev, project_overview: e.target.value }))}
          placeholder="Provide a detailed description of your project. Our AI will use this to generate comprehensive requirements..."
        />
        <div className="mt-2 flex items-center text-sm text-gray-600">
          <SparklesIcon className="w-4 h-4 mr-1 text-gray-500" />
          <span>AI will enhance this description with detailed requirements</span>
        </div>
      </div>
    </div>
  );
};

// Step 3: DARCI Roles
export const DarciRolesStep = ({ formData, setFormData, personnels }) => {
  return (
    <div className="space-y-6">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
        <h4 className="font-medium text-sm text-gray-800">DARCI Roles Framework</h4>
        <p className="text-xs text-gray-700 mt-1">
          DARCI is a project role framework: <b>Decider</b> (final decision maker), <b>Accountable</b> (mainly responsible), <b>Responsible</b> (task executor), <b>Consulted</b> (advisor), <b>Informed</b> (kept informed).
        </p>
      </div>
      
      {Object.keys(formData.darci_roles).map(role => (
        <PersonnelTagInput
          key={role}
          label={darciRoleLabels[role]}
          value={formData.darci_roles[role]}
          onChange={(persons) => setFormData(prev => ({
            ...prev,
            darci_roles: { ...prev.darci_roles, [role]: persons }
          }))}
          placeholder={darciRoleDesc[role]}
          options={personnels}
        />
      ))}
    </div>
  );
};

// Step 4: Project Timeline
export const ProjectTimelineStep = ({ formData, setFormData, validationAttempted = false }) => {
  // Tambahkan state untuk melacak jika ini pertama kali render
  const [isFirstRender, setIsFirstRender] = useState(true);
  
  // Effect untuk mengubah state setelah render pertama
  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
    }
  }, []);
  
  // Gunakan logika ini untuk memastikan validasi tidak aktif di render pertama
  const effectiveValidation = validationAttempted && !isFirstRender;

  // Format tanggal dengan lebih reliable
  const formatFullDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return ''; // Invalid date
      
      const day = date.getDate();
      const month = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear();
      
      return `${day} ${month} ${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  // Calculate duration safely
  const calculateProjectDuration = () => {
    if (!formData.start_date || !formData.end_date) return null;
    
    try {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
      
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return {
        start: formatFullDate(formData.start_date),
        end: formatFullDate(formData.end_date),
        days: diffDays
      };
    } catch (error) {
      console.error('Error calculating duration:', error);
      return null;
    }
  };

  const duration = calculateProjectDuration();
  
  // Secara eksplisit memeriksa bahwa validationAttempted benar-benar true
  // dan bukan nilai truthy lainnya
  const showStartDateError = effectiveValidation && !formData.start_date;
  const showEndDateError = effectiveValidation && !formData.end_date;
  const showDateOrderError = 
    effectiveValidation && 
    formData.start_date && 
    formData.end_date && 
    new Date(formData.start_date) > new Date(formData.end_date);

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
          Start Date <span className="text-gray-900">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <CalendarIcon className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="date"
            id="start_date"
            className={`w-full pl-10 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500`}
            value={formData.start_date}
            onChange={e => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
          />
        </div>
        {/* Tidak menampilkan pesan error sama sekali di awal */}
      </div>
      
      <div>
        <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
          End Date <span className="text-gray-900">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <CalendarIcon className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="date"
            id="end_date"
            className={`w-full pl-10 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500`}
            value={formData.end_date}
            onChange={e => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
          />
        </div>
        {/* Tidak menampilkan pesan error sama sekali di awal */}
      </div>
      
      {/* Hanya tampilkan duration jika ada */}
      {duration && (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-3 mt-3">
          <p className="text-sm text-gray-700">
            Project duration: <span className="font-medium">{duration.start}</span> to{' '}
            <span className="font-medium">{duration.end}</span>{' '}
            ({duration.days} {duration.days === 1 ? 'day' : 'days'})
          </p>
        </div>
      )}
    </div>
  );
};