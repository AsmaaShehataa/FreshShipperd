// src/components/InternationalBoxes.js
import React, { useState, useEffect, useCallback } from 'react';
import { dashboardAPI } from '../services/api';

const InternationalBoxes = () => {
  const [boxes, setBoxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getDummyBoxes = useCallback(() => [
    {
      box_number: 'BOX-001',
      status: 'ready_to_ship',
      total_weight_kg: 12.5,
      items_count: 8,
      warehouse: { name: 'NY Warehouse' }
    },
    {
      box_number: 'BOX-002',
      status: 'building',
      total_weight_kg: 8.2,
      items_count: 5,
      warehouse: { name: 'LA Warehouse' }
    }
  ], []);

  const getStatusStyles = (status) => {
    const baseStyles = "px-3 py-1 rounded-full text-xs font-medium capitalize";
    switch (status) {
      case 'building': return `${baseStyles} bg-yellow-100 text-yellow-800`;
      case 'ready_to_ship': return `${baseStyles} bg-blue-100 text-blue-800`;
      case 'shipped': return `${baseStyles} bg-green-100 text-green-800`;
      default: return `${baseStyles} bg-gray-100 text-gray-800`;
    }
  };

  useEffect(() => {
    const fetchBoxes = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await dashboardAPI.getBoxes();
        setBoxes(response.data);
      } catch (error) {
        console.error('Error fetching boxes:', error);
        setError('Failed to load boxes. Showing sample data.');
        setBoxes(getDummyBoxes());
      } finally {
        setLoading(false);
      }
    };
    fetchBoxes();
  }, [getDummyBoxes]);

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-gray-600 text-lg">Loading boxes...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">International Boxes</h1>
        {error && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Box ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Weight</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Items Count</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Warehouse</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {boxes.map((box) => (
                <tr key={box.box_number} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{box.box_number}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusStyles(box.status)}>
                      {box.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{box.total_weight_kg.toFixed(1)} kg</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{box.items_count}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{box.warehouse?.name || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InternationalBoxes;