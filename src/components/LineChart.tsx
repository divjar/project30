import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface DataPoint {
  name: string;
  [key: string]: any;
}

interface LineChartProps {
  data: DataPoint[];
  lines: {
    id: string;
    name: string;
    color: string;
  }[];
  title: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

const SensorLineChart: React.FC<LineChartProps> = ({
  data,
  lines,
  title,
  xAxisLabel,
  yAxisLabel,
}) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
      <h3 className="text-white text-base font-medium mb-4">{title}</h3>
      
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 25,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#ccc' }} 
              stroke="#666"
              label={{
                value: xAxisLabel,
                position: 'insideBottomRight',
                offset: -10,
                fill: '#999',
              }}
            />
            <YAxis 
              tick={{ fill: '#ccc' }} 
              stroke="#666"
              label={{
                value: yAxisLabel,
                angle: -90,
                position: 'insideLeft',
                fill: '#999',
              }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#333', 
                border: '1px solid #555',
                borderRadius: '4px',
                color: '#fff'
              }} 
            />
            <Legend 
              verticalAlign="top" 
              wrapperStyle={{ paddingBottom: '10px' }}
              formatter={(value) => <span style={{ color: '#ccc' }}>{value}</span>}
            />
            
            {lines.map((line) => (
              <Line
                key={line.id}
                type="monotone"
                dataKey={line.id}
                name={line.name}
                stroke={line.color}
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SensorLineChart;