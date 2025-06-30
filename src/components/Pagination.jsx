import React from "react";

const Pagination = ({ currentPage, totalPages, goToPage, goToPreviousPage, goToNextPage, getPageNumbers }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center space-x-2 mt-6">
      <button
        onClick={goToPreviousPage}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-lg bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <div className="flex items-center space-x-1">
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && goToPage(page)}
            disabled={page === '...'}
            className={`px-3 py-2 rounded-lg transition-colors ${
              page === currentPage
                ? 'bg-zinc-700 text-white'
                : page === '...'
                ? 'text-zinc-400 cursor-default'
                : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
            }`}
          >
            {page}
          </button>
        ))}
      </div>
      <button
        onClick={goToNextPage}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-lg bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination; 