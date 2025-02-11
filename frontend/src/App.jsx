import React, { useState } from 'react';
import LostForm from './components/LostForm.jsx';
import FoundForm from './components/FoundForm.jsx';
import LostList from './components/LostList.jsx';
import FoundList from './components/FoundList.jsx';
import ReportForm from './components/ReportForm.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ReturnedItems from './components/ReturnedItems.jsx';
import './App.css';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('lostForm');
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleTabChange = (event) => {
    setActiveTab(event.target.value);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onLogin={handleLogin} isLoggedIn={!!user} userRole={user?.username} />
      <main className="flex-grow flex items-center justify-center pt-20 pb-10">
        <div className="w-full max-w-4xl mx-auto px-4">
          <div className="flex flex-col items-center space-y-6">
            <div className="w-full max-w-md">
              <select
                value={activeTab}
                onChange={handleTabChange}
                className="w-full px-6 py-3 rounded-lg text-base sm:text-lg bg-gray-200 border border-gray-400"
              >
                <option value="lostForm">Register Complaint</option>
                <option value="foundForm">Register Found Item</option>
                <option value="lostList">List of COmmplaints</option>
                <option value="foundList">Found Items</option>
                <option value="returnedItems">Returned Items</option>
                {user?.isAdmin && <option value="report">Generate Report</option>}
              </select>
            </div>

            {error && (
              <div className="w-full max-w-md bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {error}
                <button 
                  onClick={() => setError(null)} 
                  className="absolute top-2 right-2 font-bold hover:text-red-900"
                >
                  ×
                </button>
              </div>
            )}

            <div className="w-full max-w-xl">
              {activeTab === 'lostForm' && <LostForm setError={setError} />}
              {activeTab === 'foundForm' && <FoundForm setError={setError} />}
              {activeTab === 'lostList' && <LostList setError={setError} />}
              {activeTab === 'foundList' && <FoundList setError={setError} />}
              {activeTab === 'returnedItems' && <ReturnedItems setError={setError} />}
              {activeTab === 'report' && <ReportForm setError={setError} />}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;