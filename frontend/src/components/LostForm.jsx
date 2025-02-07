import React, { useState } from 'react';
import { submitLostItem } from '../services/api';

const LostForm = ({ setError }) => {
  const [loading, setLoading] = useState(false);
  const [lostForm, setLostForm] = useState({
    item_name: '',
    person_name: '',
    lost_date: '',
    location: '',
    contact_number: '',
    email: '',
    description: ''
  });

  const handleLostSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formattedData = {
        ...lostForm,
        lost_date: new Date(lostForm.lost_date).toISOString()
      };
      await submitLostItem(formattedData);
      setLostForm({
        item_name: '',
        person_name: '',
        lost_date: '',
        location: '',
        contact_number: '',
        email: '',
        description: ''
      });
      alert('Lost item reported successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLostSubmit} className="space-y-4 max-w-lg mx-auto px-4 sm:px-0">
      <input
        type="text"
        placeholder="Item Name"
        value={lostForm.item_name}
        onChange={(e) => setLostForm({...lostForm, item_name: e.target.value})}
        className="w-full p-2 border rounded text-sm sm:text-base"
        required
      />
      <textarea
        placeholder="Item Description"
        value={lostForm.description}
        onChange={(e) => setLostForm({...lostForm, description: e.target.value})}
        className="w-full p-2 border rounded text-sm sm:text-base"
        rows="3"
        required
      />
      <input
        type="text"
        placeholder="Your Name"
        value={lostForm.person_name}
        onChange={(e) => setLostForm({...lostForm, person_name: e.target.value})}
        className="w-full p-2 border rounded text-sm sm:text-base"
        required
      />
      <input
        type="datetime-local"
        value={lostForm.lost_date}
        onChange={(e) => setLostForm({...lostForm, lost_date: e.target.value})}
        className="w-full p-2 border rounded text-sm sm:text-base"
        required
      />
      <input
        type="text"
        placeholder="Location"
        value={lostForm.location}
        onChange={(e) => setLostForm({...lostForm, location: e.target.value})}
        className="w-full p-2 border rounded text-sm sm:text-base"
        required
      />
      <input
        type="tel"
        placeholder="Contact Number"
        value={lostForm.contact_number}
        onChange={(e) => setLostForm({...lostForm, contact_number: e.target.value})}
        className="w-full p-2 border rounded text-sm sm:text-base"
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={lostForm.email}
        onChange={(e) => setLostForm({...lostForm, email: e.target.value})}
        className="w-full p-2 border rounded text-sm sm:text-base"
        required
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

export default LostForm;