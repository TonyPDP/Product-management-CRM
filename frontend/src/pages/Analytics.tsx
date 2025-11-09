import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  ShoppingBag,
  Package,
  RefreshCw,
  Download,
  Sparkles,
  AlertCircle,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("weekly"); // daily, weekly, monthly
  const [salesData, setSalesData] = useState([]);
  const [stats, setStats] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch analytics data from backend
      const response = await fetch(`${API_URL}/analytics?range=${timeRange}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setSalesData(data.salesData || []);
        setStats(data.stats || {});
        setTopProducts(data.topProducts || []);
        setCategoryData(data.categoryData || []);
      } else {
        // Fallback to mock data if endpoint doesn't exist yet
        generateMockData();
      }
    } catch (error) {
      console.error("Error:", error);
      // Use mock data as fallback
      generateMockData();
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = () => {
    // Generate mock data based on time range
    let dataPoints = timeRange === "daily" ? 24 : timeRange === "weekly" ? 7 : 30;
    
    const mockSalesData = Array.from({ length: dataPoints }, (_, i) => {
      const date = new Date();
      if (timeRange === "daily") {
        return {
          name: `${i}:00`,
          sales: Math.floor(Math.random() * 500) + 100,
          revenue: Math.floor(Math.random() * 5000) + 1000,
          orders: Math.floor(Math.random() * 50) + 10,
        };
      } else if (timeRange === "weekly") {
        const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
        return {
          name: days[i],
          sales: Math.floor(Math.random() * 1500) + 500,
          revenue: Math.floor(Math.random() * 15000) + 5000,
          orders: Math.floor(Math.random() * 100) + 30,
        };
      } else {
        date.setDate(date.getDate() - (dataPoints - i - 1));
        return {
          name: `${date.getDate()}/${date.getMonth() + 1}`,
          sales: Math.floor(Math.random() * 3000) + 1000,
          revenue: Math.floor(Math.random() * 30000) + 10000,
          orders: Math.floor(Math.random() * 200) + 50,
        };
      }
    });

    const mockTopProducts = [
      { name: "iPhone 15 Pro", sales: 145, revenue: 145000, color: "#8B5CF6" },
      { name: "MacBook Air M3", sales: 98, revenue: 98000, color: "#EC4899" },
      { name: "AirPods Pro", sales: 234, revenue: 58500, color: "#F59E0B" },
      { name: "iPad Pro", sales: 67, revenue: 67000, color: "#10B981" },
      { name: "Apple Watch", sales: 123, revenue: 49200, color: "#3B82F6" },
    ];

    const mockCategoryData = [
      { name: "Electronics", value: 45, sales: 12500 },
      { name: "Accessories", value: 30, sales: 8200 },
      { name: "Clothing", value: 15, sales: 4100 },
      { name: "Home", value: 10, sales: 2800 },
    ];

    const totalRevenue = mockSalesData.reduce((sum, item) => sum + item.revenue, 0);
    const totalOrders = mockSalesData.reduce((sum, item) => sum + item.orders, 0);
    const avgOrderValue = totalRevenue / totalOrders;
    const prevRevenue = totalRevenue * 0.85;
    const revenueGrowth = ((totalRevenue - prevRevenue) / prevRevenue * 100).toFixed(1);

    setSalesData(mockSalesData);
    setTopProducts(mockTopProducts);
    setCategoryData(mockCategoryData);
    setStats({
      totalRevenue,
      totalOrders,
      avgOrderValue,
      revenueGrowth,
      ordersGrowth: 12.3,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-100 rounded-full animate-spin border-t-blue-500"></div>
          <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-blue-500 animate-pulse" />
        </div>
      </div>
    );
  }

  const COLORS = ["#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#3B82F6", "#EF4444"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 bg-clip-text text-transparent">
                Analytics
              </h1>
            </div>
            <p className="text-gray-500 ml-13">Анализ продаж и эффективности</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAnalyticsData}
              disabled={loading}
              className="p-3 hover:bg-white rounded-xl transition-all duration-300 shadow-sm hover:shadow-md group"
              title="Обновить данные"
            >
              <RefreshCw
                className={`w-5 h-5 text-gray-600 transition-transform duration-500 ${
                  loading ? "animate-spin" : "group-hover:rotate-180"
                }`}
              />
            </button>
            <Button
              variant="outline"
              className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300"
            >
              <Download className="w-4 h-4 mr-2" />
              Экспорт
            </Button>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-3 animate-in slide-in-from-bottom-4 duration-700">
          {[
            { value: "daily", label: "За день", icon: Activity },
            { value: "weekly", label: "За неделю", icon: Calendar },
            { value: "monthly", label: "За месяц", icon: TrendingUp },
          ].map((range) => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                timeRange === range.value
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30"
                  : "bg-white text-gray-700 hover:bg-gray-50 shadow-sm"
              }`}
            >
              <range.icon className="w-4 h-4" />
              {range.label}
            </button>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats && [
            {
              label: "Общий доход",
              value: `$${stats.totalRevenue.toLocaleString()}`,
              change: `+${stats.revenueGrowth}%`,
              icon: DollarSign,
              gradient: "from-green-500 to-emerald-600",
              positive: true,
            },
            {
              label: "Заказов",
              value: stats.totalOrders,
              change: `+${stats.ordersGrowth}%`,
              icon: ShoppingBag,
              gradient: "from-blue-500 to-cyan-600",
              positive: true,
            },
            {
              label: "Средний чек",
              value: `$${stats.avgOrderValue.toFixed(2)}`,
              change: "+5.2%",
              icon: TrendingUp,
              gradient: "from-purple-500 to-pink-600",
              positive: true,
            },
            {
              label: "Товаров продано",
              value: salesData.reduce((sum, item) => sum + item.sales, 0),
              change: "+8.1%",
              icon: Package,
              gradient: "from-orange-500 to-red-600",
              positive: true,
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="group relative"
              style={{ animation: `slide-up 0.6s ease-out ${idx * 0.1}s both` }}
            >
              <div
                className={`absolute -inset-0.5 bg-gradient-to-r ${stat.gradient} rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-500`}
              ></div>
              <div className="relative bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      stat.positive
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {stat.positive ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div
            className="group relative"
            style={{ animation: "slide-up 0.6s ease-out 0.4s both" }}
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    Динамика дохода
                  </h3>
                  <p className="text-sm text-gray-500">
                    {timeRange === "daily"
                      ? "Почасовая статистика"
                      : timeRange === "weekly"
                      ? "За последние 7 дней"
                      : "За последние 30 дней"}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
              </div>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis
                      dataKey="name"
                      stroke="#9CA3AF"
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis stroke="#9CA3AF" style={{ fontSize: "12px" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "none",
                        borderRadius: "12px",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#8B5CF6"
                      strokeWidth={3}
                      fill="url(#revenueGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Sales Chart */}
          <div
            className="group relative"
            style={{ animation: "slide-up 0.6s ease-out 0.5s both" }}
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-orange-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    Продажи и заказы
                  </h3>
                  <p className="text-sm text-gray-500">Количество по периодам</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-orange-600 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
              </div>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis
                      dataKey="name"
                      stroke="#9CA3AF"
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis stroke="#9CA3AF" style={{ fontSize: "12px" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "none",
                        borderRadius: "12px",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="sales" fill="#EC4899" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="orders" fill="#F59E0B" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <div
            className="group relative"
            style={{ animation: "slide-up 0.6s ease-out 0.6s both" }}
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-teal-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Топ товары</h3>
                  <p className="text-sm text-gray-500">По количеству продаж</p>
                </div>
              </div>

              <div className="space-y-4">
                {topProducts.map((product, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-all duration-300 group/item"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white"
                        style={{ backgroundColor: product.color }}
                      >
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 group-hover/item:text-blue-600 transition-colors">
                          {product.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {product.sales} продаж
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        ${product.revenue.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">доход</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Category Distribution */}
          <div
            className="group relative"
            style={{ animation: "slide-up 0.6s ease-out 0.7s both" }}
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
                  <PieChartIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    По категориям
                  </h3>
                  <p className="text-sm text-gray-500">Распределение продаж</p>
                </div>
              </div>

              <div className="flex items-center justify-center h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                {categoryData.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-3 rounded-lg bg-gray-50"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    ></div>
                    <div>
                      <p className="text-xs font-medium text-gray-900">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        ${item.sales.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add animations
const style = document.createElement("style");
style.textContent = `
  @keyframes slide-up {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .animate-fade-in {
    animation: fade-in 0.8s ease-out;
  }
`;
document.head.appendChild(style);

export default Analytics;