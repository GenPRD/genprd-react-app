import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { 
  HomeIcon,
  DocumentTextIcon,
  PlusIcon,
  DocumentPlusIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { usePRD } from '../../hooks/usePRD';
import { PRD_EVENTS } from '../../utils/events';
import logoImage from '../../assets/genprd_logo.svg';

const Sidebar = ({ isMobile = false, onCloseMobile = () => {} }) => {
  const location = useLocation();
  const { getAllPRDs, loading: apiLoading } = usePRD();
  const [recentPRDs, setRecentPRDs] = useState([]);
  const [pinnedPRDs, setPinnedPRDs] = useState([]);
  const [dataError, setDataError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Use a ref to track if component is mounted
  const isMounted = useRef(true);
  // Use a ref to track if we've already fetched data
  const dataFetched = useRef(false);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Initial data fetch
  useEffect(() => {
    if (!dataFetched.current && isMounted.current) {
      const fetchPRDs = async () => {
        try {
          setLoading(true);
          console.log('Fetching PRDs for sidebar (once)...');
          
          const result = await getAllPRDs();
          
          // Guard clause to prevent state updates if component unmounted
          if (!isMounted.current) return;
          
          if (result?.status === 'success' && result.data) {
            // Get the prds array from the correct path
            const prdsArray = result.data.prds || [];
            
            if (Array.isArray(prdsArray)) {
              // Get pinned PRDs
              const pinned = prdsArray.filter(prd => prd.is_pinned === true);
              
              // Get recent PRDs (excluding pinned ones)
              const unpinnedPRDs = prdsArray.filter(prd => !prd.is_pinned);
              const sortedUnpinned = [...unpinnedPRDs].sort((a, b) => 
                new Date(b.updated_at || Date.now()) - new Date(a.updated_at || Date.now())
              );
              
              setPinnedPRDs(pinned);
              setRecentPRDs(sortedUnpinned.slice(0, 25)); // Limit to 25 recent PRDs
              setDataError(null);
            } else {
              console.error('PRDs data is not an array:', prdsArray);
              setDataError('Invalid PRD data format');
            }
          } else {
            console.error('Error in PRD response:', result);
            setDataError('Failed to fetch PRDs');
          }
        } catch (err) {
          if (!isMounted.current) return;
          
          console.error('Error fetching PRDs for sidebar:', err);
          setDataError('Failed to load PRDs');
        } finally {
          if (!isMounted.current) return;
          
          setLoading(false);
          dataFetched.current = true;
        }
      };

      fetchPRDs();
    }
  }, [getAllPRDs]);

  // Listen for PIN_TOGGLED events - with stable modification to avoid flicker
  useEffect(() => {
    const handlePinToggle = (e) => {
      const { prd } = e.detail;
      console.log('Sidebar received pin toggle event:', prd);
      
      if (prd) {
        // Update pinnedPRDs
        setPinnedPRDs(current => {
          // If PRD is now pinned and not in list yet, add it
          if (prd.is_pinned) {
            const exists = current.some(p => p.id === prd.id);
            if (!exists) {
              return [...current, prd];
            }
          } else {
            // If PRD is now unpinned, remove it from pinnedPRDs
            return current.filter(p => p.id !== prd.id);
          }
          return current;
        });
        
        // Update recentPRDs (exclude pinned from recent)
        setRecentPRDs(current => {
          // If PRD is now pinned, remove it from recentPRDs
          if (prd.is_pinned) {
            return current.filter(p => p.id !== prd.id);
          } 
          // If PRD is now unpinned, add it to recentPRDs if it's not there
          else {
            const exists = current.some(p => p.id === prd.id);
            if (!exists) {
              // Add to beginning of recent and trim if needed
              const updatedRecent = [prd, ...current].slice(0, 25);
              return updatedRecent;
            }
          }
          return current;
        });
      }
    };
    
    const handleArchiveToggle = (e) => {
      const { prd } = e.detail;
      console.log('Sidebar received archive toggle event:', prd);
      
      if (prd) {
        // Update both recent and pinned lists with the new document_stage
        setPinnedPRDs(current => 
          current.map(p => p.id === prd.id ? { ...p, document_stage: prd.document_stage } : p)
        );
        
        setRecentPRDs(current => 
          current.map(p => p.id === prd.id ? { ...p, document_stage: prd.document_stage } : p)
        );
      }
    };
    
    // Add event listeners
    document.addEventListener(PRD_EVENTS.PIN_TOGGLED, handlePinToggle);
    document.addEventListener(PRD_EVENTS.ARCHIVE_TOGGLED, handleArchiveToggle);
    
    // Clean up
    return () => {
      document.removeEventListener(PRD_EVENTS.PIN_TOGGLED, handlePinToggle);
      document.removeEventListener(PRD_EVENTS.ARCHIVE_TOGGLED, handleArchiveToggle);
    };
  }, []);

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };
  
  const handleNavClick = () => {
    if (isMobile) {
      onCloseMobile();
    }
  };

  // Check if loading
  const isLoading = loading || apiLoading;

  // Scrollable area container reference
  const scrollContainerRef = useRef(null);

  return (
    <aside className="w-64 bg-white h-full flex flex-col flex-shrink-0 border-r border-gray-200 shadow-sm z-10">
      {/* Logo section - Outside scrollable area */}
      <div className="p-5 flex items-center flex-shrink-0">
        <img 
          src={logoImage} 
          alt="GenPRD Logo" 
          className="h-8 w-auto mr-3"
          onError={(e) => {
            e.target.onerror = null;
            e.target.style.display = 'none';
            e.target.parentNode.innerHTML = `
              <div class="w-8 h-8 bg-gray-900 rounded-md flex items-center justify-center mr-3">
                <span class="text-white font-bold text-lg">G</span>
              </div>
            ` + e.target.parentNode.innerHTML;
          }}
        />
        <span className="font-semibold text-xl text-gray-900">GenPRD</span>
      </div>
      
      {/* New PRD button - Outside scrollable area */}
      <div className="px-5 pb-4 flex-shrink-0">
        <Link
          to="/prds/new"
          className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-gray-800 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-all shadow-sm"
          onClick={handleNavClick}
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          New PRD
        </Link>
      </div>
      
      {/* Main navigation - Outside scrollable area */}
      <nav className="px-5 py-2 flex-none">
        <Link
          to="/dashboard"
          className={`flex items-center px-4 py-2.5 my-1 rounded-md text-sm font-medium transition-colors ${
            isActive('/dashboard') 
              ? 'bg-gray-100/80 backdrop-blur-sm text-gray-900' 
              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
          }`}
          onClick={handleNavClick}
        >
          <span className={`mr-3 flex-shrink-0 ${isActive('/dashboard') ? 'text-gray-800' : 'text-gray-500'}`}>
            <HomeIcon className="w-5 h-5" />
          </span>
          <span>Dashboard</span>
        </Link>
        
        <Link
          to="/prds"
          className={`flex items-center px-4 py-2.5 my-1 rounded-md text-sm font-medium transition-colors ${
            isActive('/prds') && !isActive('/prds/new')
              ? 'bg-gray-100/80 backdrop-blur-sm text-gray-900' 
              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
          }`}
          onClick={handleNavClick}
        >
          <span className={`mr-3 flex-shrink-0 ${isActive('/prds') && !isActive('/prds/new') ? 'text-gray-800' : 'text-gray-500'}`}>
            <DocumentTextIcon className="w-5 h-5" />
          </span>
          <span>All PRDs</span>
        </Link>
      </nav>

      {/* Section divider */}
      <div className="px-5 py-3 flex-shrink-0">
        <div className="h-px bg-gray-200"></div>
      </div>
      
      {/* Scrollable content starts here */}
      <div 
        ref={scrollContainerRef}
        className="flex-grow flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400"
      >
        {/* PINNED section */}
        <div className="px-5 flex-shrink-0">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            PINNED
          </h3>
          <div className="space-y-1">
            {isLoading && pinnedPRDs.length === 0 && (
              <div className="px-4 py-3 text-sm text-center text-gray-500">Loading...</div>
            )}
            
            {!isLoading && pinnedPRDs.length > 0 && pinnedPRDs.map(prd => (
              <Link
                key={`pin-${prd.id}`}
                to={`/prds/${prd.id}`}
                className="block px-4 py-2 hover:bg-gray-50 rounded-md text-sm"
                onClick={handleNavClick}
              >
                <span className="block text-sm font-medium truncate text-gray-900">
                  {prd.product_name || 'Unnamed PRD'}
                </span>
              </Link>
            ))}
            
            {/* If no pinned PRDs yet */}
            {!isLoading && pinnedPRDs.length === 0 && !dataError && (
              <div className="px-4 py-3 text-sm text-center text-gray-500 border border-dashed border-gray-200 rounded-md">
                <DocumentPlusIcon className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                <p>No pinned PRDs</p>
              </div>
            )}
            
            {dataError && !isLoading && (
              <div className="px-4 py-2 text-sm text-center text-red-500">
                {dataError}
              </div>
            )}
          </div>
        </div>
        
        {/* RECENT section - no icons, simplified */}
        <div className="px-5 mt-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            RECENT
          </h3>
          <div className="space-y-1">
            {isLoading && recentPRDs.length === 0 && (
              <div className="px-4 py-3 text-sm text-center text-gray-500">Loading...</div>
            )}
            
            {!isLoading && recentPRDs.length > 0 && recentPRDs.map(prd => (
              <Link
                key={`recent-${prd.id}`}
                to={`/prds/${prd.id}`}
                className="block px-4 py-2 hover:bg-gray-50 rounded-md text-sm"
                onClick={handleNavClick}
              >
                <span className="block text-sm truncate text-gray-900">
                  {prd.product_name || 'Unnamed PRD'}
                </span>
              </Link>
            ))}
            
            {!isLoading && recentPRDs.length === 0 && !dataError && (
              <div className="px-4 py-3 text-sm text-center text-gray-500 border border-dashed border-gray-200 rounded-md">
                <DocumentPlusIcon className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                <p>Start by creating a PRD</p>
              </div>
            )}
            
            {dataError && !isLoading && (
              <div className="px-4 py-2 text-sm text-center text-red-500">
                {dataError}
              </div>
            )}
          </div>
          
          {/* "See All" button styled like in Claude - at the bottom */}
          {recentPRDs.length > 0 && (
            <div className="mt-3 mb-8">
              <Link
                to="/prds"
                className="flex items-center px-4 py-3 text-sm text-gray-500 hover:bg-gray-50 rounded-md border border-transparent hover:border-gray-100 transition-all"
                onClick={handleNavClick}
              >
                <span className="flex-grow text-left">All PRDs</span>
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;