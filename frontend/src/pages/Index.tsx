import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, DollarSign, TrendingUp, Layers, ShoppingBag, AlertCircle, Sparkles, Plus, RefreshCw } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from "recharts";
import { useNavigate } from "react-router-dom";

// ✅ FIXED: Use environment variable for API URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // ✅ NEW: Error state
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError(null); // ✅ NEW: Reset error
      
      const [statsResponse, productsResponse] = await Promise.all([
        fetch(`${API_URL}/statistics`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/products`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);

      if (statsResponse.ok && productsResponse.ok) {
        const statsData = await statsResponse.json();
        const productsData = await productsResponse.json();
        
        setStats(statsData);
        setProducts(productsData);
      } else {
        throw new Error("Не удалось загрузить данные");
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "Не удалось подключиться к серверу"); // ✅ NEW: Set error
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW: Loading State
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

  // ✅ NEW: Error State
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
        <div className="text-center max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Ошибка загрузки
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={loadDashboardData}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Попробовать снова
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/login")}
              className="hover:bg-gray-50"
            >
              Вернуться к входу
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ NEW: Empty State
  if (!stats || products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
        <div className="text-center max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto">
              <Package className="w-12 h-12 text-blue-600" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Начните работу
          </h3>
          <p className="text-gray-600 mb-6">
            У вас пока нет товаров. Добавьте первый товар, чтобы начать управлять вашим инвентарем.
          </p>
          <Button
            onClick={() => navigate("/payment")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            Добавить первый товар
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ✅ NEW: Header with Refresh Button */}
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                Dashboard
              </h1>
            </div>
            <p className="text-gray-500 ml-13">Добро пожаловать в вашу CRM систему</p>
          </div>
          
          {/* ✅ NEW: Refresh Button */}
          <button
            onClick={loadDashboardData}
            disabled={loading}
            className="p-3 hover:bg-white rounded-xl transition-all duration-300 shadow-sm hover:shadow-md group"
            title="Обновить данные"
          >
            <RefreshCw className={`w-5 h-5 text-gray-600 transition-transform duration-500 ${loading ? 'animate-spin' : 'group-hover:rotate-180'}`} />
          </button>
        </div>

        {/* Main Stats Grid */}
        <MainStats stats={stats} products={products} />

        {/* Secondary Insights */}
        <InsightsGrid products={products} stats={stats} />

        {/* Products Grid */}
        <ProductsShowcase products={products} navigate={navigate} />

        {/* ✅ NEW: Floating Action Button */}
        <div className="fixed bottom-8 right-8 z-50">
          <button
            onClick={() => navigate('/payment')}
            className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center text-white transform hover:scale-110 transition-all duration-300 group"
            title="Добавить товар"
          >
            <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN STATS ====================
const MainStats = ({ stats, products }) => {
  if (!stats) return null;

  const categories = [...new Set(products.map(p => p.category))].length;
  const avgPrice = products.length > 0 
    ? (products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(2)
    : 0;
  const inStockProducts = products.filter(p => p.stock > 0).length;
  const inStockPercentage = products.length > 0 ? ((inStockProducts / products.length) * 100).toFixed(0) : 0;

  const mainStats = [
    {
      label: "Всего товаров",
      value: stats.total_products,
      subtitle: `${categories} категорий`,
      icon: Package,
      gradient: "from-violet-500 to-purple-600",
      shadow: "shadow-violet-500/30",
      delay: "0s",
    },
    {
      label: "Общая стоимость",
      value: `$${parseFloat(stats.total_value).toFixed(2)}`,
      subtitle: `Средняя: $${avgPrice}`,
      icon: DollarSign,
      gradient: "from-emerald-500 to-teal-600",
      shadow: "shadow-emerald-500/30",
      delay: "0.1s",
    },
    {
      label: "В наличии",
      value: inStockProducts,
      subtitle: `${inStockPercentage}% от общего`,
      icon: ShoppingBag,
      gradient: "from-blue-500 to-cyan-600",
      shadow: "shadow-blue-500/30",
      delay: "0.2s",
    },
    {
      label: "Требует внимания",
      value: stats.low_stock + stats.out_of_stock,
      subtitle: `${stats.low_stock} мало, ${stats.out_of_stock} нет`,
      icon: AlertCircle,
      gradient: "from-orange-500 to-red-600",
      shadow: "shadow-orange-500/30",
      delay: "0.3s",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {mainStats.map((stat, idx) => (
        <div
          key={idx}
          className="group relative"
          style={{ animation: `slide-up 0.6s ease-out ${stat.delay} both` }}
        >
          <div className={`absolute -inset-0.5 bg-gradient-to-r ${stat.gradient} rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-500`}></div>
          
          <div className="relative bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4 shadow-lg ${stat.shadow} transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
              <stat.icon className="w-7 h-7 text-white" />
            </div>

            <div className="space-y-1">
              <div className="text-4xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-gray-900">{stat.label}</div>
              <div className="text-xs text-gray-500">{stat.subtitle}</div>
            </div>

            <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
              <stat.icon className="w-full h-full text-gray-900" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ==================== INSIGHTS GRID ====================
const InsightsGrid = ({ products, stats }) => {
  const categoryData = {};
  products.forEach(p => {
    categoryData[p.category] = (categoryData[p.category] || 0) + 1;
  });

  const pieData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444'];

  const trendData = Array.from({ length: 12 }, (_, i) => ({
    month: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'][i],
    value: 50 + Math.random() * 50,
  }));

  return (
    <div 
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      style={{ animation: "slide-up 0.6s ease-out 0.4s both" }}
    >
      <div className="group relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
        <div className="relative bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Распределение</h3>
              <p className="text-xs text-gray-500">По категориям</p>
            </div>
          </div>

          <div className="flex items-center justify-center h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            {pieData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                <span className="text-xs text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="group relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
        <div className="relative bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Тренд запасов</h3>
              <p className="text-xs text-gray-500">За последние 12 месяцев</p>
            </div>
          </div>

          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  fill="url(#colorGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== PRODUCTS SHOWCASE ====================
// ✅ UPDATED: Now accepts navigate prop and products are clickable
const ProductsShowcase = ({ products, navigate }) => {
  const featuredProducts = products.slice(0, 6);

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <div 
      className="space-y-6"
      style={{ animation: "slide-up 0.6s ease-out 0.5s both" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Товары</h3>
            <p className="text-sm text-gray-500">Последние добавленные</p>
          </div>
        </div>
        {/* ✅ NEW: View All Button */}
        <Button
          variant="outline"
          onClick={() => navigate('/product')}
          className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300"
        >
          Смотреть все
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredProducts.map((product, idx) => (
          <div
            key={product.id}
            onClick={() => navigate('/product')} // ✅ NEW: Clickable cards
            className="group relative cursor-pointer" // ✅ NEW: Added cursor-pointer
            style={{ animation: `slide-up 0.5s ease-out ${0.6 + idx * 0.1}s both` }}
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            
            <div className="relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="absolute top-4 right-4">
                  <div className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md ${
                    product.status === "В наличии"
                      ? "bg-green-500/90 text-white"
                      : product.status === "Мало на складе"
                      ? "bg-yellow-500/90 text-white"
                      : "bg-red-500/90 text-white"
                  }`}>
                    {product.status}
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-1 truncate group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h4>
                <p className="text-sm text-gray-500 mb-4">
                  {product.brand} • {product.category}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Цена</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      ${product.price}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">Остаток</p>
                    <p className={`text-2xl font-bold ${
                      product.stock === 0 ? "text-red-500" : 
                      product.stock < 15 ? "text-yellow-500" : 
                      "text-green-500"
                    }`}>
                      {product.stock}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Add animations
const style = document.createElement('style');
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

export default Dashboard;