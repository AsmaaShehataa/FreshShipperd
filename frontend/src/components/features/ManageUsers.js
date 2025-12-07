// src/components/features/ManageUsers.js - Make sure it's properly exported
import React from 'react';

const ManageUsers = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-600">Super Admin only - User management coming soon!</p>
      </div>
    </div>
  );
};

export default ManageUsers; // Make sure this is default export