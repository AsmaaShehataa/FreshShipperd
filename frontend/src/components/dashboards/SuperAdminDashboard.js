// src/components/dashboards/SuperAdminDashboard.js
import React from 'react';

const SuperAdminDashboard = ({ stats, user }) => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user?.first_name || 'Super Admin'}!</h1>
      <p className="text-gray-600 mb-6">Super Administrator Dashboard</p>
      
      {/* Super Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-600 font-medium text-sm">Total Users</h3>
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
              👥
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-2">
            {stats?.total_users || 0}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-600 font-medium text-sm">System Revenue</h3>
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white">
              💰
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-2">
            ${stats?.total_revenue || 0}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-600 font-medium text-sm">Active Warehouses</h3>
            <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center text-white">
              🏢
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-2">
            {stats?.active_warehouses || 0}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-600 font-medium text-sm">System Health</h3>
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white">
              ⚡
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-2">
            {stats?.system_health || '100%'}
          </div>
        </div>
      </div>
      
      {/* Super Admin Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">⚙️ System Settings</h2>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-blue-50 rounded-lg hover:bg-blue-100">
              Manage All Users
            </button>
            <button className="w-full text-left p-3 bg-green-50 rounded-lg hover:bg-green-100">
              System Configuration
            </button>
            <button className="w-full text-left p-3 bg-purple-50 rounded-lg hover:bg-purple-100">
              Database Management
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">📊 Advanced Analytics</h2>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100">
              Full System Reports
            </button>
            <button className="w-full text-left p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100">
              Financial Analytics
            </button>
            <button className="w-full text-left p-3 bg-pink-50 rounded-lg hover:bg-pink-100">
              User Activity Logs
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">🔧 System Tools</h2>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-red-50 rounded-lg hover:bg-red-100">
              Backup & Restore
            </button>
            <button className="w-full text-left p-3 bg-teal-50 rounded-lg hover:bg-teal-100">
              API Management
            </button>
            <button className="w-full text-left p-3 bg-orange-50 rounded-lg hover:bg-orange-100">
              Security Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;