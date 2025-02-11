import React, { useState } from 'react';
import LoginModal from './LoginModal';
import AddUserModal from './AddUserModal';

const Header = ({ onLogin, isLoggedIn, userRole }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  return (
    <header className="bg-gray-100 py-4 mt-8">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          Lost and Found System
        </h1>
        <div className="flex gap-4">
          {isLoggedIn ? (
            <>
              <span className="mr-4">Welcome, {userRole}</span>
              <button
                onClick={() => setShowAddUserModal(true)}
                className="px-4 py-2 bg-green-600 text-black rounded hover:bg-green-700 transition-colors"
              >
                Add User
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-4 py-2 bg-white text-blue-600 rounded hover:bg-blue-50 transition-colors"
            >
              Login
            </button>
          )}
        </div>
      </div>
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLogin={onLogin}
        />
      )}
      {showAddUserModal && (
        <AddUserModal
          onClose={() => setShowAddUserModal(false)}
        />
      )}
    </header>
  );
};

export default Header;