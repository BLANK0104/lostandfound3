import React, { useState, useEffect } from 'react';
import LostForm from './components/LostForm.jsx/index.js';
import FoundForm from './components/FoundForm.jsx';
import LostList from './components/LostList.jsx/index.js';
import FoundList from './components/FoundList.jsx/index.js';
import ReportForm from './components/ReportForm.jsx/index.js';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('lostForm');
  const [error, setError] = useState(null);

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
        {activeTab === 'lostForm' && <LostForm setError={setError} />}
        {activeTab === 'foundForm' && <FoundForm setError={setError} />}
        {activeTab === 'lostList' && <LostList setError={setError} />}
        {activeTab === 'foundList' && <FoundList setError={setError} />}
        {activeTab === 'report' && <ReportForm setError={setError} />}
      </div>
    </div>
  );
}

export default App;