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
    <form onSubmit={handleLostSubmit} className="space-y-6 max-w-lg mx-auto px-4 sm:px-0 bg-white p-6 rounded shadow-md">
      {[
        { label: 'Item Name', type: 'text', value: lostForm.item_name, name: 'item_name' },
        { label: 'Item Description', type: 'textarea', value: lostForm.description, name: 'description' },
        { label: 'Your Name', type: 'text', value: lostForm.person_name, name: 'person_name' },
        { label: 'Lost Date', type: 'datetime-local', value: lostForm.lost_date, name: 'lost_date' },
        { label: 'Location', type: 'text', value: lostForm.location, name: 'location' },
        { label: 'Contact Number', type: 'tel', value: lostForm.contact_number, name: 'contact_number' },
        { label: 'Email', type: 'email', value: lostForm.email, name: 'email' }
      ].map((field, index) => (
        <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <label className="w-full sm:w-1/3 text-left sm:text-right text-sm sm:text-base">{field.label}:</label>
          {field.type === 'textarea' ? (
            <textarea
              value={field.value}
              onChange={(e) => setLostForm({ ...lostForm, [field.name]: e.target.value })}
              className="w-full sm:w-2/3 p-2 border border-black rounded text-sm sm:text-base"
              rows="3"
              required
            />
          ) : (
            <input
              type={field.type}
              value={field.value}
              onChange={(e) => setLostForm({ ...lostForm, [field.name]: e.target.value })}
              className="w-full sm:w-2/3 p-2 border border-black rounded text-sm sm:text-base"
              required
            />
          )}
        </div>
      ))}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 text-black p-2 rounded text-sm sm:text-base hover:bg-green-600 disabled:bg-black-400"
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
  );
};

export default LostForm;
