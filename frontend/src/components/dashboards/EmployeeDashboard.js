// src/components/dashboards/EmployeeDashboard.js
import React from 'react';

const EmployeeDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Employee Dashboard</h1>
      
      {/* Quick Actions for Employees */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-bold mb-2">📱 Scan Items</h3>
          <p className="text-gray-600 mb-4">Scan new items into the system</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Start Scanning
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-bold mb-2">📦 Receive Packages</h3>
          <p className="text-gray-600 mb-4">Receive packages from delivery</p>
          <button className="bg-green-500 text-white px-4 py-2 rounded">
            Receive Now
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-bold mb-2">📦 Create Box</h3>
          <p className="text-gray-600 mb-4">Create new international box</p>
          <button className="bg-purple-500 text-white px-4 py-2 rounded">
            Create Box
          </button>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        {/* Add activity feed here */}
      </div>
    </div>
  );
};

export default EmployeeDashboard;