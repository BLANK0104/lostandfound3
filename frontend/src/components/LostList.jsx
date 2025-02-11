import React, { useState, useEffect } from 'react';
import { fetchLostItems, markItemAsFound } from '../services/api';

const LostList = ({ setError }) => {
  const [loading, setLoading] = useState(false);
  const [lostItems, setLostItems] = useState([]);
  const [lostItemsSearch, setLostItemsSearch] = useState('');

  useEffect(() => {
    loadLostItems();
  }, []);

  const loadLostItems = async () => {
    try {
      setLoading(true);
      const data = await fetchLostItems();
      setLostItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsFound = async (itemId) => {
    try {
      setLoading(true);
      await markItemAsFound(itemId);
      loadLostItems();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const splitText = (text, length) => {
    const regex = new RegExp(`.{1,${length}}`, 'g');
    return text.match(regex);
  };

  const filteredLostItems = lostItems.filter(item =>
    item.item_name.toLowerCase().includes(lostItemsSearch.toLowerCase()) ||
    item.location.toLowerCase().includes(lostItemsSearch.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="max-w-lg mx-auto px-4 sm:px-0">
        <input
          type="text"
          placeholder="Search lost items..."
          value={lostItemsSearch}
          onChange={(e) => setLostItemsSearch(e.target.value)}
          className="w-full p-2 border rounded text-sm sm:text-base"
        />
      </div>
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <p className="text-center col-span-full">Loading...</p>
        ) : filteredLostItems.length === 0 ? (
          <p className="text-center col-span-full">No lost items found.</p>
        ) : (
          filteredLostItems.map(item => (
            <div key={item.id} className="border p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-lg sm:text-xl mb-2">{item.item_name}</h3>
              <p className="text-sm sm:text-base mb-1">Item description: {item.description}</p>
              <p className="text-sm sm:text-base mb-1">Lost by: {item.person_name}</p>
              <p className="text-sm sm:text-base mb-1">Date: {new Date(item.lost_date).toLocaleDateString()}</p>
              <p className="text-sm sm:text-base mb-1">Location: {item.location}</p>
              <p className="text-sm sm:text-base mb-1">Contact: {item.contact_number}</p>
              <p className="text-sm sm:text-base mb-3">Email: {item.email}</p>
              <button
                onClick={() => handleMarkAsFound(item.id)}
                className="w-full bg-green-500 text-black p-2 rounded text-sm sm:text-base hover:bg-green-600 transition-colors"
              >
                Mark as Found
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LostList;
