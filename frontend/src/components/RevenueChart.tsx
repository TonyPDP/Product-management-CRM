
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const RevenueChart = () => {
  const data = [
    { day: "Monday", online: 15, offline: 10 },
    { day: "Tuesday", online: 20, offline: 15 },
    { day: "Wednesday", online: 5, offline: 25 },
    { day: "Thursday", online: 25, offline: 8 },
    { day: "Friday", online: 15, offline: 20 },
    { day: "Saturday", online: 30, offline: 12 },
    { day: "Sunday", online: 35, offline: 5 },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">Total Revenue</h3>
      <div className="h-48 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#6B7280' }}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis hide />
            <Bar dataKey="online" fill="#3B82F6" radius={2} />
            <Bar dataKey="offline" fill="#10B981" radius={2} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex items-center justify-center space-x-4 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-xs text-gray-600">Online Sales</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-xs text-gray-600">Offline Sales</span>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
