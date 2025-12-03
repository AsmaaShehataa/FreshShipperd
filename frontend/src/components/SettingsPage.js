// src/components/SettingsPage.js
import React, { useState, useEffect } from 'react';
import { profileAPI } from '../services/api';

const SettingsPage = () => {
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const [activeTab, setActiveTab] = useState('notifications');
  const [settings, setSettings] = useState({
    email_notifications: true,
    sms_notifications: false,
    language: 'en',
    timezone: 'UTC',
  });
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Load settings when component mounts
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await profileAPI.getSettings();
      if (response.data) {
        setSettings(response.data);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const handleNotificationToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSelectChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = async () => {
    setLoading(true);
    setSaveMessage('');
    
    try {
      await profileAPI.updateSettings(settings);
      setSaveMessage('✓ Settings saved successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSaveMessage('✗ Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
    { id: 'security', label: 'Security', icon: '🔒' },
  ];

  // Add admin-only tabs
  if (user.is_admin) {
    tabs.push({ id: 'system', label: 'System', icon: '🖥️' });
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        {saveMessage && (
          <div className={`px-4 py-2 rounded-lg ${saveMessage.includes('✓') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {saveMessage}
          </div>
        )}
      </div>
      
      <div className="flex gap-6">
        {/* Sidebar Tabs */}
        <div className="w-64 bg-white rounded-lg shadow-sm p-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 ${
                activeTab === tab.id
                  ? 'bg-blue-50 text-blue-600 border border-blue-200'
                  : 'hover:bg-gray-50'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
          
          {/* Save Settings Button */}
          <button
            onClick={saveSettings}
            disabled={loading}
            className="w-full mt-6 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              '💾 Save Settings'
            )}
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-600">Receive order updates via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={settings.email_notifications}
                      onChange={() => handleNotificationToggle('email_notifications')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-gray-600">Receive delivery updates via SMS</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={settings.sms_notifications}
                      onChange={() => handleNotificationToggle('sms_notifications')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Preferences</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Language</label>
                  <select 
                    className="w-48 border rounded-lg px-3 py-2"
                    value={settings.language}
                    onChange={(e) => handleSelectChange('language', e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="ar">العربية (Arabic)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Timezone</label>
                  <select 
                    className="w-48 border rounded-lg px-3 py-2"
                    value={settings.timezone}
                    onChange={(e) => handleSelectChange('timezone', e.target.value)}
                  >
                    <option value="UTC">UTC</option>
                    <option value="Asia/Riyadh">Asia/Riyadh (GMT+3)</option>
                    <option value="Asia/Dubai">Asia/Dubai (GMT+4)</option>
                    <option value="America/New_York">America/New_York (GMT-5)</option>
                  </select>
                </div>

                {/* Employee-specific settings */}
                {user.role === 'employee' && (
                  <div>
                    <h3 className="font-medium mb-2">Scanning Preferences</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input type="checkbox" id="beep" className="mr-2" />
                        <label htmlFor="beep">Beep on successful scan</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="auto-submit" className="mr-2" />
                        <label htmlFor="auto-submit">Auto-submit after scan</label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Security</h2>
              <div className="space-y-4">
                <div>
                  <button className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                    🔑 Change Password
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-600">Add extra security to your account</p>
                  </div>
                  <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                    Enable
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Admin-only system settings */}
          {activeTab === 'system' && user.is_admin && (
            <div>
              <h2 className="text-xl font-semibold mb-4">System Settings</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Default Warehouse</label>
                  <select className="w-48 border rounded-lg px-3 py-2">
                    <option>All Warehouses</option>
                    <option>UAE Warehouse</option>
                    <option>US Warehouse</option>
                    <option>Egypt Warehouse</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Email Templates</label>
                  <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                    ✏️ Edit Templates
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;