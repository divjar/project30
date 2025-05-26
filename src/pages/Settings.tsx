import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, RefreshCw, Database, Bell, Clock, Server } from 'lucide-react';

const Settings: React.FC = () => {
  const [refreshInterval, setRefreshInterval] = useState<number>(30);
  const [notifications, setNotifications] = useState<boolean>(true);
  const [emailAlerts, setEmailAlerts] = useState<boolean>(true);
  const [smsAlerts, setSmsAlerts] = useState<boolean>(false);
  const [tempThreshold, setTempThreshold] = useState<number>(35);
  const [humidityThreshold, setHumidityThreshold] = useState<number>(80);
  const [fireThreshold, setFireThreshold] = useState<number>(50);
  const [smokeThreshold, setSmokeThreshold] = useState<number>(50);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleSave = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      // Show success message or toast here
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Settings</h2>
        <p className="text-gray-400">
          Configure dashboard preferences and alert thresholds
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex items-center mb-4">
            <RefreshCw size={22} className="text-blue-500 mr-2" />
            <h3 className="text-white text-lg font-medium">Data Refresh Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="refreshInterval" className="block text-sm font-medium text-gray-400 mb-1">
                Auto Refresh Interval
              </label>
              <select
                id="refreshInterval"
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                className="w-full bg-gray-700 border-gray-600 rounded-md text-white text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={10}>10 seconds</option>
                <option value={30}>30 seconds</option>
                <option value={60}>1 minute</option>
                <option value={300}>5 minutes</option>
                <option value={600}>10 minutes</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex items-center mb-4">
            <Bell size={22} className="text-blue-500 mr-2" />
            <h3 className="text-white text-lg font-medium">Notification Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Enable notifications</span>
              <div className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  id="notifications"
                  className="sr-only"
                  checked={notifications}
                  onChange={() => setNotifications(!notifications)}
                />
                <span className={`block w-12 h-6 rounded-full ${notifications ? 'bg-blue-600' : 'bg-gray-600'} transition-colors duration-200`}></span>
                <span className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 transform ${notifications ? 'translate-x-6' : ''}`}></span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Email alerts</span>
              <div className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  id="emailAlerts"
                  className="sr-only"
                  checked={emailAlerts}
                  onChange={() => setEmailAlerts(!emailAlerts)}
                />
                <span className={`block w-12 h-6 rounded-full ${emailAlerts ? 'bg-blue-600' : 'bg-gray-600'} transition-colors duration-200`}></span>
                <span className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 transform ${emailAlerts ? 'translate-x-6' : ''}`}></span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-300">SMS alerts</span>
              <div className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  id="smsAlerts"
                  className="sr-only"
                  checked={smsAlerts}
                  onChange={() => setSmsAlerts(!smsAlerts)}
                />
                <span className={`block w-12 h-6 rounded-full ${smsAlerts ? 'bg-blue-600' : 'bg-gray-600'} transition-colors duration-200`}></span>
                <span className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 transform ${smsAlerts ? 'translate-x-6' : ''}`}></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex items-center mb-6">
          <SettingsIcon size={22} className="text-blue-500 mr-2" />
          <h3 className="text-white text-lg font-medium">Alert Thresholds</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <label htmlFor="tempThreshold" className="block text-sm font-medium text-gray-400 mb-1">
              Temperature Threshold (°C)
            </label>
            <input
              type="number"
              id="tempThreshold"
              value={tempThreshold}
              onChange={(e) => setTempThreshold(Number(e.target.value))}
              className="w-full bg-gray-700 border-gray-600 rounded-md text-white text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="humidityThreshold" className="block text-sm font-medium text-gray-400 mb-1">
              Humidity Threshold (%)
            </label>
            <input
              type="number"
              id="humidityThreshold"
              value={humidityThreshold}
              onChange={(e) => setHumidityThreshold(Number(e.target.value))}
              className="w-full bg-gray-700 border-gray-600 rounded-md text-white text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="fireThreshold" className="block text-sm font-medium text-gray-400 mb-1">
              Fire Detection Threshold (%)
            </label>
            <input
              type="number"
              id="fireThreshold"
              value={fireThreshold}
              onChange={(e) => setFireThreshold(Number(e.target.value))}
              className="w-full bg-gray-700 border-gray-600 rounded-md text-white text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="smokeThreshold" className="block text-sm font-medium text-gray-400 mb-1">
              Smoke Detection Threshold (%)
            </label>
            <input
              type="number"
              id="smokeThreshold"
              value={smokeThreshold}
              onChange={(e) => setSmokeThreshold(Number(e.target.value))}
              className="w-full bg-gray-700 border-gray-600 rounded-md text-white text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex items-center mb-4">
            <Database size={22} className="text-blue-500 mr-2" />
            <h3 className="text-white text-lg font-medium">Database Connection</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="dbHost" className="block text-sm font-medium text-gray-400 mb-1">
                Database Host
              </label>
              <input
                type="text"
                id="dbHost"
                value="10.10.11.27"
                readOnly
                className="w-full bg-gray-700 border-gray-600 rounded-md text-white text-sm focus:ring-blue-500 focus:border-blue-500 cursor-not-allowed"
              />
            </div>
            
            <div>
              <label htmlFor="dbName" className="block text-sm font-medium text-gray-400 mb-1">
                Database Name
              </label>
              <input
                type="text"
                id="dbName"
                value="suhu"
                readOnly
                className="w-full bg-gray-700 border-gray-600 rounded-md text-white text-sm focus:ring-blue-500 focus:border-blue-500 cursor-not-allowed"
              />
            </div>
            
            <div>
              <label htmlFor="dbUser" className="block text-sm font-medium text-gray-400 mb-1">
                Database User
              </label>
              <input
                type="text"
                id="dbUser"
                value="root"
                readOnly
                className="w-full bg-gray-700 border-gray-600 rounded-md text-white text-sm focus:ring-blue-500 focus:border-blue-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex items-center mb-4">
            <Server size={22} className="text-blue-500 mr-2" />
            <h3 className="text-white text-lg font-medium">Server Information</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="hostname" className="block text-sm font-medium text-gray-400 mb-1">
                Hostname
              </label>
              <input
                type="text"
                id="hostname"
                value="dev-suhu.umm.ac.id"
                readOnly
                className="w-full bg-gray-700 border-gray-600 rounded-md text-white text-sm focus:ring-blue-500 focus:border-blue-500 cursor-not-allowed"
              />
            </div>
            
            <div>
              <label htmlFor="ipAddress" className="block text-sm font-medium text-gray-400 mb-1">
                IP Address
              </label>
              <input
                type="text"
                id="ipAddress"
                value="10.10.1.25"
                readOnly
                className="w-full bg-gray-700 border-gray-600 rounded-md text-white text-sm focus:ring-blue-500 focus:border-blue-500 cursor-not-allowed"
              />
            </div>
            
            <div>
              <label htmlFor="serverStatus" className="block text-sm font-medium text-gray-400 mb-1">
                Server Status
              </label>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                <span className="text-white">Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`px-4 py-2 rounded-md text-white flex items-center ${
            isSaving 
              ? 'bg-gray-600 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          } transition-colors duration-200`}
        >
          {isSaving ? (
            <>
              <RefreshCw size={18} className="mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={18} className="mr-2" />
              Save Settings
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Settings;