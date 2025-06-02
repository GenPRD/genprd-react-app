import React, { useState, useEffect } from 'react';
import { 
  TrashIcon, 
  TableCellsIcon, 
  DocumentTextIcon,
  PlusIcon 
} from '@heroicons/react/24/outline';

const TableEditor = ({ data = { headers: [], rows: [['']] }, onChange }) => {
  const [rows, setRows] = useState(data.rows || [['']]);
  const [headers, setHeaders] = useState(data.headers || []);

  // Sync state with props
  useEffect(() => {
    setRows(data.rows || [['']]);
    setHeaders(data.headers || []);
  }, [data]);

  const addColumn = () => {
    const newHeaders = [...headers, `Column ${headers.length + 1}`];
    const newRows = rows.map(row => [...row, '']);
    setHeaders(newHeaders);
    setRows(newRows);
    onChange({ headers: newHeaders, rows: newRows });
  };

  const addRow = () => {
    const newRow = new Array(headers.length || 1).fill('');
    const newRows = [...rows, newRow];
    setRows(newRows);
    onChange({ headers, rows: newRows });
  };

  const updateCell = (rowIndex, colIndex, value) => {
    const newRows = rows.map((row, idx) => {
      if (idx === rowIndex) {
        const newRow = [...row];
        newRow[colIndex] = value;
        return newRow;
      }
      return row;
    });
    setRows(newRows);
    onChange({ headers, rows: newRows });
  };

  const updateHeader = (colIndex, value) => {
    const newHeaders = headers.map((header, idx) => 
      idx === colIndex ? value : header
    );
    setHeaders(newHeaders);
    onChange({ headers: newHeaders, rows });
  };

  const deleteRow = (rowIndex) => {
    if (rows.length <= 1) {
      // Always keep at least one row
      const emptyRow = new Array(headers.length || 1).fill('');
      setRows([emptyRow]);
      onChange({ headers, rows: [emptyRow] });
      return;
    }
    
    const newRows = rows.filter((_, idx) => idx !== rowIndex);
    setRows(newRows);
    onChange({ headers, rows: newRows });
  };

  const deleteColumn = (colIndex) => {
    if (headers.length <= 1) {
      // Always keep at least one column
      setHeaders(['Column 1']);
      const newRows = rows.map(() => ['']);
      setRows(newRows);
      onChange({ headers: ['Column 1'], rows: newRows });
      return;
    }
    
    const newHeaders = headers.filter((_, idx) => idx !== colIndex);
    const newRows = rows.map(row => row.filter((_, idx) => idx !== colIndex));
    setHeaders(newHeaders);
    setRows(newRows);
    onChange({ headers: newHeaders, rows: newRows });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            {headers.map((header, colIndex) => (
              <th key={colIndex} className="relative">
                <input
                  type="text"
                  value={header || ''}
                  onChange={(e) => updateHeader(colIndex, e.target.value)}
                  className="w-full p-2 text-sm font-medium text-gray-900 bg-gray-50 border-b focus:outline-none focus:ring-1 focus:ring-gray-500"
                  placeholder="Column name"
                />
                <button
                  onClick={() => deleteColumn(colIndex)}
                  className="absolute -right-1 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-red-600"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </th>
            ))}
            <th className="w-10">
              <button
                onClick={addColumn}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <PlusIcon className="w-5 h-5" />
              </button>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td key={colIndex} className="p-2">
                  <input
                    type="text"
                    value={cell || ''}
                    onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                    className="w-full p-2 text-sm text-gray-900 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
                    placeholder="Enter value"
                  />
                </td>
              ))}
              <td>
                <button
                  onClick={() => deleteRow(rowIndex)}
                  className="p-2 text-gray-400 hover:text-red-600"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={headers.length + 1}>
              <button
                onClick={addRow}
                className="w-full p-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                <PlusIcon className="w-5 h-5 mx-auto" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const PRDCustomSection = ({ section, isEditing, onUpdate, onDelete }) => {
  const [localSection, setLocalSection] = useState({
    ...section,
    layout: section.layout || 'text',
    content: section.content || (section.layout === 'table' ? { headers: [], rows: [['']] } : '')
  });
  
  // Sync with parent when section prop changes
  useEffect(() => {
    setLocalSection({
      ...section,
      layout: section.layout || 'text',
      content: section.content || (section.layout === 'table' ? { headers: [], rows: [['']] } : '')
    });
  }, [section]);

  // Debounced update to parent
  useEffect(() => {
    // Don't update on first mount
    if (JSON.stringify(localSection) !== JSON.stringify(section)) {
      const handler = setTimeout(() => {
        onUpdate(localSection);
      }, 500); // Debounce for 500ms
      
      return () => clearTimeout(handler);
    }
  }, [localSection, section, onUpdate]);

  // Handle local changes
  const handleLocalUpdate = (changes) => {
    const updatedSection = {
      ...localSection,
      ...changes
    };
    setLocalSection(updatedSection);
  };

  // Layout toggle with proper state management
  const toggleLayout = () => {
    const newLayout = localSection.layout === 'table' ? 'text' : 'table';
    const newContent = newLayout === 'table' 
      ? { headers: ['Column 1'], rows: [['']] } // Initialize with one empty cell
      : '';
    
    handleLocalUpdate({
      layout: newLayout,
      content: newContent
    });
  };

  return (
    <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header Section */}
      <div className="px-8 py-5 border-b border-gray-200 flex justify-between items-center">
        {isEditing ? (
          <div className="flex-1 flex items-center gap-4">
            <input
              type="text"
              className="text-lg font-medium text-gray-900 border-b border-gray-200 bg-transparent focus:border-gray-900 focus:ring-0 focus:outline-none px-1 py-1 flex-1"
              value={localSection.title || ''}
              onChange={(e) => handleLocalUpdate({ title: e.target.value })}
              placeholder="Section Title"
            />
            <button
              type="button"
              onClick={toggleLayout}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-50"
              title={`Switch to ${localSection.layout === 'table' ? 'text' : 'table'} layout`}
            >
              {localSection.layout === 'table' ? 
                <DocumentTextIcon className="w-5 h-5" /> : 
                <TableCellsIcon className="w-5 h-5" />
              }
            </button>
          </div>
        ) : (
          <h2 className="text-lg font-medium text-gray-900">{localSection.title}</h2>
        )}
        
        {isEditing && (
          <button
            type="button"
            onClick={() => onDelete(localSection.id)}
            className="text-gray-400 hover:text-red-600 transition-colors"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Content Section */}
      <div className="p-8">
        {localSection.layout === 'table' ? (
          isEditing ? (
            <TableEditor
              data={localSection.content}
              onChange={(tableData) => handleLocalUpdate({ content: tableData })}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    {localSection.content?.headers?.map((header, idx) => (
                      <th key={idx} className="px-4 py-2 text-sm font-medium text-gray-900">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {localSection.content?.rows?.map((row, rowIdx) => (
                    <tr key={rowIdx}>
                      {row.map((cell, cellIdx) => (
                        <td key={cellIdx} className="px-4 py-2 text-sm text-gray-700">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          isEditing ? (
            <textarea
              rows={8}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm resize-y"
              value={localSection.content || ''}
              onChange={(e) => handleLocalUpdate({ content: e.target.value })}
              placeholder="Enter section content here..."
            />
          ) : (
            <div className="prose prose-gray max-w-none">
              <p className="whitespace-pre-line text-gray-700">
                {localSection.content || 'No content added yet.'}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default PRDCustomSection;