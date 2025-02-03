import React from 'react';

const ItemsList = ({ items, type, handleMarkAsFound, loading, searchTerm, setSearchTerm }) => (
  <div className="space-y-4">
    <div className="max-w-lg mx-auto px-4 sm:px-0">
      <input
        type="text"
        placeholder={`Search ${type} items...`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border rounded text-sm sm:text-base"
      />
    </div>
    {/* ...items grid... */}
  </div>
);

export default ItemsList;