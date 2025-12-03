// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get current user from localStorage
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem('user') || '{}');
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          throw new Error('Not authenticated');
        }

        const response = await dashboardAPI.getStats();
        setStats(response.data);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleProfileUpdated = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  if (loading) {
    return (
      <div className="flex-1 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 min-h-screen p-6">
      {/* Clean header - NO Edit Profile button */}
      <header className="mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, {user.first_name || 'User'}!
          </h1>
          <p className="text-gray-600 mt-1">
            {user.role === 'super_admin' ? 'Super Administrator' : 
             user.role === 'admin' ? 'Administrator' : 'Employee'}
          </p>
        </div>
      </header>

      {/* Dashboard Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-600 font-medium text-sm uppercase tracking-wide">
              Total International Boxes
            </h3>
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
              📦
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-2">
            {stats?.total_international_boxes || 0}
          </div>
          <div className="text-green-500 text-sm font-medium">+12%</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-600 font-medium text-sm uppercase tracking-wide">
              Active Items
            </h3>
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white">
              📋
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-2">
            {stats?.active_items || 0}
          </div>
          <div className="text-green-500 text-sm font-medium">+8%</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-600 font-medium text-sm uppercase tracking-wide">
              Total Customers
            </h3>
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white">
              👥
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-2">
            {stats?.total_customers || 0}
          </div>
          <div className="text-green-500 text-sm font-medium">+5%</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-600 font-medium text-sm uppercase tracking-wide">
              Revenue
            </h3>
            <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center text-white">
              💰
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-2">
            ${stats?.revenue || 0}
          </div>
          <div className="text-green-500 text-sm font-medium">+15%</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;