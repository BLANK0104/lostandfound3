import React from 'react';

const TabNavigation = ({ activeTab, setActiveTab }) => (
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
);

export default TabNavigation;