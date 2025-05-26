import React, { useEffect, useState } from 'react';

interface SensorCardProps {
  title: string;
  value: number | string;
  unit?: string;
  icon: React.ReactNode;
  color: string;
  isLoading?: boolean;
  trend?: 'up' | 'down' | 'stable';
  timestamp?: string;
  isCritical?: boolean;
}

const SensorCard: React.FC<SensorCardProps> = ({ 
  title, 
  value, 
  unit, 
  icon, 
  color, 
  isLoading = false, 
  trend,
  timestamp,
  isCritical = false
}) => {
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    if (isCritical) {
      const interval = setInterval(() => {
        setIsBlinking(prev => !prev);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isCritical]);

  const borderClass = isCritical && isBlinking
    ? 'border-2 border-red-500 animate-pulse'
    : `border-l-4 ${color}`;

  return (
    <div className={`bg-gray-800 rounded-lg shadow-lg overflow-hidden ${borderClass}`}>
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
            <div className="flex items-end mt-1">
              {isLoading ? (
                <div className="animate-pulse h-8 w-24 bg-gray-700 rounded"></div>
              ) : (
                <>
                  <p className="text-white text-2xl font-bold">{value}</p>
                  {unit && <span className="text-gray-400 ml-1 text-sm">{unit}</span>}
                  
                  {trend && (
                    <span className={`ml-2 flex items-center text-xs ${
                      trend === 'up' 
                        ? 'text-red-400' 
                        : trend === 'down' 
                          ? 'text-green-400' 
                          : 'text-gray-400'
                    }`}>
                      {trend === 'up' && '↑ '}
                      {trend === 'down' && '↓ '}
                      {trend === 'stable' && '→ '}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
          <div className={`p-2 rounded-lg ${color.replace('border-', 'bg-').replace('-600', '-600/20')}`}>
            {icon}
          </div>
        </div>
        
        {timestamp && (
          <div className="mt-4 text-xs text-gray-500">
            Last updated: {timestamp}
          </div>
        )}
      </div>
      
      <div className={`h-1 ${color.replace('border-', 'bg-')}`}></div>
    </div>
  );
};

export default SensorCard;