import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FileBarChart,
  Settings,
  Search,
  Bell,
  ChevronDown,
  ChevronRight,
  Plus,
  Globe,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useEffect } from "react";
import NotificationPanel from "./NotificationPanel";
import { notificationAPI } from "../services/api.js";

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({
    products: true,
    orders: false,
    customers: false,
    reports: false,
  });
  const [activeItem, setActiveItem] = useState("dashboard");
  const [languageOpen, setLanguageOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await notificationAPI.getAll();
        setUnreadCount(data.unreadCount);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleNavigation = (item) => {
    if (item.path) {
      navigate(item.path);
      setActiveItem(item.id);
    }
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const toggleMenu = (menu) => {
    setExpandedMenus((prev) => {
      // Close all other menus when opening a new one
      const newState = Object.keys(prev).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {});
      newState[menu] = !prev[menu];
      return newState;
    });
  };

  const navigationItems = [
    {
      id: "dashboard",
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      id: "products",
      name: "Products",
      icon: Package,
      path: "/product",
      submenu: [
        { id: "all-products", name: "All Products", path: "/product" },
        { id: "add-product", name: "Add Product", path: "/payment" },
        { id: "categories", name: "Categories", path: "/categories" },
      ],
    },
    {
      id: "orders",
      name: "Orders",
      icon: ShoppingCart,
      path: "/invoices",
      submenu: [
        { id: "all-orders", name: "All Orders", path: "/invoices" },
        { id: "new-order", name: "New Order", path: "/new-invoices" },
      ],
    },
    {
      id: "customers",
      name: "Customers",
      icon: Users,
      path: "/customers",
      submenu: [
        { id: "all-customers", name: "All Customers", path: "/customers" },
        { id: "add-customer", name: "Add Customer", path: "/add-customers" },
      ],
    },
    {
      id: "reports",
      name: "Reports",
      icon: FileBarChart,
      path: "/analytics",
      submenu: [
        { id: "sales-report", name: "Sales Report", path: "/analytics" },
        {
          id: "inventory-report",
          name: "Inventory Report",
          path: "/analytics",
        },
      ],
    },
    {
      id: "settings",
      name: "Settings",
      icon: Settings,
      path: "/settings",
    },
  ];

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "uz", name: "O'zbekcha", flag: "🇺🇿" },
    { code: "ru", name: "Русский", flag: "🇷🇺" },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Modern Sidebar */}
      <div
        className={`${
          collapsed ? "w-20" : "w-72"
        } bg-white/80 backdrop-blur-xl border-r border-gray-200/50 shadow-xl transition-all duration-500 ease-in-out flex flex-col relative overflow-hidden`}
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-50" />

        {/* Header */}
        <div className="relative p-6 border-b border-gray-200/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-300" />
              </div>
              {!collapsed && (
                <div className="flex flex-col">
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    ClientFlow
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    Pro Edition
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2.5 hover:bg-gray-100 rounded-lg transition-all duration-300 transform hover:scale-110 active:scale-95 flex-shrink-0"
            >
              {collapsed ? (
                <Menu size={20} className="text-gray-600" />
              ) : (
                <X size={20} className="text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="relative flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {navigationItems.map((item) => (
            <div key={item.id} className="space-y-1">
              <button
                onClick={() => {
                  if (item.submenu) {
                    if (!collapsed) {
                      toggleMenu(item.id);
                      // Navigate to parent path when clicking menu with submenu
                      if (item.path) {
                        navigate(item.path);
                      }
                    } else {
                      setCollapsed(false);
                      setTimeout(() => {
                        toggleMenu(item.id);
                        if (item.path) {
                          navigate(item.path);
                        }
                      }, 300);
                    }
                  } else {
                    handleNavigation(item);
                  }
                }}
                className={`w-full flex items-center ${
                  collapsed ? "justify-center px-3" : "justify-between px-4"
                } py-3 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden ${
                  isActiveRoute(item.path) && !item.submenu
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 transform scale-105"
                    : "text-gray-700 hover:bg-white hover:shadow-md transform hover:scale-102"
                }`}
                title={collapsed ? item.name : ""}
              >
                {/* Animated background on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="flex items-center space-x-3 relative z-10">
                  <item.icon
                    className={`w-5 h-5 transition-all duration-300 ${
                      activeItem === item.id && !item.submenu
                        ? "transform rotate-12"
                        : "group-hover:scale-110"
                    }`}
                  />
                  {!collapsed && <span>{item.name}</span>}
                </div>
                {!collapsed && item.submenu && (
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      expandedMenus[item.id] ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>

              {/* Submenu with animation */}
              {!collapsed && item.submenu && (
                <div
                  className={`ml-4 space-y-1 overflow-hidden transition-all duration-500 ease-in-out ${
                    expandedMenus[item.id]
                      ? "max-h-96 opacity-100 mt-2"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  {item.submenu.map((subItem, index) => (
                    <button
                      key={subItem.id}
                      onClick={() => handleNavigation(subItem)}
                      style={{
                        transitionDelay: expandedMenus[item.id]
                          ? `${index * 50}ms`
                          : "0ms",
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-300 transform ${
                        isActiveRoute(subItem.path)
                          ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 font-medium translate-x-2 shadow-sm"
                          : "text-gray-600 hover:bg-gray-50 hover:translate-x-1"
                      }`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                          isActiveRoute(subItem.path)
                            ? "bg-blue-600 scale-150"
                            : "bg-gray-300"
                        }`}
                      />
                      <span>{subItem.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Pro Upgrade Card */}
        {!collapsed && (
          <div className="relative m-4 p-5 rounded-2xl overflow-hidden group cursor-pointer transform transition-all duration-500 hover:scale-105">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 animate-gradient" />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-purple-600/90 to-pink-600/90" />

            {/* Floating particles effect */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute w-32 h-32 bg-white/10 rounded-full -top-10 -right-10 group-hover:scale-150 transition-transform duration-700" />
              <div className="absolute w-24 h-24 bg-white/10 rounded-full -bottom-8 -left-8 group-hover:scale-150 transition-transform duration-700 delay-100" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                  <span className="text-white font-bold">✨</span>
                </div>
                <span className="font-bold text-white text-lg">
                  Upgrade to Pro
                </span>
              </div>
              <p className="text-sm text-white/90 mb-4 leading-relaxed">
                Unlock premium features, advanced analytics, and priority
                support
              </p>
              <Button className="w-full bg-white text-purple-600 hover:bg-gray-50 font-semibold shadow-xl transform transition-all duration-300 hover:scale-105 active:scale-95">
                Get Pro Now →
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Modern Header */}
        <header className="bg-white/70 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Search Bar */}
              <div className="flex-1 max-w-xl">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-all duration-300 group-focus-within:text-blue-600" />
                  <Input
                    placeholder="Search anything..."
                    className="pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 bg-white/50"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded">
                      ⌘K
                    </kbd>
                  </div>
                </div>
              </div>

              {/* Right Actions */}
              <div className="flex items-center space-x-2 ml-6">
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative hover:bg-white hover:shadow-md transition-all duration-300 rounded-xl p-3"
                  onClick={() => {
                    navigate("/payment");
                  }}
                >
                  <Plus size={20} className="text-gray-600" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setNotificationOpen(true)}
                  className="relative hover:bg-white hover:shadow-md transition-all duration-300 rounded-xl p-3 group"
                >
                  <Bell
                    size={20}
                    className="text-gray-600 group-hover:animate-bounce"
                  />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full font-semibold animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </Button>

                {/* Language Selector */}
                <div
                  className="relative"
                  onMouseLeave={() => setLanguageOpen(false)}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLanguageOpen(!languageOpen)}
                    onMouseEnter={() => setLanguageOpen(true)}
                    className="flex items-center gap-2 hover:bg-white hover:shadow-md transition-all duration-300 rounded-xl px-3 py-3"
                  >
                    <Globe size={18} className="text-gray-600" />
                    <span className="text-sm font-medium">EN</span>
                    <ChevronDown
                      size={14}
                      className={`text-gray-500 transition-transform duration-300 ${
                        languageOpen ? "rotate-180" : ""
                      }`}
                    />
                  </Button>

                  {languageOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                      {languages.map((lang, index) => (
                        <button
                          key={lang.code}
                          style={{ animationDelay: `${index * 50}ms` }}
                          className="w-full text-left px-4 py-3 text-sm flex items-center gap-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 transform hover:translate-x-1"
                        >
                          <span className="text-xl">{lang.flag}</span>
                          <span className="font-medium text-gray-700">
                            {lang.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* User Profile */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    navigate("/settings");
                    setActiveItem("settings");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      navigate("/settings");
                      setActiveItem("settings");
                    }
                  }}
                  className="flex items-center space-x-3 pl-3 pr-1 py-1 hover:bg-white rounded-xl transition-all duration-300 cursor-pointer group hover:shadow-md"
                  title="Go to Settings"
                >
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      Tony
                    </div>
                    <div className="text-xs text-gray-500">Administrator</div>
                  </div>
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg">
                      <span className="text-white font-bold">TS</span>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
            <NotificationPanel
              isOpen={notificationOpen}
              onClose={() => setNotificationOpen(false)}
            />
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-8 overflow-auto">
          <Outlet />
        </main>
      </div>

      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 8s ease infinite;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
          background-color: rgb(209 213 219);
          border-radius: 4px;
        }
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background-color: transparent;
        }
        @keyframes in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-in {
          animation: in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
