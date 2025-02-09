import React from 'react';

const Header = () => {
  return (
    <header className="bg-blue-600 text-white py-4 fixed top-0 z-50 w-auto">
      <div className="px-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-left">
          Lost and Found
        </h1>
      </div>
    </header>
  );
};

export default Header;