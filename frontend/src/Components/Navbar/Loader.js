import React from "react";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-white via-blue-50 to-blue-100 backdrop-blur-sm">
      <div className="w-16 h-16 border-4 border-t-blue-600 border-b-blue-600 border-l-transparent border-r-transparent rounded-full animate-spin shadow-xl"></div>
      <p className="mt-4 text-lg text-blue-600 font-semibold animate-pulse">Loading...</p>
    </div>
  );
}
