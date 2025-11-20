import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  TrendingUp,
  Package,
  DollarSign,
  BarChart3,
  Megaphone,
  Monitor,
  Palette,
  Video,
  Layout,
  Mail,
  Users,
  Target,
} from "lucide-react";

const CATEGORY_ICONS = {
  "Наружная реклама": Megaphone,
  "Цифровой маркетинг": Monitor,
  "Графический дизайн": Palette,
  "Видеопродакшн": Video,
  "Брендинг": Layout,
  "Email маркетинг": Mail,
  "SMM": Users,
  "Таргетированная реклама": Target,
};

const MOCK_CATEGORIES = [
  {
    id: "CAT-001",
    name: "Наружная реклама",
    description: "Билборды, баннеры, вывески и другая наружная реклама",
    icon: "Megaphone",
    productCount: 45,
    totalRevenue: 125000,
    color: "from-blue-500 to-blue-600",
    status: "active",
  },
  {
    id: "CAT-002",
    name: "Цифровой маркетинг",
    description: "SEO, контекстная реклама, аналитика",
    icon: "Monitor",
    productCount: 32,
    totalRevenue: 89000,
    color: "from-purple-500 to-purple-600",
    status: "active",
  },
  {
    id: "CAT-003",
    name: "Графический дизайн",
    description: "Логотипы, фирменный стиль, полиграфия",
    icon: "Palette",
    productCount: 67,
    totalRevenue: 54000,
    color: "from-pink-500 to-pink-600",
    status: "active",
  },
  {
    id: "CAT-004",
    name: "Видеопродакшн",
    description: "Видеоролики, анимация, монтаж",
    icon: "Video",
    productCount: 28,
    totalRevenue: 98000,
    color: "from-red-500 to-red-600",
    status: "active",
  },
  {
    id: "CAT-005",
    name: "Брендинг",
    description: "Разработка и поддержка бренда",
    icon: "Layout",
    productCount: 19,
    totalRevenue: 156000,
    color: "from-indigo-500 to-indigo-600",
    status: "active",
  },
  {
    id: "CAT-006",
    name: "Email маркетинг",
    description: "Рассылки, автоворонки, email-кампании",
    icon: "Mail",
    productCount: 41,
    totalRevenue: 34000,
    color: "from-green-500 to-green-600",
    status: "active",
  },
  {
    id: "CAT-007",
    name: "SMM",
    description: "Управление социальными сетями, контент",
    icon: "Users",
    productCount: 55,
    totalRevenue: 67000,
    color: "from-orange-500 to-orange-600",
    status: "active",
  },
  {
    id: "CAT-008",
    name: "Таргетированная реклама",
    description: "Facebook Ads, Instagram Ads, TikTok Ads",
    icon: "Target",
    productCount: 38,
    totalRevenue: 112000,
    color: "from-cyan-500 to-cyan-600",
    status: "active",
  },
];

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "Megaphone",
    color: "from-blue-500 to-blue-600",
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      // In real app, fetch from API
      setCategories(MOCK_CATEGORIES);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      setFilteredCategories(
        categories.filter((cat) =>
          cat.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredCategories(categories);
    }
  }, [searchQuery, categories]);

  const handleAddNew = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      description: "",
      icon: "Megaphone",
      color: "from-blue-500 to-blue-600",
    });
    setShowModal(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      icon: category.icon,
      color: category.color,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editingCategory) {
        // Update existing
        setCategories(
          categories.map((cat) =>
            cat.id === editingCategory.id
              ? { ...cat, ...formData }
              : cat
          )
        );
      } else {
        // Add new
        const newCategory = {
          id: `CAT-${Date.now()}`,
          ...formData,
          productCount: 0,
          totalRevenue: 0,
          status: "active",
        };
        setCategories([...categories, newCategory]);
      }
      setShowModal(false);
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleDelete = async (categoryId) => {
    if (confirm("Удалить эту категорию?")) {
      setCategories(categories.filter((cat) => cat.id !== categoryId));
    }
  };

  const totalProducts = categories.reduce((sum, cat) => sum + cat.productCount, 0);
  const totalRevenue = categories.reduce((sum, cat) => sum + cat.totalRevenue, 0);

  const getIcon = (iconName) => {
    const Icon = CATEGORY_ICONS[iconName] || Megaphone;
    return Icon;
  };

  const colorOptions = [
    { name: "Синий", value: "from-blue-500 to-blue-600" },
    { name: "Фиолетовый", value: "from-purple-500 to-purple-600" },
    { name: "Розовый", value: "from-pink-500 to-pink-600" },
    { name: "Красный", value: "from-red-500 to-red-600" },
    { name: "Индиго", value: "from-indigo-500 to-indigo-600" },
    { name: "Зелёный", value: "from-green-500 to-green-600" },
    { name: "Оранжевый", value: "from-orange-500 to-orange-600" },
    { name: "Голубой", value: "from-cyan-500 to-cyan-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Категории услуг</h1>
          <p className="text-gray-600 mt-1">
            Управляйте категориями рекламных услуг
          </p>
        </div>
        <Button
          onClick={handleAddNew}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Добавить категорию
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Всего категорий</p>
                <p className="text-2xl font-bold text-gray-900">
                  {categories.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Всего услуг</p>
                <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Общий доход</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Поиск категорий..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredCategories.map((category) => {
          const Icon = getIcon(category.name);
          return (
            <Card
              key={category.id}
              className="group hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className={`h-2 bg-gradient-to-r ${category.color}`} />
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`h-14 w-14 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit2 className="h-4 w-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-gray-900 text-lg mb-2">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {category.description}
                </p>

                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Услуг</span>
                    <span className="font-semibold text-gray-900">
                      {category.productCount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Доход</span>
                    <span className="font-semibold text-green-600">
                      ${category.totalRevenue.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center text-sm text-gray-500">
                    <TrendingUp className="h-4 w-4 mr-1 text-green-600" />
                    <span>Активная категория</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowModal(false)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-2xl shadow-2xl z-50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingCategory ? "Редактировать" : "Новая"} категория
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Название категории
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Например: Наружная реклама"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Описание
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Краткое описание категории..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Иконка
                </label>
                <select
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.keys(CATEGORY_ICONS).map((iconName) => (
                    <option key={iconName} value={iconName}>
                      {iconName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Цвет
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      onClick={() =>
                        setFormData({ ...formData, color: color.value })
                      }
                      className={`h-12 rounded-lg bg-gradient-to-br ${color.value} transition-all ${
                        formData.color === color.value
                          ? "ring-4 ring-blue-500 ring-offset-2 scale-110"
                          : "hover:scale-105"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => setShowModal(false)}
                variant="outline"
                className="flex-1"
              >
                Отмена
              </Button>
              <Button onClick={handleSave} className="flex-1 bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                Сохранить
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CategoriesPage;