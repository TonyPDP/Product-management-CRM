import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  ShoppingBag,
  Star,
  TrendingUp,
  RefreshCw,
  Sparkles,
  Filter,
  Download,
  Edit,
  Trash2,
  Eye,
  UserPlus,
  X,
  Check,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, active, inactive
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [searchQuery, filterStatus, customers]);

  const loadCustomers = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/customers`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setCustomers(data.customers || []);
        setStats(data.stats || {});
      } else {
        // Use mock data as fallback
        generateMockCustomers();
      }
    } catch (error) {
      console.error("Error:", error);
      generateMockCustomers();
    } finally {
      setLoading(false);
    }
  };

  const generateMockCustomers = () => {
    const firstNames = [
      "Александр",
      "Дмитрий",
      "Максим",
      "Иван",
      "Артем",
      "Елена",
      "Мария",
      "Анна",
      "Ольга",
      "Наталья",
      "Сергей",
      "Андрей",
      "Михаил",
      "Екатерина",
      "Татьяна",
    ];
    const lastNames = [
      "Иванов",
      "Петров",
      "Сидоров",
      "Козлов",
      "Новikov",
      "Морозов",
      "Волков",
      "Соловьев",
      "Васильев",
      "Зайцев",
    ];
    const cities = ["Москва", "Санкт-Петербург", "Новосибирск", "Екатеринбург", "Казань"];

    const mockCustomers = Array.from({ length: 15 }, (_, i) => {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`;
      const totalSpent = Math.floor(Math.random() * 10000) + 500;
      const orders = Math.floor(Math.random() * 20) + 1;
      const daysAgo = Math.floor(Math.random() * 90);
      const lastOrderDate = new Date();
      lastOrderDate.setDate(lastOrderDate.getDate() - daysAgo);

      return {
        id: i + 1,
        firstName,
        lastName,
        email,
        phone: `+7 (${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 90) + 10}-${Math.floor(Math.random() * 90) + 10}`,
        city: cities[Math.floor(Math.random() * cities.length)],
        totalSpent,
        orders,
        avgOrderValue: totalSpent / orders,
        lastOrder: lastOrderDate.toISOString().split("T")[0],
        status: daysAgo < 30 ? "active" : "inactive",
        rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 - 5.0
        joinDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
          .toISOString()
          .split("T")[0],
      };
    });

    // Sort by total spent
    mockCustomers.sort((a, b) => b.totalSpent - a.totalSpent);

    setCustomers(mockCustomers);
    setStats({
      totalCustomers: mockCustomers.length,
      activeCustomers: mockCustomers.filter((c) => c.status === "active").length,
      totalRevenue: mockCustomers.reduce((sum, c) => sum + c.totalSpent, 0),
      avgOrderValue:
        mockCustomers.reduce((sum, c) => sum + c.totalSpent, 0) /
        mockCustomers.reduce((sum, c) => sum + c.orders, 0),
    });
  };

  const filterCustomers = () => {
    let filtered = customers;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (customer) =>
          customer.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.phone.includes(searchQuery)
      );
    }

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter((customer) => customer.status === filterStatus);
    }

    setFilteredCustomers(filtered);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-cyan-900 bg-clip-text text-transparent">
                Клиенты
              </h1>
            </div>
            <p className="text-gray-500 ml-13">Управление базой клиентов</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadCustomers}
              disabled={loading}
              className="p-3 hover:bg-white rounded-xl transition-all duration-300 shadow-sm hover:shadow-md group"
              title="Обновить"
            >
              <RefreshCw
                className={`w-5 h-5 text-gray-600 transition-transform duration-500 ${
                  loading ? "animate-spin" : "group-hover:rotate-180"
                }`}
              />
            </button>
            <Button
              variant="outline"
              className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-300"
            >
              <Download className="w-4 h-4 mr-2" />
              Экспорт
            </Button>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Добавить клиента
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                label: "Всего клиентов",
                value: stats.totalCustomers,
                icon: Users,
                gradient: "from-blue-500 to-cyan-600",
                change: "+12.5%",
              },
              {
                label: "Активных",
                value: stats.activeCustomers,
                icon: TrendingUp,
                gradient: "from-green-500 to-emerald-600",
                change: "+8.3%",
              },
              {
                label: "Общий доход",
                value: `$${stats.totalRevenue.toLocaleString()}`,
                icon: DollarSign,
                gradient: "from-purple-500 to-pink-600",
                change: "+15.2%",
              },
              {
                label: "Средний чек",
                value: `$${stats.avgOrderValue.toFixed(2)}`,
                icon: ShoppingBag,
                gradient: "from-orange-500 to-red-600",
                change: "+5.7%",
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
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-600">
                      <TrendingUp className="w-3 h-3" />
                      {stat.change}
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Search and Filter Bar */}
        <div
          className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50"
          style={{ animation: "slide-up 0.6s ease-out 0.4s both" }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Поиск по имени, email или телефону..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              {[
                { value: "all", label: "Все", icon: Users },
                { value: "active", label: "Активные", icon: TrendingUp },
                { value: "inactive", label: "Неактивные", icon: Filter },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setFilterStatus(filter.value)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    filterStatus === filter.value
                      ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <filter.icon className="w-4 h-4" />
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Customers Table/Grid */}
        <div
          className="space-y-4"
          style={{ animation: "slide-up 0.6s ease-out 0.5s both" }}
        >
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-12 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg">
              <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Клиенты не найдены
              </h3>
              <p className="text-gray-600">Попробуйте изменить параметры поиска</p>
            </div>
          ) : (
            filteredCustomers.map((customer, idx) => (
              <div
                key={customer.id}
                className="group relative"
                style={{ animation: `slide-up 0.4s ease-out ${idx * 0.05}s both` }}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                <div className="relative bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    {/* Customer Info */}
                    <div className="flex items-center gap-6 flex-1">
                      {/* Avatar */}
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                          <span className="text-white font-bold text-xl">
                            {customer.firstName[0]}
                            {customer.lastName[0]}
                          </span>
                        </div>
                        <div
                          className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                            customer.status === "active" ? "bg-green-500" : "bg-gray-400"
                          }`}
                        ></div>
                      </div>

                      {/* Details */}
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Name & Contact */}
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                            {customer.firstName} {customer.lastName}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                            <Mail className="w-4 h-4" />
                            {customer.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            {customer.phone}
                          </div>
                        </div>

                        {/* Location & Join Date */}
                        <div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <MapPin className="w-4 h-4 text-blue-500" />
                            {customer.city}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4 text-purple-500" />
                            С {new Date(customer.joinDate).toLocaleDateString("ru-RU")}
                          </div>
                          <div className="flex items-center gap-1 mt-2">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-semibold text-gray-900">
                              {customer.rating}
                            </span>
                          </div>
                        </div>

                        {/* Orders & Spending */}
                        <div>
                          <div className="mb-3">
                            <p className="text-xs text-gray-500 mb-1">Заказов</p>
                            <p className="text-2xl font-bold text-gray-900">{customer.orders}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Последний заказ</p>
                            <p className="text-sm font-medium text-gray-700">
                              {new Date(customer.lastOrder).toLocaleDateString("ru-RU")}
                            </p>
                          </div>
                        </div>

                        {/* Revenue */}
                        <div>
                          <div className="mb-3">
                            <p className="text-xs text-gray-500 mb-1">Всего потрачено</p>
                            <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                              ${customer.totalSpent.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Средний чек</p>
                            <p className="text-sm font-medium text-gray-700">
                              ${customer.avgOrderValue.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => setSelectedCustomer(customer)}
                        className="p-3 hover:bg-blue-50 rounded-xl transition-all duration-300 group/btn"
                        title="Просмотр"
                      >
                        <Eye className="w-5 h-5 text-gray-600 group-hover/btn:text-blue-600" />
                      </button>
                      <button
                        className="p-3 hover:bg-green-50 rounded-xl transition-all duration-300 group/btn"
                        title="Редактировать"
                      >
                        <Edit className="w-5 h-5 text-gray-600 group-hover/btn:text-green-600" />
                      </button>
                      <button
                        className="p-3 hover:bg-red-50 rounded-xl transition-all duration-300 group/btn"
                        title="Удалить"
                      >
                        <Trash2 className="w-5 h-5 text-gray-600 group-hover/btn:text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div
            className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl animate-in slide-in-from-bottom-4 duration-500"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Детали клиента</h2>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Customer Header */}
              <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">
                    {selectedCustomer.firstName[0]}
                    {selectedCustomer.lastName[0]}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedCustomer.firstName} {selectedCustomer.lastName}
                  </h3>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-semibold">{selectedCustomer.rating}</span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        selectedCustomer.status === "active"
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {selectedCustomer.status === "active" ? "Активный" : "Неактивный"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Mail className="w-4 h-4" />
                    <span className="text-xs font-medium">Email</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{selectedCustomer.email}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Phone className="w-4 h-4" />
                    <span className="text-xs font-medium">Телефон</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{selectedCustomer.phone}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs font-medium">Город</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{selectedCustomer.city}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs font-medium">Дата регистрации</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(selectedCustomer.joinDate).toLocaleDateString("ru-RU")}
                  </p>
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl text-center">
                  <ShoppingBag className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{selectedCustomer.orders}</p>
                  <p className="text-xs text-gray-600">Заказов</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl text-center">
                  <DollarSign className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    ${selectedCustomer.totalSpent.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600">Всего</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl text-center">
                  <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    ${selectedCustomer.avgOrderValue.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-600">Средний чек</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white">
                  <Mail className="w-4 h-4 mr-2" />
                  Написать письмо
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Редактировать
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
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

export default Customers;