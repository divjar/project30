import React, { useState, useEffect } from 'react';
import { Zap, Battery, Gauge, Activity } from 'lucide-react';
import { format } from 'date-fns';

import SensorCard from '../components/SensorCard';
import StatusBadge from '../components/StatusBadge';
import SensorLineChart from '../components/LineChart';
import { fetchElectricityData } from '../api/api';
import { ListrikData } from '../types';

const Electricity: React.FC = () => {
  const [electricityData, setElectricityData] = useState<ListrikData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [refreshInterval, setRefreshInterval] = useState<number>(30);
  const [selectedPhase, setSelectedPhase] = useState<'r' | 's' | 't' | '3ph'>('3ph');

  // Mock historical data for charts
  const voltageHistory = [
    { name: '00:00', phaseR: 220, phaseS: 222, phaseT: 221, ph3: 221 },
    { name: '04:00', phaseR: 219, phaseS: 221, phaseT: 220, ph3: 220 },
    { name: '08:00', phaseR: 221, phaseS: 223, phaseT: 222, ph3: 222 },
    { name: '12:00', phaseR: 223, phaseS: 225, phaseT: 224, ph3: 224 },
    { name: '16:00', phaseR: 222, phaseS: 224, phaseT: 223, ph3: 223 },
    { name: '20:00', phaseR: 221, phaseS: 223, phaseT: 222, ph3: 222 },
    { 
      name: '24:00', 
      phaseR: electricityData?.phase_r || 220, 
      phaseS: electricityData?.phase_s || 222, 
      phaseT: electricityData?.phase_t || 221, 
      ph3: electricityData?.voltage_3ph || 221 
    },
  ];

  const currentHistory = [
    { name: '00:00', phaseR: 15, phaseS: 16, phaseT: 14, ph3: 15 },
    { name: '04:00', phaseR: 12, phaseS: 13, phaseT: 11, ph3: 12 },
    { name: '08:00', phaseR: 18, phaseS: 19, phaseT: 17, ph3: 18 },
    { name: '12:00', phaseR: 22, phaseS: 23, phaseT: 21, ph3: 22 },
    { name: '16:00', phaseR: 20, phaseS: 21, phaseT: 19, ph3: 20 },
    { name: '20:00', phaseR: 17, phaseS: 18, phaseT: 16, ph3: 17 },
    { 
      name: '24:00', 
      phaseR: electricityData?.current_r || 15, 
      phaseS: electricityData?.current_s || 16, 
      phaseT: electricityData?.current_t || 14, 
      ph3: electricityData?.current_3ph || 15 
    },
  ];

  const powerHistory = [
    { name: '00:00', phaseR: 3300, phaseS: 3520, phaseT: 3080, ph3: 9900 },
    { name: '04:00', phaseR: 2640, phaseS: 2860, phaseT: 2420, ph3: 7920 },
    { name: '08:00', phaseR: 3960, phaseS: 4200, phaseT: 3740, ph3: 11900 },
    { name: '12:00', phaseR: 4840, phaseS: 5130, phaseT: 4620, ph3: 14590 },
    { name: '16:00', phaseR: 4400, phaseS: 4660, phaseT: 4200, ph3: 13260 },
    { name: '20:00', phaseR: 3740, phaseS: 3960, phaseT: 3520, ph3: 11220 },
    { 
      name: '24:00', 
      phaseR: electricityData?.power_r || 3300, 
      phaseS: electricityData?.power_s || 3520, 
      phaseT: electricityData?.power_t || 3080, 
      ph3: electricityData?.power_3ph || 9900 
    },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchElectricityData();
      setElectricityData(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching electricity data:', error);
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

  const getVoltageStatus = (voltage: number) => {
    if (voltage < 200 || voltage > 240) return 'critical';
    if (voltage < 210 || voltage > 230) return 'warning';
    return 'normal';
  };

  const getPowerStatus = (power: number) => {
    if (power > 15000) return 'critical';
    if (power > 12000) return 'warning';
    return 'normal';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Electricity Monitoring</h2>
          <p className="text-gray-400">
            Monitor electrical parameters across all phases
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
      
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
        <div className="flex flex-wrap gap-2 mb-4">
          <button 
            onClick={() => setSelectedPhase('r')}
            className={`px-3 py-1 rounded-md text-sm ${
              selectedPhase === 'r' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Phase R
          </button>
          <button 
            onClick={() => setSelectedPhase('s')}
            className={`px-3 py-1 rounded-md text-sm ${
              selectedPhase === 's' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Phase S
          </button>
          <button 
            onClick={() => setSelectedPhase('t')}
            className={`px-3 py-1 rounded-md text-sm ${
              selectedPhase === 't' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Phase T
          </button>
          <button 
            onClick={() => setSelectedPhase('3ph')}
            className={`px-3 py-1 rounded-md text-sm ${
              selectedPhase === '3ph' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            3-Phase
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SensorCard
            title={`Voltage (Phase ${selectedPhase === '3ph' ? '3-Phase' : selectedPhase.toUpperCase()})`}
            value={selectedPhase === 'r' ? electricityData?.phase_r || 0 : 
                  selectedPhase === 's' ? electricityData?.phase_s || 0 :
                  selectedPhase === 't' ? electricityData?.phase_t || 0 :
                  electricityData?.voltage_3ph || 0}
            unit="V"
            icon={<Zap size={24} className="text-yellow-400" />}
            color={
              selectedPhase === 'r' ? 'border-red-600' :
              selectedPhase === 's' ? 'border-yellow-600' :
              selectedPhase === 't' ? 'border-blue-600' :
              'border-green-600'
            }
            isLoading={loading}
          />
          
          <SensorCard
            title={`Current (Phase ${selectedPhase === '3ph' ? '3-Phase' : selectedPhase.toUpperCase()})`}
            value={selectedPhase === 'r' ? electricityData?.current_r || 0 : 
                  selectedPhase === 's' ? electricityData?.current_s || 0 :
                  selectedPhase === 't' ? electricityData?.current_t || 0 :
                  electricityData?.current_3ph || 0}
            unit="A"
            icon={<Activity size={24} className="text-blue-400" />}
            color={
              selectedPhase === 'r' ? 'border-red-600' :
              selectedPhase === 's' ? 'border-yellow-600' :
              selectedPhase === 't' ? 'border-blue-600' :
              'border-green-600'
            }
            isLoading={loading}
          />
          
          <SensorCard
            title={`Power (Phase ${selectedPhase === '3ph' ? '3-Phase' : selectedPhase.toUpperCase()})`}
            value={selectedPhase === 'r' ? electricityData?.power_r || 0 : 
                  selectedPhase === 's' ? electricityData?.power_s || 0 :
                  selectedPhase === 't' ? electricityData?.power_t || 0 :
                  electricityData?.power_3ph || 0}
            unit="W"
            icon={<Battery size={24} className="text-green-400" />}
            color={
              selectedPhase === 'r' ? 'border-red-600' :
              selectedPhase === 's' ? 'border-yellow-600' :
              selectedPhase === 't' ? 'border-blue-600' :
              'border-green-600'
            }
            isLoading={loading}
          />
          
          <SensorCard
            title={`PF (Phase ${selectedPhase === '3ph' ? '3-Phase' : selectedPhase.toUpperCase()})`}
            value={selectedPhase === 'r' ? electricityData?.pf_r || 0 : 
                  selectedPhase === 's' ? electricityData?.pf_s || 0 :
                  selectedPhase === 't' ? electricityData?.pf_t || 0 :
                  electricityData?.pf_3ph || 0}
            icon={<Gauge size={24} className="text-purple-400" />}
            color={
              selectedPhase === 'r' ? 'border-red-600' :
              selectedPhase === 's' ? 'border-yellow-600' :
              selectedPhase === 't' ? 'border-blue-600' :
              'border-green-600'
            }
            isLoading={loading}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <h3 className="text-white text-base font-medium mb-3">Phase Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Phase R Status</span>
              <StatusBadge 
                status={electricityData?.phase_r ? getVoltageStatus(electricityData.phase_r) : 'offline'} 
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Phase S Status</span>
              <StatusBadge 
                status={electricityData?.phase_s ? getVoltageStatus(electricityData.phase_s) : 'offline'} 
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Phase T Status</span>
              <StatusBadge 
                status={electricityData?.phase_t ? getVoltageStatus(electricityData.phase_t) : 'offline'} 
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">3-Phase Status</span>
              <StatusBadge 
                status={electricityData?.power_3ph ? getPowerStatus(electricityData.power_3ph) : 'offline'} 
              />
            </div>
          </div>
          
          <h3 className="text-white text-base font-medium mb-3 mt-6">Energy Consumption</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Energy R</span>
              <span className="text-white">{electricityData?.energy_r || 0} kWh</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Energy S</span>
              <span className="text-white">{electricityData?.energy_s || 0} kWh</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Energy T</span>
              <span className="text-white">{electricityData?.energy_t || 0} kWh</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Energy 3-Phase</span>
              <span className="text-white">{electricityData?.energy_3ph || 0} kWh</span>
            </div>
          </div>
          
          <h3 className="text-white text-base font-medium mb-3 mt-6">Frequency</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Frequency R</span>
              <span className="text-white">{electricityData?.frequency_r || 0} Hz</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Frequency S</span>
              <span className="text-white">{electricityData?.frequency_s || 0} Hz</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Frequency T</span>
              <span className="text-white">{electricityData?.frequency_t || 0} Hz</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Frequency 3-Phase</span>
              <span className="text-white">{electricityData?.frequency_3ph || 0} Hz</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <h3 className="text-white text-base font-medium mb-3">Additional Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">VA (Phase R)</span>
              <span className="text-white">{electricityData?.va_r || 0} VA</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">VA (Phase S)</span>
              <span className="text-white">{electricityData?.va_s || 0} VA</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">VA (Phase T)</span>
              <span className="text-white">{electricityData?.va_t || 0} VA</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">VA (3-Phase)</span>
              <span className="text-white">{electricityData?.va_3ph || 0} VA</span>
            </div>
          </div>
          
          <h3 className="text-white text-base font-medium mb-3 mt-6">VAR Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">VAR (Phase R)</span>
              <span className="text-white">{electricityData?.var_r || 0} VAR</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">VAR (Phase S)</span>
              <span className="text-white">{electricityData?.var_s || 0} VAR</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">VAR (Phase T)</span>
              <span className="text-white">{electricityData?.var_t || 0} VAR</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">VAR (3-Phase)</span>
              <span className="text-white">{electricityData?.var_3ph || 0} VAR</span>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-700 rounded-lg">
            <h4 className="text-white text-sm font-medium mb-2">System Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Model:</span>
                <span className="text-white">PowerTech NOC-3000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Serial:</span>
                <span className="text-white">PT-23489-A</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Firmware:</span>
                <span className="text-white">v4.2.1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Last Calibration:</span>
                <span className="text-white">2024-12-01</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SensorLineChart 
          title="Voltage History (24h)"
          data={voltageHistory}
          lines={[
            { id: 'phaseR', name: 'Phase R', color: '#f87171' },
            { id: 'phaseS', name: 'Phase S', color: '#facc15' },
            { id: 'phaseT', name: 'Phase T', color: '#60a5fa' },
            { id: 'ph3', name: '3-Phase', color: '#4ade80' },
          ]}
          xAxisLabel="Time"
          yAxisLabel="Voltage (V)"
        />
        
        <SensorLineChart 
          title="Current History (24h)"
          data={currentHistory}
          lines={[
            { id: 'phaseR', name: 'Phase R', color: '#f87171' },
            { id: 'phaseS', name: 'Phase S', color: '#facc15' },
            { id: 'phaseT', name: 'Phase T', color: '#60a5fa' },
            { id: 'ph3', name: '3-Phase', color: '#4ade80' },
          ]}
          xAxisLabel="Time"
          yAxisLabel="Current (A)"
        />
        
        <SensorLineChart 
          title="Power History (24h)"
          data={powerHistory}
          lines={[
            { id: 'phaseR', name: 'Phase R', color: '#f87171' },
            { id: 'phaseS', name: 'Phase S', color: '#facc15' },
            { id: 'phaseT', name: 'Phase T', color: '#60a5fa' },
            { id: 'ph3', name: '3-Phase', color: '#4ade80' },
          ]}
          xAxisLabel="Time"
          yAxisLabel="Power (W)"
        />
      </div>
    </div>
  );
};

export default Electricity;