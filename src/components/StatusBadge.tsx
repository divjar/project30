import React from 'react';

type StatusType = 'normal' | 'warning' | 'critical' | 'offline';

interface StatusBadgeProps {
  status: StatusType;
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'md',
  pulse = true
}) => {
  const getStatusColor = (status: StatusType) => {
    switch (status) {
      case 'normal':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'critical':
        return 'bg-red-500';
      case 'offline':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  const getStatusText = (status: StatusType) => {
    switch (status) {
      case 'normal':
        return 'Normal';
      case 'warning':
        return 'Warning';
      case 'critical':
        return 'Critical';
      case 'offline':
        return 'Offline';
      default:
        return 'Unknown';
    }
  };
  
  const getSizeClass = (size: 'sm' | 'md' | 'lg') => {
    switch (size) {
      case 'sm':
        return 'h-2 w-2';
      case 'md':
        return 'h-3 w-3';
      case 'lg':
        return 'h-4 w-4';
      default:
        return 'h-3 w-3';
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <div className={`relative rounded-full ${getSizeClass(size)} ${getStatusColor(status)}`}>
        {pulse && status !== 'offline' && (
          <span className={`absolute ${getSizeClass(size)} rounded-full ${getStatusColor(status)} opacity-75 animate-ping`}></span>
        )}
      </div>
      <span className="text-sm font-medium text-gray-300">{getStatusText(status)}</span>
    </div>
  );
};

export default StatusBadge;