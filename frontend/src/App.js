// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import InternationalBoxes from './components/InternationalBoxes';
import Sidebar from './components/Sidebar';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

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
            isAuthenticated ? 
              <Navigate to="/dashboard" /> : 
              <Login setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
          } 
        />
        
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? (
              <div className="flex min-h-screen bg-gray-100">
                <Sidebar 
                  activeTab={activeTab} 
                  setActiveTab={setActiveTab} 
                  user={user}
                  onLogout={handleLogout}
                />
                <div className="flex-1 ml-64">
                  <Dashboard />
                </div>
              </div>
            ) : <Navigate to="/login" />
          } 
        />
        
        <Route 
          path="/boxes" 
          element={
            isAuthenticated ? (
              <div className="flex min-h-screen bg-gray-100">
                <Sidebar 
                  activeTab={activeTab} 
                  setActiveTab={setActiveTab} 
                  user={user}
                  onLogout={handleLogout}
                />
                <div className="flex-1 ml-64">
                  <InternationalBoxes />
                </div>
              </div>
            ) : <Navigate to="/login" />
          } 
        />
        
        <Route 
          path="/" 
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
