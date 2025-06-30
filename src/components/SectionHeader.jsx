import React from "react";

const SectionHeader = ({ title, count, currentPage, totalPages, startIndex, endIndex, children }) => (
  <div className="flex items-center justify-between">
    <h1 className="text-2xl font-bold text-zinc-200">{title}</h1>
    <div className="text-right">
      <p className="text-zinc-300">{count}</p>
      {totalPages > 1 && (
        <p className="text-sm text-zinc-400">
          Page {currentPage} of {totalPages} ({startIndex + 1}-{endIndex} of {count})
        </p>
      )}
      {children}
    </div>
  </div>
);

export default SectionHeader; 