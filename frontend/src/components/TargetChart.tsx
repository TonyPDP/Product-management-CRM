
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const TargetChart = () => {
  const data = [
    { month: "Jan", reality: 8500, target: 12000 },
    { month: "Feb", reality: 9200, target: 11500 },
    { month: "Mar", reality: 8800, target: 11800 },
    { month: "Apr", reality: 10200, target: 12500 },
    { month: "May", reality: 9800, target: 12200 },
    { month: "Jun", reality: 11200, target: 13000 },
    { month: "Jul", reality: 10800, target: 12800 },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">Target vs Reality</h3>
      
      <div className="h-48 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#6B7280' }}
            />
            <YAxis hide />
            <Bar dataKey="reality" fill="#10B981" radius={2} />
            <Bar dataKey="target" fill="#F59E0B" radius={2} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Reality Sales</span>
          </div>
          <p className="text-sm font-semibold text-gray-900"></p>
          <p className="text-xs text-gray-500">Global</p>
        </div>
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Target Sales</span>
          </div>
          <p className="text-sm font-semibold text-gray-900"></p>
          <p className="text-xs text-gray-500">Commercial</p>
        </div>
      </div>
    </div>
  );
};

export default TargetChart;
