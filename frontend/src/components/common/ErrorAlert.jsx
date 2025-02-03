import React from 'react';

const ErrorAlert = ({ error, onClose }) => {
  if (!error) return null;

  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded mb-4 text-sm sm:text-base relative animate-fade-in">
      <span>{error}</span>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-red-700 hover:text-red-900 font-bold"
        aria-label="Close error message"
      >
        ×
      </button>
    </div>
  );
};

export default ErrorAlert;