import React from 'react';
import ReactPaginate from 'react-paginate';

const Pagination = ({ pageCount, onPageChange }) => {
  const isMobile = window.innerWidth < 768; // Consider mobile devices with screen width < 768px

  return (
    <ReactPaginate
      nextLabel={<span><i className='fa-solid fa-chevron-right'></i></span>}
      previousLabel={<span><i className='fa-solid fa-chevron-left'></i></span>}
      breakLabel="..."
      pageCount={pageCount}
      marginPagesDisplayed={isMobile ? 1 : 3} // Adjust for mobile
      pageRangeDisplayed={isMobile ? 2 : 2} // Adjust for mobile
      onPageChange={onPageChange}
      containerClassName="flex justify-center mt-4 flex-wrap" // Flex container for pagination
      pageClassName="mx-1" // Center page items
      pageLinkClassName={`px-[10px] py-1 border border-gray-300 rounded 
        ${isMobile ? 'text-sm' : 'text-base'} hover:bg-gray-200`} // Adjust sizing
      previousClassName="mx-1"
      previousLinkClassName={`px-2 py-1 border border-gray-300 rounded 
        ${isMobile ? 'text-sm' : 'text-base'} hover:bg-gray-200`}
      nextClassName="mx-1"
      nextLinkClassName={`px-2 py-1 border border-gray-300 rounded 
        ${isMobile ? 'text-sm' : 'text-base'} hover:bg-gray-200`}
      breakClassName="mx-1"
      breakLinkClassName={`px-2 py-1 border border-gray-300 rounded 
        hover:bg-gray-200`}
      activeClassName="bg-primary text-white py-[1px] lg:py-1 lg:mt-[-4px] rounded "
      disabledClassName="opacity-50 cursor-not-allowed"
    />
  );
};

export default Pagination;