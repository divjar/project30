import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import NotificationSound from './NotificationSound';
import CriticalAlert from './CriticalAlert';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [playCriticalAlert, setPlayCriticalAlert] = useState(false);
  const [showCriticalAlert, setShowCriticalAlert] = useState(false);
  const [criticalMessage, setCriticalMessage] = useState('');
  const location = useLocation();

  // Auto-hide sidebar on route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Check for critical conditions
  useEffect(() => {
    const checkCriticalStatus = () => {
      // Add your critical condition checks here
      const hasCriticalStatus = false; // This will be set by actual sensor data
      if (hasCriticalStatus) {
        setPlayCriticalAlert(true);
        setShowCriticalAlert(true);
        setCriticalMessage('Critical condition detected!');
        setTimeout(() => setPlayCriticalAlert(false), 1000);
      }
    };

    const interval = setInterval(checkCriticalStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <Outlet />
        </main>
      </div>

      {showCriticalAlert && (
        <CriticalAlert 
          message={criticalMessage} 
          onClose={() => setShowCriticalAlert(false)} 
        />
      )}
      <NotificationSound play={playCriticalAlert} />
    </div>
  );
};

export default Layout;