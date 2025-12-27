import React from 'react';
import { Power, Activity, Sun, Zap } from 'lucide-react';

const StatusCard = ({ title, value, icon: Icon, status, color }) => {
  const colorClasses = {
    green: 'bg-green-500',
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500'
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-full ${colorClasses[color]} bg-opacity-20`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
        {status && (
          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
            status === 'ON' || status === 'Active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {status}
          </span>
        )}
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );
};

export default StatusCard;