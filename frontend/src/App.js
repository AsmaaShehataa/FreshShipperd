// src/App.js - CORRECTED VERSION
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import InternationalBoxes from './components/InternationalBoxes';
import Sidebar from './components/Sidebar';
import SettingsPage from './components/SettingsPage';
import CustomerManagement from './components/CustomerManagement';

// Feature components
import ScanItems from './components/features/ScanItems';
import ReceivePackages from './components/features/ReceivePackages';
import ManageUsers from './components/features/ManageUsers';
import Reports from './components/features/Reports';
import ItemsManagement from './components/ItemsManagement';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication on app load
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    const refreshToken = localStorage.getItem('refresh_token');
    
    // Call logout API if token exists
    if (refreshToken) {
      fetch('http://localhost:8000/api/auth/logout/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({ refresh: refreshToken }),
      }).catch(console.error);
    }

    // Clear local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');

    // Update state
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleProfileUpdated = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  const Layout = ({ children }) => {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar
          user={user}
          onLogout={handleLogout}
          onProfileUpdated={handleProfileUpdated}
        />
        <div className="flex-1 ml-64">
          {children}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading application...</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
            )
          }
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* International Boxes */}
        <Route
          path="/boxes"
          element={
            <ProtectedRoute>
              <Layout>
                <InternationalBoxes />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Items Management - TEMPORARILY USING InternationalBoxes */}
        <Route
          path="/items"
          element={
            <ProtectedRoute>
              <Layout>
                <ItemsManagement />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Customers */}
        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <Layout>
                <CustomerManagement />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Scan Items */}
        <Route
          path="/scan"
          element={
            <ProtectedRoute>
              <Layout>
                <ScanItems />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Receive Packages */}
        <Route
          path="/receive"
          element={
            <ProtectedRoute>
              <Layout>
                <ReceivePackages />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* User Management - Super Admin Only */}
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Layout>
                <ManageUsers />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Reports - Super Admin Only */}
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Layout>
                <Reports />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Settings */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Layout>
                <SettingsPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Default Route */}
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />}
        />
      </Routes>
    </Router>
  );
}

export default App;