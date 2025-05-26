import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Thermometer, 
  Flame, 
  Zap, 
  Settings, 
  X 
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const navItems = [
    { path: '/', icon: <Home size={20} />, label: 'Dashboard' },
    { path: '/temperature-humidity', icon: <Thermometer size={20} />, label: 'Temperature & Humidity' },
    { path: '/fire-smoke', icon: <Flame size={20} />, label: 'Fire & Smoke' },
    { path: '/electricity', icon: <Zap size={20} />, label: 'Electricity' },
    { path: '/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          fixed top-0 left-0
          w-64 h-screen 
          bg-gray-800/95 backdrop-blur-sm
          shadow-xl 
          transition-transform duration-300 ease-in-out 
          z-30
        `}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">IOT System</h2>
          <button 
            className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-700/50 transition-colors duration-200" 
            onClick={toggleSidebar}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="px-2 py-4">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={toggleSidebar}
                className={({ isActive }) => `
                  ${isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                  }
                  group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200
                `}
                end={item.path === '/'}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
        
        <div className="absolute bottom-0 w-full p-4 bg-gray-900/50 backdrop-blur-sm border-t border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <span className="font-semibold">UMM</span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">Universitas</p>
              <p className="text-xs text-gray-400">Muhammadiyah Malang</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;