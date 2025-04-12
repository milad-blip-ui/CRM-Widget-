import React, { useState, useEffect, useRef } from 'react';

const CustomDropdown = ({
  options = [],
  value,
  onChange,
  placeholder = "Select...",
  searchable = false,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);

  // Calculate and update dropdown position
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

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    if (!isOpen) {
      updatePosition();
    }
    setIsOpen(!isOpen);
  };

  // Handle option selection
  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
    setSearchTerm("");
  };

  // Close dropdown when clicking outside
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

  // Prevent body scrolling when dropdown is open
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

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={`relative ${className} text-sm text-gray-600 bg-white`} ref={triggerRef}>
      {/* Trigger Element */}
      <div
        className={`flex items-center justify-between p-2 px-3 border rounded-md cursor-pointer ${isOpen ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-gray-300'}`}
        onClick={toggleDropdown}
      >
        <span className="truncate">
          {selectedOption?.label || placeholder}
        </span>
        <i className="fa-solid fa-chevron-down text-xs"></i>
      </div>

      {/* Dropdown Content (Rendered in portal-like fashion) */}
      {isOpen && (
        <div className="fixed inset-0 z-[1000] pointer-events-none text-xs">
          <div 
            ref={dropdownRef}
            className="absolute z-[1001] pointer-events-auto bg-white border border-gray-300 rounded-md shadow-lg"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`,
              maxHeight: '60vh',
              overflowY: 'auto'
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
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                  />
                  {searchTerm && (
                    <span
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                      onClick={() => setSearchTerm("")}
                    >
                      ×
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Options List */}
            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`px-4 py-2 cursor-pointer hover:bg-indigo-50 ${value === option.value ? 'bg-indigo-100' : ''}`}
                    onClick={() => handleSelect(option.value)}
                  >
                    {option.label}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500">No options found</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;