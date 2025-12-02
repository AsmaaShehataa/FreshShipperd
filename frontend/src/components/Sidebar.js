// src/components/Sidebar.js
import React from 'react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'boxes', label: 'International Boxes', icon: '📦' },
    { id: 'items', label: 'Items Management', icon: '📋' },
    { id: 'customers', label: 'Customers', icon: '👥' },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 z-50">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-700 bg-gray-800">
        <h1 className="text-2xl font-bold text-white">Shipperd</h1>
        <p className="text-gray-400 text-sm mt-1">Shipping Dashboard</p>
      </div>
      
      {/* Navigation Menu */}
      <nav className="p-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === item.id
                ? 'bg-blue-600 text-white shadow-lg border border-blue-500'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white border border-transparent'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium text-base">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;