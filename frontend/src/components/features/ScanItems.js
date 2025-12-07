// src/components/features/ScanItems.js
import React, { useState } from 'react';

const ScanItems = () => {
  const [scanResult, setScanResult] = useState('');
  const [scanning, setScanning] = useState(false);

  const handleScan = () => {
    setScanning(true);
    // Simulate scanning
    setTimeout(() => {
      setScanResult('ITEM-12345');
      setScanning(false);
    }, 1000);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Scan Items</h1>
      
      <div className="bg-white p-6 rounded-lg shadow max-w-md">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Scan Barcode/QR Code</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            {scanning ? (
              <div className="text-blue-500">
                <div className="animate-pulse">Scanning...</div>
              </div>
            ) : (
              <button
                onClick={handleScan}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg"
              >
                Click to Scan
              </button>
            )}
          </div>
        </div>
        
        {scanResult && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <p className="font-bold">Scanned: {scanResult}</p>
            <button className="mt-2 bg-green-500 text-white px-4 py-2 rounded">
              Add to System
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanItems;