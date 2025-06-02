import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usePRD } from '../hooks/usePRD';
import { usePersonnel } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';
import { 
  ChevronRightIcon, 
  ChevronLeftIcon, 
  XMarkIcon,
  SparklesIcon,
  ShieldExclamationIcon
} from '@heroicons/react/24/outline';

// Import komponen yang sudah dipecah
import PRDFormProgress from '../components/prd/PRDFormProgress';
import PRDLoadingOverlay from '../components/prd/PRDLoadingOverlay';
import {
  ProjectInformationStep,
  ProjectOverviewStep,
  DarciRolesStep,
  ProjectTimelineStep
} from '../components/prd/PRDFormSteps';

const PRDForm = () => {
  const navigate = useNavigate();
  const { createPRD } = usePRD();
  const { getAllPersonnel } = usePersonnel();
  const { refreshToken, isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [personnels, setPersonnels] = useState([]);
  const [apiError, setApiError] = useState(null);
  const [stepValidation, setStepValidation] = useState({
    1: false,
    2: false,
    3: false,
    4: false
  });
  
  const [progressSteps] = useState([
    { name: 'Project Information', description: 'Basic information about your project and team' },
    { name: 'Project Overview', description: 'Detailed description that AI will enhance' },
    { name: 'DARCI Roles', description: 'Define roles and responsibilities' },
    { name: 'Project Timeline', description: 'Timeline and milestones for your project' }
  ]);
  
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
  });

  // Fetch personnel data safely
  const fetchPersonnel = useCallback(async () => {
    try {
      const res = await getAllPersonnel();
      if (res?.status === 'success') {
        setPersonnels(res.data.map(p => p.name || p.email || `User ${p.id}`));
      }
    } catch (error) {
      console.error('Error fetching personnel:', error);
      
      // Handle 401 Unauthorized error
      if (error?.response?.status === 401) {
        setApiError('Your session has expired. Please refresh or login again.');
        try {
          await refreshToken();
          setTimeout(() => fetchPersonnel(), 1000);
        } catch (refreshError) {
          console.error('Failed to refresh authentication:', refreshError);
          setApiError('Authentication failed. Please login again.');
          setTimeout(() => navigate('/login', { state: { from: location.pathname } }), 2000);
        }
      } else {
        setApiError(error?.message || 'Failed to load personnel data');
      }
    }
  }, [getAllPersonnel, refreshToken, navigate]);

  // Load personnel data
  useEffect(() => {
    if (isAuthenticated) {
      fetchPersonnel();
    }
  }, [isAuthenticated, fetchPersonnel]);

  // Reset form error and validation state when changing steps
  useEffect(() => {
    setFormError(null);
    // Do NOT reset validation state here!
  }, [step]);

  // Reset step validation specifically when entering step 4
  useEffect(() => {
    if (step === 4) {
      setStepValidation(prev => ({
        ...prev,
        4: false // Reset validation for timeline step
      }));
    }
  }, [step]);

  const renderStepContent = () => {
    switch(step) {
      case 1: 
        return <ProjectInformationStep 
          formData={formData} 
          setFormData={setFormData} 
          personnels={personnels} 
        />;
      case 2: 
        return <ProjectOverviewStep 
          formData={formData} 
          setFormData={setFormData} 
        />;
      case 3: 
        return <DarciRolesStep 
          formData={formData} 
          setFormData={setFormData} 
          personnels={personnels} 
        />;
      case 4: 
        return <ProjectTimelineStep 
          formData={formData} 
          setFormData={setFormData} 
          validationAttempted={stepValidation[4]} 
        />;
      default: 
        return null;
    }
  };

  const validateStep = (currentStep = step) => {
    // Mark this step as having been validated
    setStepValidation(prev => ({
      ...prev,
      [currentStep]: true
    }));
    
    switch(currentStep) {
      case 1:
        if (!formData.product_name.trim()) {
          setFormError('Product name is required');
          return false;
        }
        if (!formData.document_version.trim()) {
          setFormError('Document version is required');
          return false;
        }
        if (formData.document_owners.length === 0) {
          setFormError('At least one document owner is required');
          return false;
        }
        return true;
        
      case 2:
        if (!formData.project_overview.trim()) {
          setFormError('Project overview is required');
          return false;
        }
        return true;
        
      case 3:
        if (Object.values(formData.darci_roles).every(arr => arr.length === 0)) {
          setFormError('Please assign at least one person to a DARCI role');
          return false;
        }
        return true;
        
      case 4:
        let isValid = true;
        
        if (!formData.start_date) {
          isValid = false;
          // REMOVED: Don't set form error for step 4 - let inline validation handle it
          // setFormError('Start date is required');
        }
        
        if (!formData.end_date) {
          isValid = false;
          // REMOVED: Don't set form error for step 4 - let inline validation handle it
          // setFormError('End date is required');
        }
        
        if (formData.start_date && formData.end_date && 
            new Date(formData.start_date) > new Date(formData.end_date)) {
          isValid = false;
          // REMOVED: Don't set form error for step 4 - let inline validation handle it
          // setFormError('Start date cannot be after end date');
        }
        
        return isValid;
        
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(prevStep => prevStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    setFormError(null);
    setStep(prevStep => prevStep - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    
    setLoading(true);
    setApiError(null);

    try {
      const payload = {
        ...formData,
        document_owner: formData.document_owners,
        developer: formData.developers,
        stakeholder: formData.stakeholders,
      };
      
      const response = await createPRD(payload);
      if (response?.status === 'success') {
        navigate(`/prds/${response.data.id}`);
      } else {
        setFormError(response?.message || 'Failed to create PRD');
      }
    } catch (err) {
      console.error('Error creating PRD:', err);
      
      if (err?.response?.status === 401) {
        setApiError('Your session has expired. Please refresh or login again.');
        try {
          await refreshToken();
          setApiError('Your session was refreshed. Please try again.');
        } catch (refreshError) {
          console.error('Failed to refresh authentication:', refreshError);
          setApiError('Authentication failed. Please login again.');
          setTimeout(() => navigate('/login', { state: { from: location.pathname } }), 2000);
        }
      } else {
        setApiError(err?.message || 'An error occurred while creating the PRD');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create New PRD</h1>
        <p className="text-gray-600 mt-1">Let AI help you create a comprehensive Product Requirements Document</p>
      </div>
      
      {/* API Error banner */}
      {apiError && (
        <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ShieldExclamationIcon className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{apiError}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Step indicator and progress bar */}
      <PRDFormProgress progressSteps={progressSteps} currentStep={step} />
      
      {/* Main form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <form onSubmit={handleSubmit}>
          {/* IMPORTANT: Only show form error banner for non-Timeline steps */}
          {formError && step !== 4 && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <XMarkIcon className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{formError}</p>
                </div>
              </div>
            </div>
          )}
          
          {renderStepContent()}
          
          {/* Buttons */}
          <div className="flex justify-between mt-8 border-t border-gray-200 pt-6">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                <ChevronLeftIcon className="w-5 h-5 mr-1" /> Back
              </button>
            ) : (
              <Link 
                to="/prds"
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                <ChevronLeftIcon className="w-5 h-5 mr-1" /> Cancel
              </Link>
            )}
            
            {step < progressSteps.length ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Next <ChevronRightIcon className="w-5 h-5 ml-1" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                <SparklesIcon className="w-5 h-5 mr-1.5" /> Generate PRD
              </button>
            )}
          </div>
        </form>
      </div>
      
      {/* Loading overlay */}
      <PRDLoadingOverlay isVisible={loading} />
    </div>
  );
};

export default PRDForm;