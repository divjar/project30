import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface CriticalAlertProps {
  message: string;
  onClose: () => void;
}

const CriticalAlert: React.FC<CriticalAlertProps> = ({ message, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 bg-red-600 text-white p-4 rounded-lg shadow-lg flex items-center">
      <AlertTriangle className="mr-2" size={24} />
      <div>
        <h4 className="font-bold">Critical Alert</h4>
        <p>{message}</p>
      </div>
      <button 
        onClick={onClose}
        className="ml-4 text-white hover:text-red-200"
      >
        ×
      </button>
    </div>
  );
};

export default CriticalAlert;