import React from 'react';
import GaugeChart from 'react-gauge-chart';

interface SensorGaugeProps {
  value: number;
  minValue?: number;
  maxValue?: number;
  title: string;
  unit: string;
  colorStart?: string;
  colorEnd?: string;
  showPercent?: boolean;
  lastUpdate?: Date;
  refreshInterval?: number;
  showStatus?: boolean;
}

const SensorGauge: React.FC<SensorGaugeProps> = ({
  value,
  minValue = 0,
  maxValue = 100,
  title,
  unit,
  colorStart = '#5BE12C',
  colorEnd = '#F5CD19',
  showPercent = false,
  lastUpdate,
  showStatus = false
}) => {
  // Normalize the value between 0 and 1 for the gauge
  const normalizedValue = (value - minValue) / (maxValue - minValue);
  const safeValue = Math.max(0, Math.min(1, normalizedValue));

  return (
    <div className="bg-gray-800 rounded-lg p-4 flex flex-col items-center relative">
      <h3 className="text-gray-300 text-sm font-medium mb-2">{title}</h3>
      
      <GaugeChart
        id={`gauge-${title.toLowerCase().replace(/\s+/g, '-')}`}
        nrOfLevels={20}
        colors={[colorStart, colorEnd]}
        arcWidth={0.3}
        percent={safeValue}
        textColor="#ffffff"
        formatTextValue={() => showPercent ? `${(safeValue * 100).toFixed(1)}%` : `${value.toFixed(1)} ${unit}`}
        animate={false}
      />

      {showStatus && (
        <div className={`mt-2 px-3 py-1 rounded-full text-sm ${
          safeValue > 0.8 || safeValue < 0.2
            ? 'bg-red-500/20 text-red-400'
            : 'bg-green-500/20 text-green-400'
        }`}>
          {safeValue > 0.8 || safeValue < 0.2 ? 'Critical' : 'Normal'}
        </div>
      )}
    </div>
  );
};

export default SensorGauge;