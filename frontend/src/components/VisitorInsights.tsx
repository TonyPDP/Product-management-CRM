import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, ShoppingCart, CheckCircle, Users, Package, DollarSign } from "lucide-react";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, ResponsiveContainer, XAxis, YAxis } from "recharts";

const InventoryInsights = ({ products }) => {
  // Group products by category and calculate monthly trend
  const categoryData = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = { count: 0, value: 0 };
    }
    acc[product.category].count += 1;
    acc[product.category].value += product.price * product.stock;
    return acc;
  }, {});

  // Create monthly data (simulated based on current stock)
  const months = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];
  const data = months.map((month, index) => {
    const baseValue = products.reduce((sum, p) => sum + p.stock, 0);
    return {
      month,
      inStock: Math.floor(baseValue * (0.7 + Math.random() * 0.3)),
      lowStock: Math.floor(baseValue * (0.1 + Math.random() * 0.1)),
      outOfStock: Math.floor(baseValue * (0.05 + Math.random() * 0.05)),
    };
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Динамика запасов</h3>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6B7280" }}
            />
            <YAxis hide />
            <Line
              type="monotone"
              dataKey="inStock"
              stroke="#10B981"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="lowStock"
              stroke="#F59E0B"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="outOfStock"
              stroke="#EF4444"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center space-x-6 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">В наличии</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Мало на складе</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Нет в наличии</span>
        </div>
      </div>
    </div>
  );
};

export default InventoryInsights