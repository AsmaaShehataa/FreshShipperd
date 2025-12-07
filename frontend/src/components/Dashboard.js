// src/components/Dashboard.js - UPDATED
import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';
import EmployeeDashboard from './dashboards/EmployeeDashboard';
import AdminDashboard from './dashboards/AdminDashboard';
import SuperAdminDashboard from './dashboards/SuperAdminDashboard';

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
    return <div className="flex-1 bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="text-gray-600">Loading dashboard...</div>
    </div>;
  }

  if (error) {
    return <div className="flex-1 bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="text-red-600">{error}</div>
    </div>;
  }

  // Render different dashboard based on role
  const renderDashboard = () => {
    switch(user?.role) {
      case 'super_admin':
        return <SuperAdminDashboard stats={stats} user={user} />;
      case 'admin':
        return <AdminDashboard stats={stats} user={user} />;
      case 'employee':
        return <EmployeeDashboard stats={stats} user={user} />;
      default:
        return <div>Unknown role</div>;
    }
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      {renderDashboard()}
    </div>
  );
};

export default Dashboard;