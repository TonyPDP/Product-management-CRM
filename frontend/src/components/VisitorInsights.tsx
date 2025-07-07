
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const VisitorInsights = () => {
  const data = [
    { month: "Jan", loyal: 30, new: 25, unique: 20 },
    { month: "Feb", loyal: 35, new: 30, unique: 25 },
    { month: "Mar", loyal: 25, new: 35, unique: 30 },
    { month: "Apr", loyal: 40, new: 25, unique: 35 },
    { month: "May", loyal: 35, new: 45, unique: 25 },
    { month: "Jun", loyal: 45, new: 35, unique: 40 },
    { month: "Jul", loyal: 40, new: 50, unique: 35 },
    { month: "Aug", loyal: 50, new: 40, unique: 45 },
    { month: "Sep", loyal: 45, new: 55, unique: 40 },
    { month: "Oct", loyal: 55, new: 45, unique: 50 },
    { month: "Nov", loyal: 50, new: 60, unique: 45 },
    { month: "Dec", loyal: 60, new: 50, unique: 55 },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Visitor Insights</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
            />
            <YAxis hide />
            <Line 
              type="monotone" 
              dataKey="loyal" 
              stroke="#8B5CF6" 
              strokeWidth={2}
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="new" 
              stroke="#EF4444" 
              strokeWidth={2}
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="unique" 
              stroke="#10B981" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex items-center justify-center space-x-6 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Loyal Customers</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-sm text-gray-600">New Customers</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Unique Customers</span>
        </div>
      </div>
    </div>
  );
};

export default VisitorInsights;
