import { useState, useEffect, useMemo, useContext, useCallback } from 'react';
import { AppContext } from '../../context/AppContext';
import KanbanCard from '../../components/kanban/KanbanCard';
import QuoteFilter from '../../components/shared/QuoteFilter';
import updateEstimateStatus from '../../services/updateEstimateStatus';
import { PageSpinner } from '../../components/shared/Spinner';
import toast from 'react-hot-toast';
const statuses = [
  'Draft',
  'Sent for approval',
  'Internally Approved',
  'Sent to customer',
  'Accepted by customer',
  'Revised'
];
// Utility functions for localStorage
const loadFilters = () => {
  try {
    const saved = localStorage.getItem('kanbanFilters');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error("Failed to load filters", e);
    return [];
  }
};

const saveFilters = (filters) => {
  try {
    localStorage.setItem('kanbanFilters', JSON.stringify(filters));
  } catch (e) {
    console.error("Failed to save filters", e);
  }
};
const KanbanBoard = () => {
  const { allItems, loading, error, updateItemStatus, showSearchPanel, setShowSearchPanel } = useContext(AppContext);
  const [statusSpinner, setStatusSpinner] = useState(false);

  const [activeFilters, setActiveFilters] = useState(loadFilters());

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setShowSearchPanel(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  const [visibleItems, setVisibleItems] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [draggedOverColumn, setDraggedOverColumn] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [sortField, setSortField] = useState('Quote_date');
  const [sortDirection, setSortDirection] = useState('DESC');

  // Sorting function (pure, doesn't depend on state)
  const sortItems = useCallback((items) => {
    return [...items].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'Quote_date':
          comparison = new Date(a.Quote_date || 0) - new Date(b.Quote_date || 0);
          break;
        case 'Quote':
          comparison = (a.Quote || '').localeCompare(b.Quote || '');
          break;
        case 'SalespersonName':
          comparison = (a.SalespersonName || '').localeCompare(b.SalespersonName || '');
          break;
        case 'CRM_Account_Name_String':
          comparison = (a.CRM_Account_Name_String || '').localeCompare(b.CRM_Account_Name_String || '');
          break;
        default:
          comparison = new Date(a.Quote_date || 0) - new Date(b.Quote_date || 0);
      }
      return sortDirection === 'DESC' ? -comparison : comparison;
    });
  }, [sortField, sortDirection]);

  // First apply filters, then sort the filtered results
  const filteredAndSortedItems = useMemo(() => {
    // Apply filters
    const filtered = activeFilters.length === 0 
      ? allItems 
      : allItems.filter(item => {
          return activeFilters.every(filter => {
            const fieldMap = {
              'Quote #': 'Quote',
              'Quote Name': 'Quote_name',
              'Account Name': 'CRM_Account_Name_String',
              'Salesperson': 'SalespersonName',
              'Quote Date': 'Quote_date'
            };

            const dataKey = fieldMap[filter.field];
            const itemValue = item[dataKey];
            const filterValue = filter.value;

            // Handle date comparison
            if (filter.field === 'Quote Date') {
              if (!filterValue && filter.operator !== 'Is Empty' && filter.operator !== 'Is Not Empty') {
                return true;
              }
              const itemDate = new Date(itemValue).setHours(0,0,0,0);
              const filterDate = new Date(filterValue).setHours(0,0,0,0);
              
              switch (filter.operator) {
                case 'Is': return itemDate === filterDate;
                case 'Is Not': return itemDate !== filterDate;
                case 'Is Empty': return !itemValue;
                case 'Is Not Empty': return !!itemValue;
                default: return false;
              }
            }

            // Handle text/number fields
            const itemStr = String(itemValue || '').toLowerCase().trim();
            const filterStr = String(filterValue || '').toLowerCase().trim();

            // Strict matching for Quote #
            if (filter.field === 'Quote #' && filter.operator === 'Is') {
              return itemStr === filterStr;
            }

            switch (filter.operator) {
              case 'Is': return itemStr === filterStr;
              case 'Is Not': return itemStr !== filterStr;
              case 'Is Empty': return !itemStr;
              case 'Is Not Empty': return !!itemStr;
              case 'Starts With': return itemStr.startsWith(filterStr);
              case 'Contains': return itemStr.includes(filterStr);
              case 'Not Contains': return !itemStr.includes(filterStr);
              default: return false;
            }
          });
        });

    // Then sort the filtered results
    return sortItems(filtered);
  }, [allItems, activeFilters, sortItems]);

  // Status counts based on filtered and sorted items
  const statusCounts = useMemo(() => {
    return filteredAndSortedItems.reduce((acc, item) => {
      acc[item.Status] = (acc[item.Status] || 0) + 1;
      return acc;
    }, {});
  }, [filteredAndSortedItems]);

  // Initialize visible items
  useEffect(() => {
    const initialVisible = {};
    statuses.forEach(status => {
      initialVisible[status] = filteredAndSortedItems
        .filter(item => item.Status === status)
        .slice(0, 20);
    });
    setVisibleItems(initialVisible);
  }, [filteredAndSortedItems]);

  // Infinite scroll handler
  const handleScroll = useCallback((status, e) => {
    const element = e.target;
    const { scrollTop, scrollHeight, clientHeight } = element;
    
    if (scrollHeight - scrollTop <= clientHeight + 50) {
      const currentVisibleCount = visibleItems[status]?.length || 0;
      const totalItemsForStatus = filteredAndSortedItems.filter(item => item.Status === status).length;
      
      if (currentVisibleCount < totalItemsForStatus) {
        const nextItems = filteredAndSortedItems
          .filter(item => item.Status === status)
          .slice(currentVisibleCount, currentVisibleCount + 20);
        
        setVisibleItems(prev => ({
          ...prev,
          [status]: [...(prev[status] || []), ...nextItems]
        }));
      }
    }
  }, [filteredAndSortedItems, visibleItems]);

  // Drag and drop handlers (unchanged from your original)
  const handleDragStart = (e, item) => {
    e.dataTransfer.setData('text/plain', item.ID);
    setIsDragging(true);
    setDraggedItem(item);
    e.currentTarget.classList.add('opacity-30');
    
    const dragImage = new Image();
    dragImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(dragImage, 0, 0);
  };

  const handleDragEnd = (e) => {
    setIsDragging(false);
    setDraggedOverColumn(null);
    e.currentTarget.classList.remove('opacity-30');
    setDraggedItem(null);
  };

  const handleDragOver = (e, status) => {
    e.preventDefault();
    if (status !== draggedItem?.Status) {
      setDraggedOverColumn(status);
    } else {
      setDraggedOverColumn(null);
    }
  };

  const handleDragLeave = () => {
    setDraggedOverColumn(null);
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    toast.error("Move is disabled.");
    return;
    // if(targetStatus === "Sent to customer"){
    //   alert("modal");
    // }
  // try {
  //   const itemId = e.dataTransfer.getData("text/plain");
  //   console.log("draggedItem", draggedItem);
  //   console.log(targetStatus);
  //   setStatusSpinner(true);
  //   const response = await updateEstimateStatus(itemId, draggedItem, targetStatus);
  //   if(response.ID){
  //     if (targetStatus !== draggedItem?.Status) {
  //       updateItemStatus(itemId, targetStatus);
        
  //       const movedItem = filteredAndSortedItems.find(item => item.ID === itemId);
        
  //       if (movedItem) {
         
  //         const updatedItem = {
  //           ...movedItem,
  //           Status: targetStatus,
  //         };
          
  //         console.log('Card moved:', updatedItem);
  //       }
  //     }
      
  //     setDraggedOverColumn(null);
  //     setDraggedItem(null);
      
  //     setVisibleItems(prev => {
  //       const newVisible = { ...prev };
        
  //       statuses.forEach(status => {
  //         if (newVisible[status]) {
  //           newVisible[status] = newVisible[status].filter(item => item.ID !== itemId);
  //         }
  //       });
        
  //       const movedItem = filteredAndSortedItems.find(item => item.ID === itemId);
  //       if (movedItem) {
  //         const updatedItem = { ...movedItem, Status: targetStatus };
  //         const newColumnItems = [...(newVisible[targetStatus] || []), updatedItem];
  //         newVisible[targetStatus] = sortItems(newColumnItems).slice(0, 20);
  //       }
        
  //       return newVisible;
  //     });
  //   }
  // } catch (error) {
  //   console.error("Error in handleDrop:", error);
  //   toast.error("Failed to update item status. Please try again.");
  //   setDraggedOverColumn(null);
  //   setDraggedItem(null);
  // }finally{
  //   setStatusSpinner(false);
  // }
  };

  const handleFilter = (filters) => {
    const newFilters = filters.filter(f => f.checked);
    setActiveFilters(newFilters);
    saveFilters(newFilters); // Explicitly save after update
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  if (error) return (
    <div className="p-4 bg-red-100 text-red-700 rounded">
      Error loading data: {error}
    </div>
  );

  return (
    <div className="p-4 bg-gray-50">
      <div className='flex justify-end text-xs items-center mb-4 gap-2'>
        <label className=''>Sort By</label>
        <select 
          className="input-box w-32 text-xs"
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
        >
          <option value="Quote_date">Quote Date</option>
          <option value="Quote">Quote number</option>
          <option value="SalespersonName">Salesperson</option>
          <option value="CRM_Account_Name_String">Account Name</option>
        </select>
        <select 
          className="input-box w-[70px] text-xs"
          value={sortDirection}
          onChange={(e) => setSortDirection(e.target.value)}
        >
          <option value="ASC">ASC</option>
          <option value="DESC">DESC</option>
        </select>
      </div>
      <div className="relative">
        <div className="overflow-x-auto pb-4">
          <div className="flex space-x-4" style={{ width: `${statuses.length * 370}px` }}>
            {statuses.map(status => (
              <div 
                key={status}
                className={`w-[350px] flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden`}
                onDragOver={(e) => handleDragOver(e, status)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, status)}
              >
                <div className='bg-gray-50 pr-6 px-2'>
                  <div className={`flex items center justify-between p-3 border rounded-tl-lg rounded-tr-lg border-t-4  ${
                    status === 'Draft' ? 'bg-cyan-100 border-cyan-100 border-t-cyan-400' :
                    status === 'Sent for approval' ? 'bg-yellow-100 border-yellow-100 border-t-yellow-400' :
                    status === 'Internally Approved' ? 'bg-indigo-100 border-indigo-100 border-t-indigo-400' :
                    status === 'Sent to customer' ? 'bg-purple-100 border-purple-100 border-t-purple-400' :
                    status === 'Accepted by customer' ? 'bg-green-100 border-green-100 border-t-green-400' :
                    'bg-red-100 border-red-100 border-t-red-400'
                  }`}>
                    <h2 className="font-semibold text-gray-700">{status}</h2>
                    <span className={`inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium ${
                      status === 'Draft' ? 'bg-cyan-300' :
                      status === 'Sent for approval' ? 'bg-yellow-300' :
                      status === 'Internally Approved' ? 'bg-indigo-300' :
                      status === 'Sent to customer' ? 'bg-purple-300' :
                      status === 'Accepted by customer' ? 'bg-green-300' :
                      'bg-red-300'
                    } text-gray-700`}>{statusCounts[status] || 0}</span>
                  </div>
                </div>

                <div className="relative h-[67vh]">
                  <div 
                    className={`p-2 h-full overflow-y-scroll ${draggedOverColumn === status ? '' : ''}`}
                    onScroll={(e) => handleScroll(status, e)}
                  >
                    {visibleItems[status]?.map(item => (
                      <KanbanCard
                        key={item.ID}
                        item={item}
                        isDragging={draggedItem?.ID === item.ID}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                      />
                    ))}
                    
                    {visibleItems[status]?.length === 0 && !draggedOverColumn && (
                      <div className="text-center text-gray-500 py-4">
                        No items in this column
                      </div>
                    )}
                  </div>
                  
                  {draggedOverColumn === status && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center">
                      <div 
                        className="absolute inset-0 bg-indigo-50 ml-2 opacity-100"
                        style={{ width: 'calc(100% - 30px)' }}
                      ></div>
                      <div className="relative z-20 w-[calc(100%-3rem)] p-4 ml-1 mr-5 border-2 border-dashed border-indigo-400 rounded-lg bg-indigo-100 text-center">
                        <p className="text-indigo-600 font-medium">Drop here to move to</p>
                        <p className="text-indigo-600 font-bold text-lg">{status}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      { 
        <div className={`
          fixed top-[60px] right-0  w-[300px] h-[88vh] bg-white transition-all duration-300 ease-in-out z-[1000] overflow-y-auto p-5
          ${showSearchPanel ? "translate-x-0" : "translate-x-full"}
        `}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl text-gray-800 font-bold">Search Panel</h2>
            <button 
               onClick={()=>setShowSearchPanel(false)}
              className="text-red-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <hr></hr>
          <div className="space-y-3 mt-4">
            <QuoteFilter onFilter={handleFilter} />
          </div>
        </div>
      }
      {
        statusSpinner && <PageSpinner />
      }
    </div>
  );
};

export default KanbanBoard;











// import React, { useState, useContext, useEffect } from "react";
// import { DEFAULT_CARDS } from '../../data';
// import Column from "../../components/kanban/Column";
// import { EstimatesContext } from '../../context/EstimateContext';
// import { Link } from "react-router-dom";

// const Estimate = () => {
//   //const [cards, setCards] = useState([]);
//   const [cards, setCards] = useState(DEFAULT_CARDS);
//   //const { estimates } = useContext(EstimatesContext);

//   // useEffect(() => {
//   //   setCards(estimates);
//   // }, [estimates]);
//   // console.log("estimate in index page", cards);

//   return (
//     <div className="flex gap-3 overflow-auto h-[642px] p-3">
//       <Column
//         title="Draft"
//         Status="Draft"
//         headingColor="text-neutral-700"
//         cards={cards}
//         setCards={setCards}
//       />
//       <Column
//         title="Sent for approval"
//         Status="Sent for approval"
//         headingColor="text-yellow-700"
//         cards={cards}
//         setCards={setCards}
//       />
//       <Column
//         title="Internally Approved"
//         Status="Internally Approved"
//         headingColor="text-blue-700"
//         cards={cards}
//         setCards={setCards}
//       />
//       <Column
//         title="Sent to customer"
//         Status="Sent to customer"
//         headingColor="text-emerald-700"
//         cards={cards}
//         setCards={setCards}
//       />
//       <Column
//         title="Accepted by customer"
//         Status="Accepted by customer"
//         headingColor="text-emerald-700"
//         cards={cards}
//         setCards={setCards}
//       />
//       <Column
//         title="Revised"
//         Status="Revised"
//         headingColor="text-emerald-700"
//         cards={cards}
//         setCards={setCards}
//       />
//       {/* <BurnBarrel setCards={setCards} /> */}
//     </div>
//   );
// };

// export default Estimate;