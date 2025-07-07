
import { TrendingUp, ShoppingCart, CheckCircle, Users } from "lucide-react";

const StatsCards = () => {
  const stats = [
    {
      title: "Total Sales",
      value: "$",
      change: "",
      icon: TrendingUp,
      bgColor: "bg-red-50",
      iconColor: "bg-red-100 text-red-600",
    },
    {
      title: "Total Order",
      value: "",
      change: "",
      icon: ShoppingCart,
      bgColor: "bg-orange-50",
      iconColor: "bg-orange-100 text-orange-600",
    },
    {
      title: "Product Sold",
      value: "",
      change: "",
      icon: CheckCircle,
      bgColor: "bg-green-50",
      iconColor: "bg-green-100 text-green-600",
    },
    {
      title: "New Customers",
      value: "",
      change: "",
      icon: Users,
      bgColor: "bg-purple-50",
      iconColor: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Today's Sales</h2>
          <p className="text-sm text-gray-500">Sales Summary</p>
        </div>
        <button className="flex items-center space-x-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
          <span>Export</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className={`p-6 rounded-xl ${stat.bgColor}`}>
            <div className={`w-10 h-10 rounded-lg ${stat.iconColor} flex items-center justify-center mb-4`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-sm font-medium text-gray-700">{stat.title}</p>
              <p className="text-xs text-gray-500">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsCards;
