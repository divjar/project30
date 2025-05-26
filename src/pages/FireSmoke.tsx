import React, { useState, useEffect } from 'react';
import { Flame, Wind } from 'lucide-react';
import { format } from 'date-fns';

import SensorCard from '../components/SensorCard';
import StatusBadge from '../components/StatusBadge';
import SensorGauge from '../components/GaugeChart';
import SensorLineChart from '../components/LineChart';
import { fetchFireSmokeData } from '../api/api';
import { ApiAsapData } from '../types';

const FireSmoke: React.FC = () => {
  const [fireSmokeData, setFireSmokeData] = useState<ApiAsapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [refreshInterval, setRefreshInterval] = useState<number>(30);

  // Mock historical data for charts
  const fireHistory = [
    { name: '00:00', fire: 10 },
    { name: '04:00', fire: 8 },
    { name: '08:00', fire: 12 },
    { name: '12:00', fire: 15 },
    { name: '16:00', fire: 13 },
    { name: '20:00', fire: 11 },
    { name: '24:00', fire: fireSmokeData?.api_value || 10 },
  ];

  const smokeHistory = [
    { name: '00:00', smoke: 25 },
    { name: '04:00', smoke: 22 },
    { name: '08:00', smoke: 28 },
    { name: '12:00', smoke: 32 },
    { name: '16:00', smoke: 30 },
    { name: '20:00', smoke: 27 },
    { name: '24:00', smoke: fireSmokeData?.asap_value || 25 },
  ];

  // Mock weekly data
  const weeklyFire = [
    { name: 'Mon', fire: 12 },
    { name: 'Tue', fire: 14 },
    { name: 'Wed', fire: 16 },
    { name: 'Thu', fire: 13 },
    { name: 'Fri', fire: 11 },
    { name: 'Sat', fire: 9 },
    { name: 'Sun', fire: fireSmokeData?.api_value || 10 },
  ];

  const weeklySmoke = [
    { name: 'Mon', smoke: 28 },
    { name: 'Tue', smoke: 30 },
    { name: 'Wed', smoke: 35 },
    { name: 'Thu', smoke: 32 },
    { name: 'Fri', smoke: 29 },
    { name: 'Sat', smoke: 26 },
    { name: 'Sun', smoke: fireSmokeData?.asap_value || 25 },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchFireSmokeData();
      setFireSmokeData(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching fire/smoke data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    const interval = setInterval(() => {
      fetchData();
    }, refreshInterval * 1000);
    
    return () => clearInterval(interval);
  }, [refreshInterval]);

  const getFireStatus = (value: number) => {
    if (value > 80) return 'critical';
    if (value > 50) return 'warning';
    return 'normal';
  };

  const getSmokeStatus = (value: number) => {
    if (value > 80) return 'critical';
    if (value > 50) return 'warning';
    return 'normal';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Fire & Smoke Monitoring</h2>
          <p className="text-gray-400">
            Monitor fire and smoke detection sensors in real-time
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col items-end">
          <p className="text-sm text-gray-400">
            Last updated: {format(lastUpdate, 'dd MMM yyyy HH:mm:ss')}
          </p>
          <div className="flex items-center mt-2">
            <span className="text-sm text-gray-400 mr-2">Auto refresh:</span>
            <select 
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              className="bg-gray-700 text-white text-sm rounded-md border-0 focus:ring-2 focus:ring-blue-500"
            >
              <option value="10">10 seconds</option>
              <option value="30">30 seconds</option>
              <option value="60">1 minute</option>
              <option value="300">5 minutes</option>
            </select>
            <button 
              onClick={fetchData}
              className="ml-2 px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded-md text-sm transition-colors duration-200"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SensorCard
          title="Fire Detection"
          value={fireSmokeData?.api_value || 0}
          unit="%"
          icon={<Flame size={24} className="text-red-400" />}
          color="border-red-600"
          isLoading={loading}
          trend={(fireSmokeData?.api_value || 0) > 20 ? 'up' : 'down'}
          timestamp={format(lastUpdate, 'HH:mm:ss')}
        />
        
        <SensorCard
          title="Smoke Detection"
          value={fireSmokeData?.asap_value || 0}
          unit="%"
          icon={<Wind size={24} className="text-gray-400" />}
          color="border-gray-600"
          isLoading={loading}
          trend={(fireSmokeData?.asap_value || 0) > 30 ? 'up' : 'down'}
          timestamp={format(lastUpdate, 'HH:mm:ss')}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <h3 className="text-white text-base font-medium mb-3">Fire & Smoke Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Fire Sensor Status</span>
              <StatusBadge 
                status={fireSmokeData?.api_value ? getFireStatus(fireSmokeData.api_value) : 'offline'} 
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Smoke Sensor Status</span>
              <StatusBadge 
                status={fireSmokeData?.asap_value ? getSmokeStatus(fireSmokeData.asap_value) : 'offline'} 
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Last Alert</span>
              <span className="text-white">None</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Response Team</span>
              <span className="text-green-500">Available</span>
            </div>
          </div>
          
          <h3 className="text-white text-base font-medium mb-3 mt-6">Thresholds & Alerts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Fire Warning Threshold</span>
              <span className="text-yellow-500">50%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Fire Critical Threshold</span>
              <span className="text-red-500">80%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Smoke Warning Threshold</span>
              <span className="text-yellow-500">50%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Smoke Critical Threshold</span>
              <span className="text-red-500">80%</span>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-700 rounded-lg">
            <h4 className="text-white text-sm font-medium mb-2">Emergency Contacts</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span className="text-gray-400">Fire Department:</span>
                <span className="text-white">0341-123456</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Security Office:</span>
                <span className="text-white">0341-654321</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Facility Manager:</span>
                <span className="text-white">0812-3456-7890</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <SensorGauge
            title="Fire Detection Level"
            value={fireSmokeData?.api_value || 0}
            unit="%"
            colorStart="#10b981"
            colorEnd="#ef4444"
          />
          
          <SensorGauge
            title="Smoke Detection Level"
            value={fireSmokeData?.asap_value || 0}
            unit="%"
            colorStart="#10b981"
            colorEnd="#64748b"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SensorLineChart 
          title="Fire Detection History (24h)"
          data={fireHistory}
          lines={[
            { id: 'fire', name: 'Fire Level', color: '#f87171' },
          ]}
          xAxisLabel="Time"
          yAxisLabel="Fire Level (%)"
        />
        
        <SensorLineChart 
          title="Smoke Detection History (24h)"
          data={smokeHistory}
          lines={[
            { id: 'smoke', name: 'Smoke Level', color: '#94a3b8' },
          ]}
          xAxisLabel="Time"
          yAxisLabel="Smoke Level (%)"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SensorLineChart 
          title="Weekly Fire Detection Trends"
          data={weeklyFire}
          lines={[
            { id: 'fire', name: 'Fire Level', color: '#f87171' },
          ]}
          xAxisLabel="Day"
          yAxisLabel="Fire Level (%)"
        />
        
        <SensorLineChart 
          title="Weekly Smoke Detection Trends"
          data={weeklySmoke}
          lines={[
            { id: 'smoke', name: 'Smoke Level', color: '#94a3b8' },
          ]}
          xAxisLabel="Day"
          yAxisLabel="Smoke Level (%)"
        />
      </div>
    </div>
  );
};

export default FireSmoke;