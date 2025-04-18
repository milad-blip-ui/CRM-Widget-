import React, { useState } from 'react';
import DropIndicator from './DropIndicator';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
 
const Kanbanitem = ({item, 
  onDragStart, 
  onDragEnd  }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  const handleClick = () => {
    navigate(`/es-details/${item.ID}`); 
  };

  const toggleDropdown = (e) => {
    e.stopPropagation(); // Prevents the click event from bubbling up to the parent
    setDropdownVisible(prev => !prev);
  };

  const handleEdit = (e) => {
    e.stopPropagation(); // Prevent event from bubbling up
    //alert(`Edit option clicked for: ${item.ID}`);
    navigate(`/es-edit/${item.ID}`);
    setDropdownVisible(false); // Close dropdown after selection
  };

  const handleDelete = (e) => {
    e.stopPropagation(); // Prevent event from bubbling up
    alert(`Delete option clicked for: ${item.ID}`);
    setDropdownVisible(false); // Close dropdown after selection
  };
  
  return (
    <>
      <div
        draggable
        onDragStart={(e) => onDragStart(e, item)}
        onDragEnd={onDragEnd}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setDropdownVisible(false); 
        }}
        className={`cursor-pointer mb-3 active:cursor-grabbing w-full bg-white flex flex-col justify-between gap-2 items-start shadow-sm border border-gray-200 rounded-lg p-3`}
      >
        <div className='relative flex items-center w-full justify-between'>
          <h1 className='font-semibold text-indigo-600'>{item.Quote}</h1>

          <button 
            className={`transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
            onClick={toggleDropdown}
          >
            <i className="fa-regular fa-ellipsis"></i>
          </button>

          {/* Dropdown Menu */}
          {dropdownVisible && (
            <div className="absolute right-[-10px] text-gray-700 top-2 mt-2 w-30 text-sm bg-white border border-gray-300 rounded shadow-lg z-99">
              <button 
                onClick={handleEdit} 
                className="w-full text-left text-sm px-4 py-2 hover:bg-gray-100"
              >
                Edit
              </button>
              <button 
                onClick={handleDelete} 
                className="w-full text-left px-4 text-sm py-2 hover:bg-gray-100"
              >
                Delete
              </button>
            </div>
          )}
        </div>
        <p className="text-xs text-neutral-800">{item.Quote_name}</p>
        <div className='flex items-center w-full justify-between text-neutral-700 text-sm'>
          <p>
            {item.CRM_Account_Name_String 
              ? item.CRM_Account_Name_String.length > 10 
                ? `${item.CRM_Account_Name_String.substring(0, 10)}...` 
                : item.CRM_Account_Name_String 
              : ""}
          </p>
          <p>
            {item.SalespersonName
              ? item.SalespersonName.trim().length > 10 
                ? `${item.SalespersonName.trim().substring(0, 10)}...` 
                : item.SalespersonName.trim() 
              : ""}
          </p>
          <p>{item.Quote_date}</p>
        </div>
      </div>
    </>
  );
};

export default Kanbanitem;