import React from 'react';

const LostItemForm = ({ form, setForm, onSubmit, loading }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto px-4 sm:px-0">
      <input
        type="text"
        placeholder="Item Name"
        value={form.item_name}
        onChange={(e) => setForm({...form, item_name: e.target.value})}
        className="w-full p-2 border rounded text-sm sm:text-base"
        required
      />
      <input
        type="text"
        placeholder="Your Name"
        value={form.person_name}
        onChange={(e) => setForm({...form, person_name: e.target.value})}
        className="w-full p-2 border rounded text-sm sm:text-base"
        required
      />
      <input
        type="datetime-local"
        value={form.lost_date}
        onChange={(e) => setForm({...form, lost_date: e.target.value})}
        className="w-full p-2 border rounded text-sm sm:text-base"
        required
      />
      <input
        type="text"
        placeholder="Location"
        value={form.location}
        onChange={(e) => setForm({...form, location: e.target.value})}
        className="w-full p-2 border rounded text-sm sm:text-base"
        required
      />
      <input
        type="tel"
        placeholder="Contact Number"
        value={form.contact_number}
        onChange={(e) => setForm({...form, contact_number: e.target.value})}
        className="w-full p-2 border rounded text-sm sm:text-base"
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({...form, email: e.target.value})}
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

export default LostItemForm;