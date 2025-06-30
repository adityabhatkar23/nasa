import React from "react";

const Loading = ({ message = "Loading..." }) => (
  <div className="bg-neutral-950 h-full w-full lg:p-6 p-3 mt-16 lg:mt-0 rounded-2xl flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-400 mx-auto mb-4"></div>
      <p className="text-zinc-300">{message}</p>
    </div>
  </div>
);

export default Loading; 