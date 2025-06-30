import React from "react";

const ErrorMessage = ({ title = "Error", error, onRetry }) => (
  <div className="bg-neutral-950 h-full w-full lg:p-6 p-3 mt-16 lg:mt-0 rounded-2xl flex items-center justify-center">
    <div className="text-center">
      <p className="text-red-400 text-lg mb-4">{title}</p>
      <p className="text-zinc-300 mb-4">{error}</p>
      <button
        onClick={onRetry}
        className="bg-zinc-800 px-4 py-2 rounded-lg hover:bg-zinc-700 transition-colors text-zinc-200"
      >
        Try Again
      </button>
    </div>
  </div>
);

export default ErrorMessage; 