import React, { useState } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState('lostForm');
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex space-x-4 mb-4">
        <button 
          className={`px-4 py-2 rounded ${activeTab === 'lostForm' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('lostForm')}>
          Report Lost Item
        </button>
        <button 
          className={`px-4 py-2 rounded ${activeTab === 'foundForm' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('foundForm')}>
          Report Found Item
        </button>
        <button 
          className={`px-4 py-2 rounded ${activeTab === 'lostList' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('lostList')}>
          Lost Items
        </button>
        <button 
          className={`px-4 py-2 rounded ${activeTab === 'foundList' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('foundList')}>
          Found Items
        </button>
      </div>

      <div className="mt-4">
        {activeTab === 'lostForm' && (
          <form className="space-y-4">
            <input type="text" placeholder="Item Name" className="w-full p-2 border rounded" />
            <input type="text" placeholder="Your Name" className="w-full p-2 border rounded" />
            <input type="datetime-local" className="w-full p-2 border rounded" />
            <input type="text" placeholder="Location" className="w-full p-2 border rounded" />
            <input type="tel" placeholder="Contact Number" className="w-full p-2 border rounded" />
            <input type="email" placeholder="Email" className="w-full p-2 border rounded" />
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Submit</button>
          </form>
        )}

        {activeTab === 'foundForm' && (
          <form className="space-y-4">
            <input type="text" placeholder="Item Name" className="w-full p-2 border rounded" />
            <textarea placeholder="Description" className="w-full p-2 border rounded" />
            <input type="datetime-local" className="w-full p-2 border rounded" />
            <input type="text" placeholder="Location" className="w-full p-2 border rounded" />
            <input type="url" placeholder="Image URL" className="w-full p-2 border rounded" />
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Submit</button>
          </form>
        )}

        {activeTab === 'lostList' && (
          <div className="grid gap-4">
            {/* Sample lost item */}
            <div className="border p-4 rounded">
              <h3 className="font-bold">Lost Item Name</h3>
              <p>Lost by: John Doe</p>
              <p>Date: 2024-03-20</p>
              <p>Location: Library</p>
              <p>Contact: 123-456-7890</p>
            </div>
          </div>
        )}

        {activeTab === 'foundList' && (
          <div className="grid gap-4">
            {/* Sample found item */}
            <div className="border p-4 rounded">
              <h3 className="font-bold">Found Item Name</h3>
              <p>Description: Sample description</p>
              <p>Date: 2024-03-20</p>
              <p>Location: Cafeteria</p>
              <img src="sample-url" alt="Found item" className="mt-2 max-w-xs" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;