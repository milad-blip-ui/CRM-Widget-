import React, { useState, useEffect, useRef, useCallback } from 'react';

// Debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// API Service
const fetchAccounts = async (searchTerm = '', page = 1, pageSize = 10) => {
  try {
    let response;
    
    if (searchTerm) {
      const query = `(Account_Name:starts_with:${encodeURIComponent(searchTerm)})`;
      response = await window.ZOHO.CRM.API.searchRecord({
        Entity: "Accounts",
        Type: "criteria",
        Query: query,
        page: page,
        per_page: pageSize,
        sort_order: "asc"
      });
    } else {
      response = await window.ZOHO.CRM.API.getAllRecords({
        Entity: "Accounts",
        sort_order: "asc",
        per_page: pageSize,
        page: page
      });
    }

    return {
      data: response?.data?.map(account => ({
        value: account.id,
        label: account.Account_Name || `Account #${account.id}`
      })) || [],
      hasMore: response?.data?.length === pageSize
    };
    
  } catch (error) {
    console.error('Zoho API Error:', error);
    return { data: [], hasMore: false };
  }
};

const AccountDropdown = ({
  value,
  onChange,
  placeholder = "Select...",
  searchable = false,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [hasFetchedInitialData, setHasFetchedInitialData] = useState(false);
  
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);
  const optionsListRef = useRef(null);

  // Fetch accounts with debounce
  const fetchAccountsData = useCallback(async (reset = false) => {
    if (!isOpen) return;
    
    setLoading(true);
    try {
      const newPage = reset ? 1 : page;
      const response = await fetchAccounts(debouncedSearchTerm, newPage, 10);
      
      if (reset) {
        setOptions(response.data);
        setPage(1);
      } else {
        setOptions(prev => [...prev, ...response.data]);
      }
      
      setHasMore(response.hasMore);
      if (reset && !debouncedSearchTerm) {
        setHasFetchedInitialData(true);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [isOpen, debouncedSearchTerm, page]);

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (!optionsListRef.current || loading || !hasMore) return;
    
    const { scrollTop, scrollHeight, clientHeight } = optionsListRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 20) {
      setPage(prev => prev + 1);
    }
  }, [loading, hasMore]);

  // Position calculation
  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    if (!isOpen) {
      updatePosition();
      setSearchTerm("");
      if (!hasFetchedInitialData) {
        setOptions([]);
        setPage(1);
        setHasMore(true);
      }
    }
    setIsOpen(!isOpen);
  };

  // Option selection
  const handleSelect = (val, label) => {
    onChange(val, label); // Now passes both value and label
    setIsOpen(false);
    setSearchTerm("");
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
         (!triggerRef.current || !triggerRef.current.contains(event.target))) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('dropdown-open');
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition);
    } else {
      document.body.classList.remove('dropdown-open');
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    }
    return () => {
      document.body.classList.remove('dropdown-open');
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isOpen]);

  // Fetch data when dropdown opens or search term changes
  useEffect(() => {
    if (isOpen && (!hasFetchedInitialData || debouncedSearchTerm)) {
      fetchAccountsData(true);
    }
  }, [isOpen, debouncedSearchTerm]);

  // Infinite scroll load more
  useEffect(() => {
    if (page > 1) {
      fetchAccountsData();
    }
  }, [page]);

  // Add scroll listener
  useEffect(() => {
    const listElement = optionsListRef.current;
    if (listElement && isOpen) {
      listElement.addEventListener('scroll', handleScroll);
      return () => listElement.removeEventListener('scroll', handleScroll);
    }
  }, [isOpen, handleScroll]);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={`relative ${className} text-sm text-gray-600 bg-white`} ref={triggerRef}>
      {/* Trigger */}
      <div
        className={`flex items-center justify-between p-2 px-3 border rounded-md cursor-pointer ${isOpen ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-gray-300'}`}
        onClick={toggleDropdown}
      >
        <span className="truncate">
          {selectedOption?.label || placeholder}
        </span>
        <i className={`fa-solid fa-chevron-down text-xs`}></i>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="fixed inset-0 z-[1000] pointer-events-none">
          <div 
            ref={dropdownRef}
            className="absolute z-[1001] pointer-events-auto bg-white border border-gray-300 rounded-md shadow-lg"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`,
              maxHeight: '60vh',
              overflow: 'hidden'
            }}
          >
            {/* Search Input */}
            {searchable && (
              <div className="p-2 border-b">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </span>
                  <input
                    type="text"
                    placeholder="Search accounts..."
                    className="w-full pl-10 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                  />
                  {searchTerm && (
                    <button
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setSearchTerm("")}
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Options List */}
            <div 
              ref={optionsListRef}
              className="max-h-60 overflow-y-auto"
            >
              {options.length > 0 ? (
                <>
                  {options.map((option) => (
                    <div
                      key={option.value}
                      className={`px-4 py-2 cursor-pointer hover:bg-indigo-50 flex items-center ${value === option.value ? 'bg-indigo-100 font-medium' : ''}`}
                      onClick={() => handleSelect(option.value, option.label)}
                    >
                      {option.label}
                      {value === option.value && (
                        <i className="fa-solid fa-check ml-auto text-indigo-600 text-xs"></i>
                      )}
                    </div>
                  ))}
                  {loading && (
                    <div className="px-4 py-2 text-gray-500 flex items-center justify-center">
                    {loading ? <div className="w-3 h-3 rounded-full animate-l5"></div> : 'No options found'}
                  </div>
                  )}
                </>
              ) : (
                <div className="px-4 py-2 text-gray-500">
                  {loading ? (
                    <div className="px-4 py-2 text-gray-500 flex items-center justify-center">
                    {loading ? <div className="w-3 h-3 rounded-full animate-l5"></div> : 'No options found'}
                  </div>
                  ) : (
                    'No accounts found'
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountDropdown;