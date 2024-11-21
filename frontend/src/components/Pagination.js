import React from 'react';

const Pagination = ({ 
  currentPage, 
  lastPage, 
  total, 
  onPageChange,
  className = ""
}) => {
  return (
    <div className={`mt-4 flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-700">
          Showing page {currentPage} of {lastPage}
        </span>
        <span className="text-sm text-gray-700">
          ({total} total records)
        </span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded ${
            currentPage === 1
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          Previous
        </button>
        <div className="flex gap-1">
          {[...Array(lastPage)].map((_, index) => {
            const pageNumber = index + 1;
            const isCurrentPage = pageNumber === currentPage;
            const isNearCurrentPage = 
              Math.abs(pageNumber - currentPage) <= 1 || 
              pageNumber === 1 || 
              pageNumber === lastPage;

            // Show ellipsis instead of page numbers that are far from current page
            if (!isNearCurrentPage) {
              if (pageNumber === 2 || pageNumber === lastPage - 1) {
                return <span key={pageNumber} className="px-2 py-1">...</span>;
              }
              return null;
            }

            return (
              <button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                className={`px-3 py-1 rounded ${
                  isCurrentPage
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === lastPage}
          className={`px-3 py-1 rounded ${
            currentPage === lastPage
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;