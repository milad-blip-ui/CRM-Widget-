import React from 'react'
import KanbanCard from '../kanban/KanbanCard';

const AccordionItem = ({ title, isOpen, onToggle, records, currentActiveId }) => {
    return (
        <div className="border-b border-gray-200 px-2">
            <div 
                className="flex justify-between items-center py-2 cursor-pointer" 
                onClick={onToggle}
            >
                <h2 className="font-semibold">{title}</h2>
                <span>{records.length}</span>
            </div>
            {isOpen && (
                <div className="text-center">
                    {records.length > 0 ? (
                        records.map((record) => (
                            // Conditionally add a class based on whether the record is the current active one
                            <div key={record.ID} className={`${currentActiveId === record.ID ? ' border-indigo-500 border-b-[2px] rounded-lg' : 'border-transparent'} mb-2`}>
                                <KanbanCard item={record} />
                            </div>
                        ))
                    ) : (
                        <div className='h-10 flex items-center justify-center'><p>No records found for this status.</p></div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AccordionItem