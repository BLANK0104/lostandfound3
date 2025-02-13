import React, { useState, useEffect } from 'react';
import { fetchFoundItems, markFoundItemAsClaimed } from '../services/api';
import ClaimForm from './ClaimForm';

const FoundList = ({ setError }) => {
  const [loading, setLoading] = useState(false);
  const [foundItems, setFoundItems] = useState([]);
  const [foundItemsSearch, setFoundItemsSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    loadFoundItems();
  }, []);

  const loadFoundItems = async () => {
    try {
      setLoading(true);
      const data = await fetchFoundItems();
      setFoundItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimSubmit = async (claimData) => {
    try {
      setLoading(true);
      await markFoundItemAsClaimed(claimData);
      setFoundItems(foundItems.filter(item => item.id !== claimData.item_id));
      setSelectedItem(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const splitText = (text, limit) => {
    const regex = new RegExp(`.{1,${limit}}`, 'g');
    return text.match(regex).join('\n');
  };

  const filteredFoundItems = foundItems.filter(item => 
    !item.is_claimed && 
    (item.item_name.toLowerCase().includes(foundItemsSearch.toLowerCase()) ||
    item.location.toLowerCase().includes(foundItemsSearch.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="max-w-lg mx-auto px-4 sm:px-0">
        <input
          type="text"
          placeholder="Search found items..."
          value={foundItemsSearch}
          onChange={(e) => setFoundItemsSearch(e.target.value)}
          className="w-full p-2 border rounded text-sm sm:text-base"
        />
      </div>
      {selectedItem && (
        <ClaimForm
          item={selectedItem}
          onSubmit={handleClaimSubmit}
          onCancel={() => setSelectedItem(null)}
        />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {loading ? (
          <p className="text-center col-span-full">Loading...</p>
        ) : filteredFoundItems.length === 0 ? (
          <p className="text-center col-span-full">No found items reported yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredFoundItems.map(item => (
              <div key={item.id} className="border p-4 rounded-lg">
                <h3 className="font-bold text-lg sm:text-xl mb-2">{splitText(item.item_name, 15)}</h3>
                {item.sub_category && (
                  <p className="text-sm text-gray-600">Type: {item.sub_category}</p>
                )}
                {item.item_name.toLowerCase() === 'cash' ? (
                  <p className="text-sm sm:text-base mb-1">Amount: {splitText(item.amount.toString(), 15)}</p>
                ) : (
                  <p className="text-sm sm:text-base mb-1">{splitText(item.description, 15)}</p>
                )}
                <p className="text-sm sm:text-base mb-1">Date: {new Date(item.found_date).toLocaleDateString()}</p>
                <p className="text-sm sm:text-base mb-3">Location: {splitText(item.location, 15)}</p>
                {item.image_url && (
                  <img 
                    src={`http://192.168.107.140:5000${item.image_url}`} 
                    alt={item.item_name} 
                    className="w-full h-40 sm:h-48 object-cover rounded-lg"
                  />
                )}
                <button
                  onClick={() => setSelectedItem(item)}
                  className="w-full bg-green-500 text-black p-2 rounded text-sm sm:text-base hover:bg-green-600 transition-colors"
                >
                  Mark as Claimed
                </button>
              </div>  
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FoundList;