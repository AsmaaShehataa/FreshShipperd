// src/components/Sidebar.js
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import EditProfileModal from './EditProfileModal';

const Sidebar = ({ user, onLogout, onProfileUpdated }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const location = useLocation();

  // Define ALL possible menu items
  const allMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/dashboard' },
    { id: 'boxes', label: 'International Boxes', icon: '📦', path: '/boxes' },
    { id: 'items', label: 'Items Management', icon: '📋', path: '/items' },
    { id: 'customers', label: 'Customers', icon: '👥', path: '/customers' },
    { id: 'scan', label: 'Scan Items', icon: '📱', path: '/scan' },
    { id: 'receive', label: 'Receive Packages', icon: '📦', path: '/receive' },
    { id: 'users', label: 'User Management', icon: '👥', path: '/users' },
    { id: 'reports', label: 'Reports', icon: '📊', path: '/reports' },
    { id: 'settings', label: 'Settings', icon: '⚙️', path: '/settings' },
  ];

  // Role-based menu filtering
  const getMenuItemsForRole = (role) => {
    switch(role) {
      case 'super_admin':
        // Super Admin sees everything
        return allMenuItems;
        
      case 'admin':
        // Admin sees most things but not full system settings
        return allMenuItems.filter(item => 
          !['users', 'reports'].includes(item.id) // Admins can't manage users or see reports
        );
        
      case 'employee':
        // Employee sees limited menu
        return allMenuItems.filter(item => 
          ['dashboard', 'boxes', 'items', 'customers', 'scan', 'receive', 'settings'].includes(item.id)
        );
        
      default:
        return [];
    }
  };

  const filteredMenuItems = getMenuItemsForRole(user?.role);

  return (
    <>
      <div className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 z-50">
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-700 bg-gray-800">
          <h1 className="text-2xl font-bold text-white">Shipperd</h1>
          <p className="text-gray-400 text-sm mt-1">Shipping Dashboard</p>
        </div>

        {/* User Profile Section */}
        <div className="p-4 border-b border-gray-700">
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                {user?.first_name?.[0]}
                {user?.last_name?.[0]}
              </div>

              <div className="flex-1 text-left">
                <p className="font-medium text-sm">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-gray-400 text-xs">
                  {user?.role === 'super_admin'
                    ? 'Super Admin'
                    : user?.role === 'admin'
                    ? 'Administrator'
                    : 'Employee'}
                </p>
              </div>

              <span className={`transition-transform ${showUserMenu ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                <div className="py-2">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      setShowEditProfile(true);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700 flex items-center gap-2"
                  >
                    <span>👤</span>
                    <span>Edit Profile</span>
                  </button>

                  <Link
                    to="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 flex items-center gap-2"
                  >
                    <span>⚙️</span>
                    <span>Settings</span>
                  </Link>

                  <hr className="border-gray-700 my-1" />

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-300 hover:bg-red-900/20 flex items-center gap-2"
                  >
                    <span>🚪</span>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2 mt-2">
          {filteredMenuItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                location.pathname === item.path
                  ? 'bg-blue-600 text-white shadow-lg border border-blue-500'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white border border-transparent'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium text-base">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        onProfileUpdated={onProfileUpdated}
      />
    </>
  );
};

export default Sidebar;