import React, { useState } from 'react';
import DropIndicator from './DropIndicator';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
 
const Card = ({ card, handleDragStart }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  const handleClick = () => {
    navigate(`/es-details/${card.ID}`); 
  };

  const toggleDropdown = (e) => {
    e.stopPropagation(); // Prevents the click event from bubbling up to the parent
    setDropdownVisible(prev => !prev);
  };

  const handleEdit = (e) => {
    e.stopPropagation(); // Prevent event from bubbling up
    //alert(`Edit option clicked for: ${card.ID}`);
    navigate(`/es-edit/${card.ID}`);
    setDropdownVisible(false); // Close dropdown after selection
  };

  const handleDelete = (e) => {
    e.stopPropagation(); // Prevent event from bubbling up
    alert(`Delete option clicked for: ${card.ID}`);
    setDropdownVisible(false); // Close dropdown after selection
  };
  
  return (
    <>
      <DropIndicator beforeId={card.ID} Status={card.Status} />
      <motion.div
        layout
        layoutId={card.ID}
        draggable="true"
        onDragStart={(e) => handleDragStart(e, { Quote: card.Quote, ID: card.ID, Status: card.Status })}
        className={`cursor-pointer active:cursor-grabbing w-full bg-white flex flex-col justify-between gap-2 items-start shadow-sm rounded-lg p-3`}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setDropdownVisible(false);  // Close dropdown when mouse leaves the Card
        }}
      >
        <div className='relative flex items-center w-full justify-between'>
          <h1 className='font-semibold text-indigo-600'>{card.Quote}</h1>

          <button 
            className={`transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
            onClick={toggleDropdown}
          >
            <i className="fa-regular fa-ellipsis"></i>
          </button>

          {/* Dropdown Menu */}
          {dropdownVisible && (
            <div className="absolute right-[-150px] text-gray-700 top-2 mt-2 w-40 bg-white border border-gray-300 rounded shadow-lg z-10">
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
        <p className="text-xs text-neutral-800">{card.Quote_name}</p>
        <div className='flex items-center w-full justify-between text-neutral-700 text-sm'>
          <p>
            {card.CRM_Account_Name_String 
              ? card.CRM_Account_Name_String.length > 10 
                ? `${card.CRM_Account_Name_String.substring(0, 10)}...` 
                : card.CRM_Account_Name_String 
              : ""}
          </p>
          <p>
            {card.SalespersonName
              ? card.SalespersonName.trim().length > 10 
                ? `${card.SalespersonName.trim().substring(0, 10)}...` 
                : card.SalespersonName.trim() 
              : ""}
          </p>
          <p>{card.Quote_date}</p>
        </div>
      </motion.div>
    </>
  );
};

export default Card;