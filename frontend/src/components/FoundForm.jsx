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
    <form onSubmit={handleFoundSubmit} className="space-y-4 max-w-lg mx-auto px-4 sm:px-0">
      <input
        type="text"
        placeholder="Item Name"
        value={foundForm.item_name}
        onChange={(e) => setFoundForm({...foundForm, item_name: e.target.value})}
        className="w-full p-2 border rounded text-sm sm:text-base"
        required
      />
      <textarea
        placeholder="Description"
        value={foundForm.description}
        onChange={(e) => setFoundForm({...foundForm, description: e.target.value})}
        className="w-full p-2 border rounded text-sm sm:text-base"
        required
        rows="3"
      />
      <input
        type="datetime-local"
        value={foundForm.found_date}
        onChange={(e) => setFoundForm({...foundForm, found_date: e.target.value})}
        className="w-full p-2 border rounded text-sm sm:text-base"
        required
      />
      <input
        type="text"
        placeholder="Location"
        value={foundForm.location}
        onChange={(e) => setFoundForm({...foundForm, location: e.target.value})}
        className="w-full p-2 border rounded text-sm sm:text-base"
        required
      />
      <input
        type="file"
        onChange={(e) => setFoundForm({...foundForm, image: e.target.files[0]})}
        className="w-full p-2 border rounded text-sm sm:text-base"
        accept="image/*"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white p-2 rounded text-sm sm:text-base hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};

export default FoundForm;