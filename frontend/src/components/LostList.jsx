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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {loading ? (
          <p className="text-center col-span-full">Loading...</p>
        ) : filteredLostItems.length === 0 ? (
          <p className="text-center col-span-full">No lost items found.</p>
        ) : (
          filteredLostItems.map(item => (
            <div key={item.id} className="border p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-lg sm:text-xl mb-2 wrap-text">
                {splitText(item.item_name, 15).map((line, index) => (
                  <span key={index}>{line}<br /></span>
                ))}
              </h3>
              {item.item_name.toLowerCase() === 'cash' ? (
                <p className="text-sm sm:text-base mb-1 wrap-text">
                  Amount: {splitText(item.amount.toString(), 15).map((line, index) => (
                    <span key={index}>{line}<br /></span>
                  ))}
                </p>
              ) : (
                <p className="text-sm sm:text-base mb-1 wrap-text">
                  Item description: {splitText(item.description, 15).map((line, index) => (
                    <span key={index}>{line}<br /></span>
                  ))}
                </p>
              )}
              <p className="text-sm sm:text-base mb-1 wrap-text">
                Lost by: {splitText(item.person_name, 15).map((line, index) => (
                  <span key={index}>{line}<br /></span>
                ))}
              </p>
              <p className="text-sm sm:text-base mb-1 wrap-text">
                Date: {splitText(new Date(item.lost_date).toLocaleDateString(), 15).map((line, index) => (
                  <span key={index}>{line}<br /></span>
                ))}
              </p>
              <p className="text-sm sm:text-base mb-1 wrap-text">
                Location: {splitText(item.location, 15).map((line, index) => (
                  <span key={index}>{line}<br /></span>
                ))}
              </p>
              <p className="text-sm sm:text-base mb-1 wrap-text">
                Contact: {splitText(item.contact_number, 15).map((line, index) => (
                  <span key={index}>{line}<br /></span>
                ))}
              </p>
              <p className="text-sm sm:text-base mb-3 wrap-text">
                Email: {splitText(item.email, 15).map((line, index) => (
                  <span key={index}>{line}<br /></span>
                ))}
              </p>
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