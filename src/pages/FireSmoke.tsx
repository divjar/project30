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
  const [fireSmokeData2, setFireSmokeData2] = useState<ApiAsapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [refreshInterval, setRefreshInterval] = useState<number>(30);

  // Mock historical data for charts
  const fireHistory = [
    { name: '00:00', fireNOC: 10, fireUPS: 12 },
    { name: '04:00', fireNOC: 8, fireUPS: 9 },
    { name: '08:00', fireNOC: 12, fireUPS: 13 },
    { name: '12:00', fireNOC: 15, fireUPS: 16 },
    { name: '16:00', fireNOC: 13, fireUPS: 14 },
    { name: '20:00', fireNOC: 11, fireUPS: 12 },
    { 
      name: '24:00', 
      fireNOC: fireSmokeData?.api_value || 10,
      fireUPS: fireSmokeData2?.api_value || 12
    },
  ];

  const smokeHistory = [
    { name: '00:00', smokeNOC: 25, smokeUPS: 28 },
    { name: '04:00', smokeNOC: 22, smokeUPS: 24 },
    { name: '08:00', smokeNOC: 28, smokeUPS: 30 },
    { name: '12:00', smokeNOC: 32, smokeUPS: 34 },
    { name: '16:00', smokeNOC: 30, smokeUPS: 32 },
    { name: '20:00', smokeNOC: 27, smokeUPS: 29 },
    { 
      name: '24:00', 
      smokeNOC: fireSmokeData?.asap_value || 25,
      smokeUPS: fireSmokeData2?.asap_value || 28
    },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const [data1, data2] = await Promise.all([
        fetchFireSmokeData(),
        fetchFireSmokeData()
      ]);
      setFireSmokeData(data1);
      setFireSmokeData2(data2);
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
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SensorCard
          title="Fire Detection (NOC)"
          value={fireSmokeData?.api_value || 0}
          unit="%"
          icon={<Flame size={24} className="text-red-400" />}
          color="border-red-600"
          isLoading={loading}
          trend={(fireSmokeData?.api_value || 0) > 20 ? 'up' : 'down'}
          timestamp={format(lastUpdate, 'HH:mm:ss')}
        />
        
        <SensorCard
          title="Smoke Detection (NOC)"
          value={fireSmokeData?.asap_value || 0}
          unit="%"
          icon={<Wind size={24} className="text-gray-400" />}
          color="border-gray-600"
          isLoading={loading}
          trend={(fireSmokeData?.asap_value || 0) > 30 ? 'up' : 'down'}
          timestamp={format(lastUpdate, 'HH:mm:ss')}
        />

        <SensorCard
          title="Fire Detection (UPS)"
          value={fireSmokeData2?.api_value || 0}
          unit="%"
          icon={<Flame size={24} className="text-red-400" />}
          color="border-red-600"
          isLoading={loading}
          trend={(fireSmokeData2?.api_value || 0) > 20 ? 'up' : 'down'}
          timestamp={format(lastUpdate, 'HH:mm:ss')}
        />
        
        <SensorCard
          title="Smoke Detection (UPS)"
          value={fireSmokeData2?.asap_value || 0}
          unit="%"
          icon={<Wind size={24} className="text-gray-400" />}
          color="border-gray-600"
          isLoading={loading}
          trend={(fireSmokeData2?.asap_value || 0) > 30 ? 'up' : 'down'}
          timestamp={format(lastUpdate, 'HH:mm:ss')}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <h3 className="text-white text-base font-medium mb-3">NOC Sensors Status</h3>
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
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <h3 className="text-white text-base font-medium mb-3">UPS Room Sensors Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Fire Sensor Status</span>
              <StatusBadge 
                status={fireSmokeData2?.api_value ? getFireStatus(fireSmokeData2.api_value) : 'offline'} 
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Smoke Sensor Status</span>
              <StatusBadge 
                status={fireSmokeData2?.asap_value ? getSmokeStatus(fireSmokeData2.asap_value) : 'offline'} 
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SensorGauge
          title="Fire Detection (NOC)"
          value={fireSmokeData?.api_value || 0}
          unit="%"
          colorStart="#10b981"
          colorEnd="#ef4444"
        />
        
        <SensorGauge
          title="Smoke Detection (NOC)"
          value={fireSmokeData?.asap_value || 0}
          unit="%"
          colorStart="#10b981"
          colorEnd="#64748b"
        />

        <SensorGauge
          title="Fire Detection (UPS)"
          value={fireSmokeData2?.api_value || 0}
          unit="%"
          colorStart="#10b981"
          colorEnd="#ef4444"
        />
        
        <SensorGauge
          title="Smoke Detection (UPS)"
          value={fireSmokeData2?.asap_value || 0}
          unit="%"
          colorStart="#10b981"
          colorEnd="#64748b"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SensorLineChart 
          title="Fire Detection History (24h)"
          data={fireHistory}
          lines={[
            { id: 'fireNOC', name: 'NOC Fire Level', color: '#f87171' },
            { id: 'fireUPS', name: 'UPS Fire Level', color: '#fb923c' }
          ]}
          xAxisLabel="Time"
          yAxisLabel="Fire Level (%)"
        />
        
        <SensorLineChart 
          title="Smoke Detection History (24h)"
          data={smokeHistory}
          lines={[
            { id: 'smokeNOC', name: 'NOC Smoke Level', color: '#94a3b8' },
            { id: 'smokeUPS', name: 'UPS Smoke Level', color: '#64748b' }
          ]}
          xAxisLabel="Time"
          yAxisLabel="Smoke Level (%)"
        />
      </div>
    </div>
  );
};

export default FireSmoke;