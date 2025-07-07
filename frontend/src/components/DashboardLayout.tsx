
import { useState } from "react";
import { 
  BarChart3, 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  MessageSquare, 
  Settings, 
  LogOut,
  Search,
  Bell,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [activeItem, setActiveItem] = useState("Dashboard");

  const navigationItems = [
    { name: "Dashboard", icon: BarChart3, active: true },
    { name: "Leaderboard", icon: TrendingUp, active: false },
    { name: "Order", icon: ShoppingCart, active: false },
    { name: "Products", icon: Package, active: false },
    { name: "Sales Report", icon: BarChart3, active: false },
    { name: "Messages", icon: MessageSquare, active: false },
    { name: "Settings", icon: Settings, active: false },
    { name: "Sign Out", icon: LogOut, active: false },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-64 bg-white shadow-sm border-r">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">Wedd</span>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveItem(item.name)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                item.name === activeItem
                  ? "bg-blue-50 text-blue-600 border border-blue-200"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="m-4 p-4 bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl text-white">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold">$</span>
            </div>
            <span className="font-semibold">Wedd Pro</span>
          </div>
          <p className="text-sm text-white/80 mb-3">
            Get access to all features on testmonials
          </p>
          <Button 
            variant="secondary" 
            size="sm" 
            className="w-full bg-white text-blue-600 hover:bg-gray-100"
          >
            Get Pro
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search here..."
                  className="pl-10 pr-4 py-2 border-gray-200"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="w-6 h-4 bg-gray-200 rounded-sm flex items-center justify-center text-xs">🇺🇸</span>
                <span>Eng (US)</span>
              </div>
              
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900">Musfiq</div>
                  <div className="text-gray-500">Admin</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
