import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

const PRDUserStoriesSection = ({ prd, isEditing, onSectionChange, onRemoveSection, onAddSection }) => {
  const stories = prd.generated_sections?.user_stories?.stories || [];
  
  const priorityOptions = ['high', 'medium', 'low'];
  
  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="mb-8 bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">User Stories</h2>
      </div>
      
      <div className="overflow-hidden">
        {stories.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {stories.map((story, idx) => (
              <div key={idx} className="p-6">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                        value={story.title || ''}
                        onChange={(e) => onSectionChange('user_stories', idx, 'title', e.target.value)}
                        placeholder="Story title"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                      <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                        value={story.priority || 'medium'}
                        onChange={(e) => onSectionChange('user_stories', idx, 'priority', e.target.value)}
                      >
                        {priorityOptions.map(option => (
                          <option key={option} value={option}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">User Story</label>
                      <textarea
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                        value={story.user_story || ''}
                        onChange={(e) => onSectionChange('user_stories', idx, 'user_story', e.target.value)}
                        placeholder="As a [type of user], I want [goal] so that [benefit]"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Acceptance Criteria</label>
                      <textarea
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                        value={story.acceptance_criteria || ''}
                        onChange={(e) => onSectionChange('user_stories', idx, 'acceptance_criteria', e.target.value)}
                        placeholder="Given [context], when [action], then [expected result]"
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => onRemoveSection('user_stories', idx)}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Remove story
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-base font-medium text-gray-900">{story.title}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeClass(story.priority)}`}>
                        {story.priority?.charAt(0).toUpperCase() + story.priority?.slice(1) || 'Medium'} Priority
                      </span>
                    </div>
                    
                    <div className="mt-2">
                      <h4 className="text-sm font-medium text-gray-700">User Story:</h4>
                      <p className="mt-1 text-sm text-gray-600">{story.user_story}</p>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700">Acceptance Criteria:</h4>
                      <p className="mt-1 text-sm text-gray-600">{story.acceptance_criteria}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-gray-500">No user stories added yet.</p>
          </div>
        )}
        
        {isEditing && (
          <div className="px-6 py-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => onAddSection('user_stories')}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add User Story
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PRDUserStoriesSection;