
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const SatisfactionChart = () => {
  const data = [
    { month: "Jan", lastMonth: 3000, thisMonth: 3200 },
    { month: "Feb", lastMonth: 2800, thisMonth: 3400 },
    { month: "Mar", lastMonth: 2400, thisMonth: 3600 },
    { month: "Apr", lastMonth: 2600, thisMonth: 3800 },
    { month: "May", lastMonth: 3200, thisMonth: 4000 },
    { month: "Jun", lastMonth: 3600, thisMonth: 4200 },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">Customer Satisfaction</h3>
      
      <div className="h-48 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#6B7280' }}
            />
            <YAxis hide />
            <Area 
              type="monotone" 
              dataKey="lastMonth" 
              fill="#93C5FD" 
              stroke="#3B82F6"
              fillOpacity={0.3}
            />
            <Area 
              type="monotone" 
              dataKey="thisMonth" 
              fill="#86EFAC" 
              stroke="#10B981"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <div className="text-center">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Last Month</span>
          </div>
          <p className="text-sm font-semibold text-gray-900"></p>
        </div>
        <div className="text-center">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-600">This Month</span>
          </div>
          <p className="text-sm font-semibold text-gray-900"></p>
        </div>
      </div>
    </div>
  );
};

export default SatisfactionChart;
