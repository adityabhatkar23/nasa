import React from "react";

const DateRangeForm = ({
  specificDate,
  startDate,
  endDate,
  onSpecificDateChange,
  onStartDateChange,
  onEndDateChange,
  onSubmit,
  loading,
  submitLabel = "Fetch"
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="flex flex-col gap-2">
        <label className="text-zinc-300 font-medium">Specific Date</label>
        <input
          className="text-white bg-zinc-800 border border-zinc-600 py-3 rounded-lg px-3 w-full focus:outline-none focus:border-zinc-400 transition-colors"
          type="date"
          value={specificDate}
          onChange={onSpecificDateChange}
          max={new Date().toISOString().split('T')[0]}
        />
      </div>
      <div className="text-center text-zinc-400 text-sm">OR</div>
      <div className="flex flex-col gap-2">
        <label className="text-zinc-300 font-medium">Start Date</label>
        <input
          className="text-white bg-zinc-800 border border-zinc-600 py-3 rounded-lg px-3 w-full focus:outline-none focus:border-zinc-400 transition-colors"
          type="date"
          value={startDate}
          onChange={onStartDateChange}
          max={new Date().toISOString().split('T')[0]}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-zinc-300 font-medium">End Date</label>
        <input
          className="text-white bg-zinc-800 border border-zinc-600 py-3 rounded-lg px-3 w-full focus:outline-none focus:border-zinc-400 transition-colors"
          type="date"
          value={endDate}
          onChange={onEndDateChange}
          max={new Date().toISOString().split('T')[0]}
        />
      </div>
      <button
        type="submit"
        className="bg-zinc-800 w-full py-3 rounded-lg cursor-pointer font-medium hover:bg-zinc-700 transition-colors text-zinc-200"
        disabled={loading}
      >
        {loading ? "Loading..." : submitLabel}
      </button>
    </form>
  );
};

export default DateRangeForm; 