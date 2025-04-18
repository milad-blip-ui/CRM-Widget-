import React, { useState, useEffect } from 'react';
// Helper functions for localStorage
const loadFilterState = () => {
  try {
    const saved = localStorage.getItem('quoteFilterState');
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    console.error("Failed to load filter state", e);
    return null;
  }
};

const saveFilterState = (filters) => {
  try {
    localStorage.setItem('quoteFilterState', JSON.stringify(filters));
  } catch (e) {
    console.error("Failed to save filter state", e);
  }
};
  const QuoteFilter = ({ onFilter }) => {
  const [filters, setFilters] = useState(() => {
    const saved = loadFilterState();
    return saved || [
      { field: 'Quote #', checked: false, operator: 'Is', value: '' },
      { field: 'Quote Name', checked: false, operator: 'Is', value: '' },
      { field: 'Account Name', checked: false, operator: 'Is', value: '' },
      { field: 'Salesperson', checked: false, operator: 'Is', value: '' },
      { field: 'Quote Date', checked: false, operator: 'Is', value: '' },
    ];
  });

  // Save to localStorage whenever filters change
  useEffect(() => {
    saveFilterState(filters);
  }, [filters]);

  const handleCheckboxChange = (index) => {
    const newFilters = [...filters];
    newFilters[index].checked = !newFilters[index].checked;
    if (!newFilters[index].checked) {
      newFilters[index].value = '';
    }
    setFilters(newFilters);
  };

  const handleOperatorChange = (index, operator) => {
    const newFilters = [...filters];
    newFilters[index].operator = operator;
    setFilters(newFilters);
  };

  const handleValueChange = (index, value) => {
    const newFilters = [...filters];
    newFilters[index].value = value;
    setFilters(newFilters);
  };

  const handleSearch = () => {
    const activeFilters = filters.filter(filter => filter.checked);
    onFilter(activeFilters);
  };

  const getOperatorsForField = (field) => {
    if (field === 'Quote Date') {
      return ['Is', 'Is Not', 'Is Empty', 'Is Not Empty'];
    }
    return [
      'Is',
      'Is Not',
      'Is Empty',
      'Is Not Empty',
      'Starts With',
      'Contains',
      'Not Contains'
    ];
  };

  return (
    <div className="text-sm">
      <div className="space-y-4">
        {filters.map((filter, index) => (
          <div key={filter.field} className="p-1 text-gray-600">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={filter.checked}
                onChange={() => handleCheckboxChange(index)}
                className="h-4 w-4 text-indigo-600"
              />
              <span className="ml-2 font-medium">{filter.field}</span>
            </div>

            {/* Dropdown with transition */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${filter.checked ? 'max-h-40 mt-2' : 'max-h-0'}`}>
              <div className="space-y-2">
                <select
                  value={filter.operator}
                  onChange={(e) => handleOperatorChange(index, e.target.value)}
                  className="block w-full p-2 text-sm rounded-md outline-none focus:outline-none focus:ring-0 focus:border-indigo-600 focus:shadow-none ring-0 border-gray-300"
                >
                  {getOperatorsForField(filter.field).map(op => (
                    <option key={op} value={op}>{op}</option>
                  ))}
                </select>

                {/* Text input with transition */}
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${filter.operator && filter.operator !== 'Is Empty' && filter.operator !== 'Is Not Empty' ? 'max-h-40' : 'max-h-0'}`}>
                  {filter.field === 'Quote Date' ? (
                    <input
                      type="date"
                      value={filter.value}
                      onChange={(e) => handleValueChange(index, e.target.value)}
                      className="block w-full p-2 text-sm rounded-md outline-none focus:outline-none focus:ring-0 focus:border-indigo-600 focus:shadow-none ring-0 border-gray-300"
                    />
                  ) : (
                    <input
                      type="text"
                      value={filter.value}
                      onChange={(e) => handleValueChange(index, e.target.value)}
                      placeholder={`Enter ${filter.field}`}
                      className="block w-full p-2 text-sm rounded-md outline-none focus:outline-none focus:ring-0 focus:border-indigo-600 focus:shadow-none ring-0 border-gray-300"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleSearch}
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition duration-150 ease-in-out transform hover:scale-105"
      >
        Search
      </button>
    </div>
  );
};

export default QuoteFilter;