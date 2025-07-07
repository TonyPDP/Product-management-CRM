
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const VolumeChart = () => {
  const data = [
    { category: "A", volume: 85, services: 75 },
    { category: "B", volume: 92, services: 68 },
    { category: "C", volume: 78, services: 85 },
    { category: "D", volume: 88, services: 72 },
    { category: "E", volume: 95, services: 80 },
    { category: "F", volume: 82, services: 78 },
    { category: "G", volume: 90, services: 85 },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">Volume vs Service Level</h3>
      
      <div className="h-48 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis 
              dataKey="category" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#6B7280' }}
            />
            <YAxis hide />
            <Bar dataKey="volume" fill="#3B82F6" radius={2} />
            <Bar dataKey="services" fill="#10B981" radius={2} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <div className="text-center">
          <div className="flex items-center space-x-2 mb-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Volume</span>
          </div>
          <p className="text-sm font-semibold text-gray-900"></p>
        </div>
        <div className="text-center">
          <div className="flex items-center space-x-2 mb-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Services</span>
          </div>
          <p className="text-sm font-semibold text-gray-900"></p>
        </div>
      </div>
    </div>
  );
};

export default VolumeChart;
