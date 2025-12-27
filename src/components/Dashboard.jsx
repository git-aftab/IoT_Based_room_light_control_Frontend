import React, { useState, useEffect } from 'react';
import { Power, Activity, Sun, Zap, Clock } from 'lucide-react';
import StatusCard from './StatusCard';
import EnergyChart from './EnergyChart';
import ControlPanel from './ControlPanel';
import { getStatus, getDailyStats, socket } from '../services/api';

const Dashboard = () => {
  const [status, setStatus] = useState({
    light: 'OFF',
    current: 0,
    motion: false,
    ldr: 0,
    timestamp: new Date()
  });

  const [stats, setStats] = useState({
    runtime: 0,
    energyConsumed: 0,
    estimatedCost: 0,
    data: []
  });

  const [connected, setConnected] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const statusData = await getStatus();
        setStatus(statusData);

        const statsData = await getDailyStats();
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    // Refresh stats every 30 seconds
    const interval = setInterval(async () => {
      try {
        const statsData = await getDailyStats();
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Socket.IO real-time updates
  useEffect(() => {
    socket.on('connect', () => {
      console.log('✅ Connected to server');
      setConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from server');
      setConnected(false);
    });

    socket.on('sensor-update', (data) => {
      console.log('📊 Real-time data:', data);
      setStatus(data);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('sensor-update');
    };
  }, []);

  const getLightLevel = () => {
    if (status.ldr < 300) return 'Dark';
    if (status.ldr < 600) return 'Dim';
    if (status.ldr < 900) return 'Moderate';
    return 'Bright';
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                IoT Room Light Controller
              </h1>
              <p className="text-gray-600">
                Real-time monitoring and control system
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                connected ? 'bg-green-500' : 'bg-red-500'
              } animate-pulse`}></div>
              <span className="text-sm font-medium text-gray-600">
                {connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatusCard
            title="Light Status"
            value={status.light}
            icon={Power}
            status={status.light}
            color={status.light === 'ON' ? 'green' : 'red'}
          />
          <StatusCard
            title="Current Draw"
            value={`${status.current.toFixed(2)} A`}
            icon={Zap}
            color="blue"
          />
          <StatusCard
            title="Motion Detection"
            value={status.motion ? 'Detected' : 'No Motion'}
            icon={Activity}
            status={status.motion ? 'Active' : 'Inactive'}
            color={status.motion ? 'green' : 'yellow'}
          />
          <StatusCard
            title="Ambient Light"
            value={getLightLevel()}
            icon={Sun}
            status={`${status.ldr}/4095`}
            color="yellow"
          />
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-6 h-6 text-purple-600" />
              <h3 className="text-gray-600 font-medium">Runtime Today</h3>
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.runtime} min</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-6 h-6 text-yellow-600" />
              <h3 className="text-gray-600 font-medium">Energy Consumed</h3>
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.energyConsumed} kWh</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">₹</span>
              <h3 className="text-gray-600 font-medium">Estimated Cost</h3>
            </div>
            <p className="text-3xl font-bold text-gray-800">₹{stats.estimatedCost}</p>
          </div>
        </div>

        {/* Control Panel */}
        <div className="mb-6">
          <ControlPanel />
        </div>

        {/* Energy Chart */}
        {stats.data && stats.data.length > 0 && (
          <EnergyChart data={stats.data} />
        )}

        {/* Footer */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>Last Updated: {new Date(status.timestamp).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;