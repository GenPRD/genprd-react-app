import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArchiveBoxIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  EllipsisHorizontalIcon,
  StarIcon as StarIconSolid
} from '@heroicons/react/24/solid';
import {
  StarIcon
} from '@heroicons/react/24/outline';
import { formatRelativeDate } from '../../utils/dateUtils';

const PRDCard = ({ prd, onPin, onArchive, onDelete, onDownload, onMenuClick }) => {
  const getStageColor = (stage) => {
    switch (stage) {
      case 'draft':
        return { bg: 'bg-gray-100', text: 'text-gray-800' };
      case 'inprogress':
        return { bg: 'bg-blue-50', text: 'text-blue-800' };
      case 'finished':
        return { bg: 'bg-green-50', text: 'text-green-800' };
      case 'archived':
        return { bg: 'bg-gray-200', text: 'text-gray-700' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800' };
    }
  };

  const getStageLabel = (stage) => {
    switch (stage) {
      case 'inprogress':
        return 'In Progress';
      default:
        return stage.charAt(0).toUpperCase() + stage.slice(1);
    }
  };

  const { bg, text } = getStageColor(prd.document_stage);

  return (
    <div 
      className="flex flex-col bg-white border border-gray-200 rounded-lg p-5 transition-all hover:shadow-sm"
      data-prd-id={prd.id}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <Link 
            to={`/prds/${prd.id}`}
            className="text-lg font-medium text-gray-900 hover:text-blue-600 line-clamp-1"
          >
            {prd.product_name}
          </Link>
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{prd.project_overview}</p>
        </div>
        <div className="flex items-center ml-4">
          <button 
            onClick={onPin}
            className={`text-gray-400 hover:text-yellow-500 focus:outline-none ${prd.is_pinned ? 'text-yellow-500' : ''}`}
            title={prd.is_pinned ? "Unpin PRD" : "Pin PRD"}
          >
            {prd.is_pinned ? (
              <StarIconSolid className="w-5 h-5" />
            ) : (
              <StarIcon className="w-5 h-5" />
            )}
          </button>
          <div className="relative ml-2">
            <button
              onClick={onMenuClick}
              className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
              title="Options"
            >
              <EllipsisHorizontalIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-auto pt-3 text-sm">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
          {getStageLabel(prd.document_stage)}
        </span>
        <span className="text-gray-500">
          {prd.updated_at ? formatRelativeDate(prd.updated_at) : 'Not updated yet'}
        </span>
      </div>
    </div>
  );
};

export default PRDCard;