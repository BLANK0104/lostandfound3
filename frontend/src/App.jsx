import React, { useState, useEffect } from 'react';
import TabNavigation from './components/navigation/TabNavigation';
import LostItemForm from './components/forms/LostItemForm';
import FoundItemForm from './components/forms/FoundItemForm';
import ReportForm from './components/forms/ReportForm';
import ItemList from './components/lists/ItemList';
import ErrorAlert from './components/common/ErrorAlert';
import { submitLostItem, submitFoundItem, fetchLostItems, fetchFoundItems, generateReport } from './services/api';

function App() {
  // States
  const [activeTab, setActiveTab] = useState('lostForm');
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form states
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

  useEffect(() => {
    if (activeTab === 'lostList') loadLostItems();
    if (activeTab === 'foundList') loadFoundItems();
  }, [activeTab]);

  const handleLostSubmit = async (formData) => {
    try {
      setLoading(true);
      await submitLostItem(formData);
      setLostForm({
        item_name: '',
        person_name: '',
        lost_date: '',
        location: '',
        contact_number: '',
        email: ''
      });
      await loadLostItems();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFoundSubmit = async (formData) => {
    try {
      setLoading(true);
      await submitFoundItem(formData);
      setFoundForm({
        item_name: '',
        description: '',
        found_date: '',
        location: '',
        image: null
      });
      await loadFoundItems();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-2 sm:py-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-8">
        Lost and Found System
      </h1>

      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {error && <ErrorAlert error={error} onClose={() => setError(null)} />}

      <div className="mt-4">
        {activeTab === 'lostForm' && (
          <LostItemForm
            form={lostForm}
            setForm={setLostForm}
            onSubmit={handleLostSubmit}
            loading={loading}
          />
        )}

        {activeTab === 'foundForm' && (
          <FoundItemForm
            form={foundForm}
            setForm={setFoundForm}
            onSubmit={handleFoundSubmit}
            loading={loading}
          />
        )}

        {activeTab === 'lostList' && (
          <ItemList
            items={lostItems}
            type="lost"
            loading={loading}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        )}

        {activeTab === 'foundList' && (
          <ItemList
            items={foundItems}
            type="found"
            loading={loading}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        )}
      </div>
    </div>
  );
}

export default App;