import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, User, Download, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { exportData } from '../api/api';
import { format } from 'date-fns';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Temperature Sensor 1 is critical', time: '2 min ago' },
    { id: 2, message: 'Smoke level is high', time: '5 min ago' },
    { id: 3, message: 'Power consumption peaked', time: '10 min ago' },
  ]);

  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (exportRef.current && !exportRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const clearNotifications = () => {
    setNotifications([]);
    localStorage.setItem('notifications', JSON.stringify([]));
  };

  const handleExport = async (type: 'sensor' | 'fire-smoke' | 'electricity') => {
    try {
      const blob = await exportData(type);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}-data_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  return (
    <header className="bg-gray-800/95 backdrop-blur-sm shadow-lg flex items-center justify-between px-4 py-3 sticky top-0 z-50">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="text-gray-400 hover:text-white focus:outline-none p-2 rounded-lg hover:bg-gray-700/50 transition-colors duration-200"
        >
          <Menu size={24} />
        </button>
        <h1 className="ml-4 text-xl font-semibold text-white">UMM-BSID Monitoring System</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative" ref={exportRef}>
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-700/50 transition-colors duration-200"
          >
            <Download size={20} />
          </button>
          
          {showExportMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-lg py-1 z-50">
              <button
                onClick={() => handleExport('sensor')}
                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 w-full text-left"
              >
                Export Sensor Data
              </button>
              <button
                onClick={() => handleExport('fire-smoke')}
                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 w-full text-left"
              >
                Export Fire & Smoke Data
              </button>
              <button
                onClick={() => handleExport('electricity')}
                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 w-full text-left"
              >
                Export Electricity Data
              </button>
            </div>
          )}
        </div>

        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-700/50 transition-colors duration-200 relative"
          >
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 text-xs flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-gray-700 rounded-lg shadow-lg py-1 z-50">
              <div className="flex justify-between items-center px-4 py-2 border-b border-gray-600">
                <h3 className="text-white font-medium">Notifications</h3>
                {notifications.length > 0 && (
                  <button
                    onClick={clearNotifications}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    Clear all
                  </button>
                )}
              </div>
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className="px-4 py-2 hover:bg-gray-600 cursor-pointer"
                >
                  <p className="text-sm text-gray-300">{notification.message}</p>
                  <p className="text-xs text-gray-500">{notification.time}</p>
                </div>
              ))}
              {notifications.length === 0 && (
                <div className="px-4 py-2 text-gray-400 text-sm">
                  No notifications
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2 text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-700/50 transition-colors duration-200"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <User size={18} />
            </div>
            <span className="hidden md:inline text-sm">{user?.username}</span>
          </button>
          
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-lg py-1 z-50">
              <button
                onClick={() => {
                  logout();
                  setShowProfileMenu(false);
                }}
                className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 w-full"
              >
                <LogOut size={16} className="mr-2" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;