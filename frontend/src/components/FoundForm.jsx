import React, { useState } from 'react';
import { submitFoundItem } from '../services/api';

const FoundForm = ({ setError }) => {
  const [loading, setLoading] = useState(false);
  const [foundForm, setFoundForm] = useState({
    item_name: '',
    description: '',
    found_date: '',
    location: '',
    image: null
  });

  const handleFoundSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      const formattedDate = new Date(foundForm.found_date).toISOString();
      
      formData.append('item_name', foundForm.item_name);
      formData.append('description', foundForm.description);
      formData.append('found_date', formattedDate);
      formData.append('location', foundForm.location);
      if (foundForm.image) {
        formData.append('image', foundForm.image);
      }

      await submitFoundItem(formData);
      setFoundForm({
        item_name: '',
        description: '',
        found_date: '',
        location: '',
        image: null
      });
      alert('Found item reported successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleFoundSubmit} className="space-y-6 max-w-lg mx-auto px-4 sm:px-0 bg-gray-100 p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 gap-6">
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-2">Item Name</label>
          <input
            type="text"
            value={foundForm.item_name}
            onChange={(e) => setFoundForm({...foundForm, item_name: e.target.value})}
            className="p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-2">Description</label>
          <textarea
            value={foundForm.description}
            onChange={(e) => setFoundForm({...foundForm, description: e.target.value})}
            className="p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            required
            rows="3"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-2">Date Found</label>
          <input
            type="datetime-local"
            value={foundForm.found_date}
            onChange={(e) => setFoundForm({...foundForm, found_date: e.target.value})}
            className="p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-2">Location</label>
          <input
            type="text"
            value={foundForm.location}
            onChange={(e) => setFoundForm({...foundForm, location: e.target.value})}
            className="p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-2">Image</label>
          <input
            type="file"
            onChange={(e) => setFoundForm({...foundForm, image: e.target.files[0]})}
            className="p-2 border border-gray-300 rounded bg-white text-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            accept="image/*"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-black p-3 rounded font-medium hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};

export default FoundForm;