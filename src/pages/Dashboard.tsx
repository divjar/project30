import React, { useState, useEffect } from 'react';
import SensorGauge from '../components/GaugeChart';
import { 
  fetchSensor1Data, 
  fetchSensor2Data, 
  fetchFireSmokeData, 
  fetchElectricityData 
} from '../api/api';
import { SensorData, ApiAsapData, ListrikData } from '../types';

const Dashboard: React.FC = () => {
  const [sensor1Data, setSensor1Data] = useState<SensorData | null>(null);
  const [sensor2Data, setSensor2Data] = useState<SensorData | null>(null);
  const [fireSmokeData, setFireSmokeData] = useState<ApiAsapData | null>(null);
  const [fireSmokeData2, setFireSmokeData2] = useState<ApiAsapData | null>(null);
  const [electricityData, setElectricityData] = useState<ListrikData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [refreshInterval] = useState<number>(5);

  const fetchData = async () => {
    try {
      const [sensor1, sensor2, fireSmoke, fireSmoke2, electricity] = await Promise.all([
        fetchSensor1Data(),
        fetchSensor2Data(),
        fetchFireSmokeData(),
        fetchFireSmokeData(), // Second fire/smoke sensor
        fetchElectricityData()
      ]);
      
      setSensor1Data(sensor1);
      setSensor2Data(sensor2);
      setFireSmokeData(fireSmoke);
      setFireSmokeData2(fireSmoke2);
      setElectricityData(electricity);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching sensor data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, refreshInterval * 1000);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  return (
    <div className="space-y-6">
      {/* Row 1: Phase Voltages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <SensorGauge
            title="Phase R Voltage"
            value={electricityData?.phase_r || 0}
            minValue={180}
            maxValue={260}
            unit="V"
            colorStart="#10b981"
            colorEnd="#ef4444"
            lastUpdate={lastUpdate}
            showStatus={true}
          />
        </div>
        
        <div className="col-span-1">
          <SensorGauge
            title="Phase S Voltage"
            value={electricityData?.phase_s || 0}
            minValue={180}
            maxValue={260}
            unit="V"
            colorStart="#10b981"
            colorEnd="#ef4444"
            lastUpdate={lastUpdate}
            showStatus={true}
          />
        </div>
        
        <div className="col-span-1">
          <SensorGauge
            title="Phase T Voltage"
            value={electricityData?.phase_t || 0}
            minValue={180}
            maxValue={260}
            unit="V"
            colorStart="#10b981"
            colorEnd="#ef4444"
            lastUpdate={lastUpdate}
            showStatus={true}
          />
        </div>
      </div>

      {/* Row 2: Temperature and Humidity */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="col-span-1">
          <SensorGauge
            title="Temperature (NOC)"
            value={sensor1Data?.suhu || 0}
            minValue={0}
            maxValue={50}
            unit="°C"
            colorStart="#10b981"
            colorEnd="#ef4444"
            lastUpdate={lastUpdate}
            showStatus={true}
          />
        </div>
        
        <div className="col-span-1">
          <SensorGauge
            title="Humidity (NOC)"
            value={sensor1Data?.kelembapan || 0}
            minValue={0}
            maxValue={100}
            unit="%"
            colorStart="#10b981"
            colorEnd="#3b82f6"
            lastUpdate={lastUpdate}
            showStatus={true}
          />
        </div>

        <div className="col-span-1">
          <SensorGauge
            title="Temperature (UPS Room)"
            value={sensor2Data?.suhu || 0}
            minValue={0}
            maxValue={50}
            unit="°C"
            colorStart="#10b981"
            colorEnd="#ef4444"
            lastUpdate={lastUpdate}
            showStatus={true}
          />
        </div>
        
        <div className="col-span-1">
          <SensorGauge
            title="Humidity (UPS Room)"
            value={sensor2Data?.kelembapan || 0}
            minValue={0}
            maxValue={100}
            unit="%"
            colorStart="#10b981"
            colorEnd="#3b82f6"
            lastUpdate={lastUpdate}
            showStatus={true}
          />
        </div>
      </div>

      {/* Row 3: Fire and Smoke Sensors */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="col-span-1">
          <SensorGauge
            title="Fire Detection (NOC)"
            value={fireSmokeData?.api_value || 0}
            minValue={0}
            maxValue={100}
            unit="%"
            colorStart="#10b981"
            colorEnd="#ef4444"
            lastUpdate={lastUpdate}
            showStatus={true}
          />
        </div>
        
        <div className="col-span-1">
          <SensorGauge
            title="Smoke Detection (NOC)"
            value={fireSmokeData?.asap_value || 0}
            minValue={0}
            maxValue={100}
            unit="%"
            colorStart="#10b981"
            colorEnd="#64748b"
            lastUpdate={lastUpdate}
            showStatus={true}
          />
        </div>

        <div className="col-span-1">
          <SensorGauge
            title="Fire Detection (UPS)"
            value={fireSmokeData2?.api_value || 0}
            minValue={0}
            maxValue={100}
            unit="%"
            colorStart="#10b981"
            colorEnd="#ef4444"
            lastUpdate={lastUpdate}
            showStatus={true}
          />
        </div>
        
        <div className="col-span-1">
          <SensorGauge
            title="Smoke Detection (UPS)"
            value={fireSmokeData2?.asap_value || 0}
            minValue={0}
            maxValue={100}
            unit="%"
            colorStart="#10b981"
            colorEnd="#64748b"
            lastUpdate={lastUpdate}
            showStatus={true}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;