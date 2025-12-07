// src/components/dashboards/AdminDashboard.js
import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm">Total Employees</h3>
          <p className="text-3xl font-bold">24</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm">Active Boxes</h3>
          <p className="text-3xl font-bold">156</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm">Items Today</h3>
          <p className="text-3xl font-bold">342</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm">Revenue Today</h3>
          <p className="text-3xl font-bold">$5,234</p>
        </div>
      </div>
      
      {/* Admin Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Manage Employees</h2>
          <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
            View All Employees
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded">
            Add New Employee
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Reports & Analytics</h2>
          <button className="bg-purple-500 text-white px-4 py-2 rounded mr-2">
            Generate Report
          </button>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded">
            View Analytics
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;