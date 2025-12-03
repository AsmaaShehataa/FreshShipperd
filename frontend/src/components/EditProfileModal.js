// src/components/EditProfileModal.js - FIXED VERSION
import React, { useState, useEffect, useRef } from 'react';
import { profileAPI } from '../services/api';

const EditProfileModal = ({ isOpen, onClose, onProfileUpdated }) => {
  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    country: '',
    city: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Track if we've loaded initial data
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  // Load user data when modal opens - ONLY ONCE
  useEffect(() => {
    if (isOpen && currentUser && !initialLoadDone) {
      console.log('Loading initial user data');
      setFormData({
        first_name: currentUser.first_name || '',
        last_name: currentUser.last_name || '',
        phone: currentUser.phone || '',
        country: currentUser.country || '',
        city: currentUser.city || '',
        address: currentUser.address || '',
      });
      setInitialLoadDone(true);
      
      // Clear messages when modal opens
      setError('');
      setSuccess('');
    }
  }, [isOpen, currentUser, initialLoadDone]);

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      setInitialLoadDone(false);
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input changed: ${name} = ${value}`);
    
    // Use functional update to ensure we get the latest state
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      console.log('New formData:', newData);
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Clean the data - convert empty strings to null for Django
      const cleanedData = {
        ...formData,
        phone: formData.phone || null,
        country: formData.country || null,
        city: formData.city || null,
        address: formData.address || null,
      };
      
      console.log('Sending cleaned data:', cleanedData);
      
      const response = await profileAPI.updateProfile(cleanedData);
      console.log('API Response:', response.data);
      
      // Update local storage with new user data
      const updatedUser = {
        ...currentUser,
        ...response.data,
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Show success message
      setSuccess('Profile updated successfully!');
      
      // Call callback to refresh parent component after a delay
      setTimeout(() => {
        if (onProfileUpdated) {
          onProfileUpdated(updatedUser);
        }
        onClose();
      }, 1500);
      
    } catch (err) {
      console.error('Failed to update profile:', err);
      console.error('Error details:', err.response?.data);
      setError(err.response?.data?.error || 
               err.response?.data?.detail || 
               err.message || 
               'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Debug: Log current formData
  useEffect(() => {
    console.log('Current formData:', formData);
  }, [formData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
        
        {/* Debug info */}
        <div className="mb-2 text-xs text-gray-500">
          Form state loaded: {initialLoadDone ? 'Yes' : 'No'}
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <div className="text-xs text-gray-500 mt-1">
                Current: "{formData.first_name}"
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email (Read-only)
            </label>
            <input
              type="email"
              value={currentUser.email || ''}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="+1234567890"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Saudi Arabia"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Riyadh"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
              placeholder="Enter your full address"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
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
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;