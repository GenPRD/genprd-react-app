import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

const PRDUserStoriesSection = ({ 
  prd, 
  isEditing, 
  onSectionChange, 
  onRemoveSection, 
  onAddSection 
}) => {
  const stories = prd.generated_sections?.user_stories?.stories || [];
  
  const priorityOptions = ['high', 'medium', 'low'];
  
  const getPriorityBadgeClass = (priority) => {
    switch (priority?.toLowerCase()) {
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
    <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-8 py-5 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">User Stories</h2>
      </div>

      <div className="overflow-hidden">
        <div className="px-8 py-5">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th scope="col" className="pb-3 text-left text-sm font-medium text-gray-900 w-1/4">
                  Title
                </th>
                <th scope="col" className="pb-3 text-left text-sm font-medium text-gray-900 w-24">
                  Priority
                </th>
                <th scope="col" className="pb-3 text-left text-sm font-medium text-gray-900 w-1/3">
                  User Story
                </th>
                <th scope="col" className="pb-3 text-left text-sm font-medium text-gray-900">
                  Acceptance Criteria
                </th>
                {isEditing && (
                  <th scope="col" className="pb-3 text-right text-sm font-medium text-gray-900 w-20">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stories.map((story, idx) => (
                <tr key={idx} className="align-top">
                  <td className="py-4 pr-4">
                    {isEditing ? (
                      <input
                        type="text"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                        value={story.title || ''}
                        onChange={(e) => onSectionChange('user_stories', idx, 'title', e.target.value)}
                        placeholder="Story title"
                      />
                    ) : (
                      <span className="text-sm text-gray-900">{story.title}</span>
                    )}
                  </td>
                  <td className="py-4 pr-4">
                    {isEditing ? (
                      <select
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                        value={story.priority || 'medium'}
                        onChange={(e) => onSectionChange('user_stories', idx, 'priority', e.target.value)}
                      >
                        {priorityOptions.map(option => (
                          <option key={option} value={option}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeClass(story.priority)}`}>
                        {story.priority?.charAt(0).toUpperCase() + story.priority?.slice(1) || 'Medium'}
                      </span>
                    )}
                  </td>
                  <td className="py-4 pr-4">
                    {isEditing ? (
                      <textarea
                        rows={3}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                        value={story.user_story || ''}
                        onChange={(e) => onSectionChange('user_stories', idx, 'user_story', e.target.value)}
                        placeholder="As a [type of user], I want [goal] so that [benefit]"
                      />
                    ) : (
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{story.user_story}</p>
                    )}
                  </td>
                  <td className="py-4 pr-4">
                    {isEditing ? (
                      <textarea
                        rows={3}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                        value={story.acceptance_criteria || ''}
                        onChange={(e) => onSectionChange('user_stories', idx, 'acceptance_criteria', e.target.value)}
                        placeholder="Given [context], when [action], then [expected result]"
                      />
                    ) : (
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{story.acceptance_criteria}</p>
                    )}
                  </td>
                  {isEditing && (
                    <td className="py-4 text-right">
                      <button
                        type="button"
                        onClick={() => onRemoveSection('user_stories', idx)}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              {stories.length === 0 && (
                <tr>
                  <td colSpan={isEditing ? 5 : 4} className="py-4 text-center text-sm text-gray-500">
                    No user stories added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {isEditing && (
            <div className="mt-4">
              <button
                type="button"
                onClick={() => onAddSection('user_stories')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add User Story
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PRDUserStoriesSection;