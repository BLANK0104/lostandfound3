import React, { useState, useEffect } from 'react';
import { submitLostItem, submitFoundItem, fetchLostItems, fetchFoundItems, markItemAsFound, generateReport } from './services/api';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('lostForm');
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lostItemsSearch, setLostItemsSearch] = useState('');
  const [foundItemsSearch, setFoundItemsSearch] = useState('');

  const [lostForm, setLostForm] = useState({
    item_name: '',
    person_name: '',
    lost_date: '',
    location: '',
    contact_number: '',
    email: ''
  });

  const [foundForm, setFoundForm] = useState({
    item_name: '',
    description: '',
    found_date: '',
    location: '',
    image: null
  });

  const [reportForm, setReportForm] = useState({
    fromDate: '',
    toDate: ''
  });

  useEffect(() => {
    if (activeTab === 'lostList') loadLostItems();
    if (activeTab === 'foundList') loadFoundItems();
  }, [activeTab]);

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
        email: ''
      });
      alert('Lost item reported successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

  const handleReportGeneration = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await generateReport(
        new Date(reportForm.fromDate).toISOString(),
        new Date(reportForm.toDate).toISOString()
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredLostItems = lostItems.filter(item =>
    item.item_name.toLowerCase().includes(lostItemsSearch.toLowerCase()) ||
    item.location.toLowerCase().includes(lostItemsSearch.toLowerCase())
  );

  const filteredFoundItems = foundItems.filter(item =>
    item.item_name.toLowerCase().includes(foundItemsSearch.toLowerCase()) ||
    item.location.toLowerCase().includes(foundItemsSearch.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-2 sm:py-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-8">Lost and Found System</h1>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-6">
        <button
          onClick={() => setActiveTab('lostForm')}
          className={`px-4 py-2 rounded-lg text-sm sm:text-base ${
            activeTab === 'lostForm' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Report Lost Item
        </button>
        <button
          onClick={() => setActiveTab('foundForm')}
          className={`px-4 py-2 rounded-lg text-sm sm:text-base ${
            activeTab === 'foundForm' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Report Found Item
        </button>
        <button
          onClick={() => setActiveTab('lostList')}
          className={`px-4 py-2 rounded-lg text-sm sm:text-base ${
            activeTab === 'lostList' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Lost Items
        </button>
        <button
          onClick={() => setActiveTab('foundList')}
          className={`px-4 py-2 rounded-lg text-sm sm:text-base ${
            activeTab === 'foundList' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Found Items
        </button>
        <button
          onClick={() => setActiveTab('report')}
          className={`px-4 py-2 rounded-lg text-sm sm:text-base ${
            activeTab === 'report' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Generate Report
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded mb-4 text-sm sm:text-base">
          {error}
          <button onClick={() => setError(null)} className="float-right font-bold">×</button>
        </div>
      )}

      <div className="mt-4">
        {activeTab === 'lostForm' && (
          <form onSubmit={handleLostSubmit} className="space-y-4 max-w-lg mx-auto px-4 sm:px-0">
            <input
              type="text"
              placeholder="Item Name"
              value={lostForm.item_name}
              onChange={(e) => setLostForm({...lostForm, item_name: e.target.value})}
              className="w-full p-2 border rounded text-sm sm:text-base"
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
        )}

        {activeTab === 'foundForm' && (
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
        )}

        {activeTab === 'lostList' && (
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
                    <h3 className="font-bold text-lg sm:text-xl mb-2">{item.item_name}</h3>
                    <p className="text-sm sm:text-base mb-1">Lost by: {item.person_name}</p>
                    <p className="text-sm sm:text-base mb-1">Date: {new Date(item.lost_date).toLocaleDateString()}</p>
                    <p className="text-sm sm:text-base mb-1">Location: {item.location}</p>
                    <p className="text-sm sm:text-base mb-1">Contact: {item.contact_number}</p>
                    <p className="text-sm sm:text-base mb-3">Email: {item.email}</p>
                    <button
                      onClick={() => handleMarkAsFound(item.id)}
                      className="w-full bg-green-500 text-white p-2 rounded text-sm sm:text-base hover:bg-green-600 transition-colors"
                    >
                      Mark as Found
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'foundList' && (
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {loading ? (
                <p className="text-center col-span-full">Loading...</p>
              ) : filteredFoundItems.length === 0 ? (
                <p className="text-center col-span-full">No found items reported yet.</p>
              ) : (
                filteredFoundItems.map(item => (
                  <div key={item.id} className="border p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <h3 className="font-bold text-lg sm:text-xl mb-2">{item.item_name}</h3>
                    <p className="text-sm sm:text-base mb-1">{item.description}</p>
                    <p className="text-sm sm:text-base mb-1">Date: {new Date(item.found_date).toLocaleDateString()}</p>
                    <p className="text-sm sm:text-base mb-3">Location: {item.location}</p>
                    {item.image_url && (
                      <img 
                        src={`http://192.168.107.140:5000${item.image_url}`} 
                        alt={item.item_name} 
                        className="w-full h-40 sm:h-48 object-cover rounded-lg"
                      />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'report' && (
          <form onSubmit={handleReportGeneration} className="space-y-4 max-w-lg mx-auto px-4 sm:px-0">
            <div>
              <label className="block text-sm font-medium text-gray-700">From Date</label>
              <input
                type="date"
                value={reportForm.fromDate}
                onChange={(e) => setReportForm({...reportForm, fromDate: e.target.value})}
                className="w-full p-2 border rounded text-sm sm:text-base mt-1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">To Date</label>
              <input
                type="date"
                value={reportForm.toDate}
                onChange={(e) => setReportForm({...reportForm, toDate: e.target.value})}
                className="w-full p-2 border rounded text-sm sm:text-base mt-1"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white p-2 rounded text-sm sm:text-base hover:bg-blue-600 disabled:bg-gray-400"
            >
              {loading ? 'Generating...' : 'Generate Report'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default App;