import React, { useState } from 'react';
import { Power, Activity } from 'lucide-react';
import { sendCommand } from '../services/api';

const ControlPanel = ({ onCommandSent }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleCommand = async (command) => {
    setLoading(true);
    setMessage('');

    try {
      const response = await sendCommand(command);
      setMessage(`✅ ${response.message}`);
      if (onCommandSent) onCommandSent(command);
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Manual Control</h3>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        <button
          onClick={() => handleCommand('ON')}
          disabled={loading}
          className="flex flex-col items-center justify-center p-4 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Power className="w-8 h-8 mb-2" />
          <span className="font-semibold">Turn ON</span>
        </button>

        <button
          onClick={() => handleCommand('OFF')}
          disabled={loading}
          className="flex flex-col items-center justify-center p-4 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Power className="w-8 h-8 mb-2" />
          <span className="font-semibold">Turn OFF</span>
        </button>

        <button
          onClick={() => handleCommand('AUTO')}
          disabled={loading}
          className="flex flex-col items-center justify-center p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Activity className="w-8 h-8 mb-2" />
          <span className="font-semibold">Auto Mode</span>
        </button>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-center ${
          message.includes('✅') 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default ControlPanel;