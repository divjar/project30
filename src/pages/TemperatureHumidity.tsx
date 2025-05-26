import React, { useState, useEffect } from 'react';
import { Thermometer, Droplets } from 'lucide-react';
import { format } from 'date-fns';

import SensorCard from '../components/SensorCard';
import StatusBadge from '../components/StatusBadge';
import SensorGauge from '../components/GaugeChart';
import SensorLineChart from '../components/LineChart';
import { fetchSensor1Data, fetchSensor2Data } from '../api/api';
import { SensorData } from '../types';

const TemperatureHumidity: React.FC = () => {
  const [sensor1Data, setSensor1Data] = useState<SensorData | null>(null);
  const [sensor2Data, setSensor2Data] = useState<SensorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [refreshInterval, setRefreshInterval] = useState<number>(30);

  // Mock historical data for charts
  const temperatureHistoryData = [
    { name: '00:00', sensor1: 23, sensor2: 24 },
    { name: '04:00', sensor1: 22, sensor2: 23 },
    { name: '08:00', sensor1: 24, sensor2: 25 },
    { name: '12:00', sensor1: 26, sensor2: 27 },
    { name: '16:00', sensor1: 25, sensor2: 26 },
    { name: '20:00', sensor1: 24, sensor2: 25 },
    { name: '24:00', sensor1: sensor1Data?.suhu || 23, sensor2: sensor2Data?.suhu || 24 },
  ];

  const humidityHistoryData = [
    { name: '00:00', sensor1: 55, sensor2: 58 },
    { name: '04:00', sensor1: 56, sensor2: 59 },
    { name: '08:00', sensor1: 54, sensor2: 57 },
    { name: '12:00', sensor1: 52, sensor2: 55 },
    { name: '16:00', sensor1: 53, sensor2: 56 },
    { name: '20:00', sensor1: 54, sensor2: 57 },
    { name: '24:00', sensor1: sensor1Data?.kelembapan || 55, sensor2: sensor2Data?.kelembapan || 58 },
  ];

  // Mock weekly data
  const weeklyTempData = [
    { name: 'Mon', sensor1: 24, sensor2: 25 },
    { name: 'Tue', sensor1: 25, sensor2: 26 },
    { name: 'Wed', sensor1: 26, sensor2: 27 },
    { name: 'Thu', sensor1: 24, sensor2: 25 },
    { name: 'Fri', sensor1: 23, sensor2: 24 },
    { name: 'Sat', sensor1: 22, sensor2: 23 },
    { name: 'Sun', sensor1: sensor1Data?.suhu || 23, sensor2: sensor2Data?.suhu || 24 },
  ];

  const weeklyHumidityData = [
    { name: 'Mon', sensor1: 52, sensor2: 55 },
    { name: 'Tue', sensor1: 54, sensor2: 57 },
    { name: 'Wed', sensor1: 56, sensor2: 59 },
    { name: 'Thu', sensor1: 55, sensor2: 58 },
    { name: 'Fri', sensor1: 53, sensor2: 56 },
    { name: 'Sat', sensor1: 54, sensor2: 57 },
    { name: 'Sun', sensor1: sensor1Data?.kelembapan || 55, sensor2: sensor2Data?.kelembapan || 58 },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sensor1, sensor2] = await Promise.all([
        fetchSensor1Data(),
        fetchSensor2Data()
      ]);
      
      setSensor1Data(sensor1);
      setSensor2Data(sensor2);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching sensor data:', error);
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

  const getStatusFromTemp = (temp: number) => {
    if (temp < 10) return 'critical';
    if (temp > 35) return 'critical';
    if (temp < 18 || temp > 30) return 'warning';
    return 'normal';
  };

  const getStatusFromHumidity = (humidity: number) => {
    if (humidity < 20) return 'critical';
    if (humidity > 80) return 'critical';
    if (humidity < 30 || humidity > 70) return 'warning';
    return 'normal';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Temperature & Humidity</h2>
          <p className="text-gray-400">
            Monitor temperature and humidity sensors in real-time
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Temperature Sensors */}
        <SensorCard
          title="Temperature (Sensor 1)"
          value={sensor1Data?.suhu || 0}
          unit="°C"
          icon={<Thermometer size={24} className="text-red-400" />}
          color="border-red-600"
          isLoading={loading}
          trend="up"
          timestamp={format(lastUpdate, 'HH:mm:ss')}
        />
        
        <SensorCard
          title="Humidity (Sensor 1)"
          value={sensor1Data?.kelembapan || 0}
          unit="%"
          icon={<Droplets size={24} className="text-blue-400" />}
          color="border-blue-600"
          isLoading={loading}
          trend="stable"
          timestamp={format(lastUpdate, 'HH:mm:ss')}
        />
        
        <SensorCard
          title="Temperature (Sensor 2)"
          value={sensor2Data?.suhu || 0}
          unit="°C"
          icon={<Thermometer size={24} className="text-orange-400" />}
          color="border-orange-600"
          isLoading={loading}
          trend="up"
          timestamp={format(lastUpdate, 'HH:mm:ss')}
        />
        
        <SensorCard
          title="Humidity (Sensor 2)"
          value={sensor2Data?.kelembapan || 0}
          unit="%"
          icon={<Droplets size={24} className="text-indigo-400" />}
          color="border-indigo-600"
          isLoading={loading}
          trend="down"
          timestamp={format(lastUpdate, 'HH:mm:ss')}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <h3 className="text-white text-base font-medium mb-3">Sensor 1 Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Temperature Status</span>
              <StatusBadge 
                status={sensor1Data?.suhu ? getStatusFromTemp(sensor1Data.suhu) : 'offline'} 
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Humidity Status</span>
              <StatusBadge 
                status={sensor1Data?.kelembapan ? getStatusFromHumidity(sensor1Data.kelembapan) : 'offline'} 
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Min Temperature</span>
              <span className="text-white">22.0 °C</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Max Temperature</span>
              <span className="text-white">27.5 °C</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Min Humidity</span>
              <span className="text-white">48 %</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Max Humidity</span>
              <span className="text-white">65 %</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <h3 className="text-white text-base font-medium mb-3">Sensor 2 Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Temperature Status</span>
              <StatusBadge 
                status={sensor2Data?.suhu ? getStatusFromTemp(sensor2Data.suhu) : 'offline'} 
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Humidity Status</span>
              <StatusBadge 
                status={sensor2Data?.kelembapan ? getStatusFromHumidity(sensor2Data.kelembapan) : 'offline'} 
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Min Temperature</span>
              <span className="text-white">23.0 °C</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Max Temperature</span>
              <span className="text-white">28.5 °C</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Min Humidity</span>
              <span className="text-white">52 %</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Max Humidity</span>
              <span className="text-white">69 %</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SensorGauge
          title="Temperature (Sensor 1)"
          value={sensor1Data?.suhu || 0}
          minValue={0}
          maxValue={40}
          unit="°C"
          colorStart="#3b82f6"
          colorEnd="#ef4444"
        />
        
        <SensorGauge
          title="Humidity (Sensor 1)"
          value={sensor1Data?.kelembapan || 0}
          unit="%"
          colorStart="#10b981"
          colorEnd="#3b82f6"
        />
        
        <SensorGauge
          title="Temperature (Sensor 2)"
          value={sensor2Data?.suhu || 0}
          minValue={0}
          maxValue={40}
          unit="°C"
          colorStart="#3b82f6"
          colorEnd="#ef4444"
        />
        
        <SensorGauge
          title="Humidity (Sensor 2)"
          value={sensor2Data?.kelembapan || 0}
          unit="%"
          colorStart="#10b981"
          colorEnd="#3b82f6"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SensorLineChart 
          title="Temperature History (24h)"
          data={temperatureHistoryData}
          lines={[
            { id: 'sensor1', name: 'Sensor 1', color: '#f87171' },
            { id: 'sensor2', name: 'Sensor 2', color: '#fb923c' }
          ]}
          xAxisLabel="Time"
          yAxisLabel="Temperature (°C)"
        />
        
        <SensorLineChart 
          title="Humidity History (24h)"
          data={humidityHistoryData}
          lines={[
            { id: 'sensor1', name: 'Sensor 1', color: '#60a5fa' },
            { id: 'sensor2', name: 'Sensor 2', color: '#818cf8' }
          ]}
          xAxisLabel="Time"
          yAxisLabel="Humidity (%)"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SensorLineChart 
          title="Weekly Temperature Trends"
          data={weeklyTempData}
          lines={[
            { id: 'sensor1', name: 'Sensor 1', color: '#f87171' },
            { id: 'sensor2', name: 'Sensor 2', color: '#fb923c' }
          ]}
          xAxisLabel="Day"
          yAxisLabel="Temperature (°C)"
        />
        
        <SensorLineChart 
          title="Weekly Humidity Trends"
          data={weeklyHumidityData}
          lines={[
            { id: 'sensor1', name: 'Sensor 1', color: '#60a5fa' },
            { id: 'sensor2', name: 'Sensor 2', color: '#818cf8' }
          ]}
          xAxisLabel="Day"
          yAxisLabel="Humidity (%)"
        />
      </div>
    </div>
  );
};

export default TemperatureHumidity;