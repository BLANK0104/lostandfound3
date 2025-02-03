import React, { useState } from 'react';

const FoundItemForm = ({ form, setForm, onSubmit, loading }) => {
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

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
      
      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({...form, description: e.target.value})}
        className="w-full p-2 border rounded text-sm sm:text-base"
        rows="3"
        required
      />
      
      <input
        type="datetime-local"
        value={form.found_date}
        onChange={(e) => setForm({...form, found_date: e.target.value})}
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
      
      <div className="space-y-2">
        <input
          type="file"
          onChange={handleImageChange}
          className="w-full p-2 border rounded text-sm sm:text-base"
          accept="image/*"
        />
        {imagePreview && (
          <img 
            src={imagePreview} 
            alt="Preview" 
            className="w-full h-48 object-cover rounded-lg"
          />
        )}
      </div>
      
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

FoundItemForm.defaultProps = {
  form: {
    item_name: '',
    description: '',
    found_date: '',
    location: '',
    image: null
  },
  loading: false
};

export default FoundItemForm;