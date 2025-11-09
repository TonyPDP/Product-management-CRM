import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, ShoppingCart, CheckCircle, Users, Package, DollarSign } from "lucide-react";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, ResponsiveContainer, XAxis, YAxis } from "recharts";

const StatsCards = ({ stats, products }) => {
  if (!stats) return null;

  // Calculate additional metrics from products
  const totalProducts = products.length;
  const inStockProducts = products.filter(p => p.stock > 0).length;
  const categories = [...new Set(products.map(p => p.category))].length;
  const avgPrice = products.length > 0 
    ? (products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(2)
    : 0;

  const cardsData = [
    {
      title: "Всего товаров",
      value: stats.total_products.toString(),
      subtitle: `${categories} категорий`,
      icon: Package,
      bgColor: "bg-blue-50",
      iconColor: "bg-blue-100 text-blue-600",
    },
    {
      title: "Общая стоимость",
      value: `$${parseFloat(stats.total_value).toFixed(2)}`,
      subtitle: `Средняя цена: $${avgPrice}`,
      icon: DollarSign,
      bgColor: "bg-green-50",
      iconColor: "bg-green-100 text-green-600",
    },
    {
      title: "В наличии",
      value: inStockProducts.toString(),
      subtitle: `${((inStockProducts / totalProducts) * 100).toFixed(0)}% от общего`,
      icon: CheckCircle,
      bgColor: "bg-emerald-50",
      iconColor: "bg-emerald-100 text-emerald-600",
    },
    {
      title: "Требует внимания",
      value: (stats.low_stock + stats.out_of_stock).toString(),
      subtitle: `${stats.low_stock} мало, ${stats.out_of_stock} нет`,
      icon: TrendingUp,
      bgColor: "bg-orange-50",
      iconColor: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Текущее состояние</h2>
          <p className="text-sm text-gray-500">Основные показатели склада</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cardsData.map((card, index) => (
          <div key={index} className={`p-6 rounded-xl ${card.bgColor}`}>
            <div className={`w-10 h-10 rounded-lg ${card.iconColor} flex items-center justify-center mb-4`}>
              <card.icon className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
              <p className="text-sm font-medium text-gray-700">{card.title}</p>
              <p className="text-xs text-gray-500">{card.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsCards;