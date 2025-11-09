import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Calendar as CalendarIcon,
  Upload,
  X,
  Plus,
  Trash2,
  Save,
} from "lucide-react";

const COLORS = [
  { name: "Черный", hex: "#000000" },
  { name: "Белый", hex: "#FFFFFF" },
  { name: "Красный", hex: "#EF4444" },
  { name: "Синий", hex: "#3B82F6" },
  { name: "Зеленый", hex: "#10B981" },
  { name: "Желтый", hex: "#F59E0B" },
  { name: "Фиолетовый", hex: "#8B5CF6" },
  { name: "Розовый", hex: "#EC4899" },
  { name: "Серый", hex: "#6B7280" },
  { name: "Темно-синий", hex: "#1E3A8A" },
];

const SIZES = [
  "XS", "S", "M", "L", "XL", "XXL",
  "EU-38", "EU-39", "EU-40", "EU-41", "EU-42", "EU-43", "EU-44", "EU-45",
];

const API_URL = "http://localhost:3001/api";

const ProductForm = () => {
  const [date, setDate] = useState(new Date());
  const [images, setImages] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    gender: "",
    brand: "",
    description: "",
    price: "",
    comparePrice: "",
    sku: "",
    barcode: "",
    stock: "",
    weight: "",
    status: "active",
    tags: "",
  });

  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem("token");
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setImages((prev) => [...prev, ...urls]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleColor = (color) => {
    if (selectedColors.find((c) => c.hex === color.hex)) {
      setSelectedColors((prev) => prev.filter((c) => c.hex !== color.hex));
    } else {
      setSelectedColors((prev) => [...prev, color]);
    }
  };

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      { size: "", color: "", stock: "", sku: "" },
    ]);
  };

  const updateVariant = (index, field, value) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  };

  const removeVariant = (index) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.name || !formData.category || !formData.price) {
      alert("Пожалуйста, заполните обязательные поля: Название, Категория и Цена");
      return;
    }

    const token = getToken();
    if (!token) {
      alert("Вы не авторизованы. Пожалуйста, войдите в систему.");
      return;
    }

    setLoading(true);

    try {
      // Prepare product data for backend
      const productData = {
        name: formData.name,
        sku: formData.sku || `SKU-${Date.now()}`,
        barcode: formData.barcode || `BC-${Date.now()}`,
        category: formData.category,
        brand: formData.brand || "Не указан",
        price: parseFloat(formData.price) || 0,
        stock: parseInt(formData.stock) || 0,
        color: selectedColors.length > 0 ? selectedColors[0].name : "Не указан",
        size: variants.length > 0 ? variants[0].size : "Один размер",
        image: images.length > 0 
          ? images[0].url 
          : "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop",
      };

      // Send to backend
      const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Ошибка при создании товара");
      }

      const newProduct = await response.json();
      
      console.log("Товар успешно создан:", newProduct);
      alert("✅ Товар успешно добавлен! Вы можете увидеть его в разделе 'Склад'.");

      // Reset form
      setFormData({
        name: "",
        category: "",
        gender: "",
        brand: "",
        description: "",
        price: "",
        comparePrice: "",
        sku: "",
        barcode: "",
        stock: "",
        weight: "",
        status: "active",
        tags: "",
      });
      setImages([]);
      setSelectedColors([]);
      setVariants([]);
      setDate(new Date());

      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent("productAdded", { detail: newProduct }));

    } catch (error) {
      console.error("Ошибка при сохранении товара:", error);
      alert(`❌ Ошибка: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Добавить товар
          </h1>
          <p className="text-gray-600">
            Заполните информацию о новом товаре
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">
                  Основная информация
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Название товара *
                  </label>
                  <Input
                    placeholder="Например: Nike Air Force 1"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Категория *
                    </label>
                    <Select
                      value={formData.category}
                      onValueChange={(val) => handleInputChange("category", val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите категорию" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sneakers">Кроссовки</SelectItem>
                        <SelectItem value="t-shirts">Футболки</SelectItem>
                        <SelectItem value="pants">Брюки</SelectItem>
                        <SelectItem value="jackets">Куртки</SelectItem>
                        <SelectItem value="accessories">Аксессуары</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Пол
                    </label>
                    <Select
                      value={formData.gender}
                      onValueChange={(val) => handleInputChange("gender", val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите пол" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Мужской</SelectItem>
                        <SelectItem value="female">Женский</SelectItem>
                        <SelectItem value="unisex">Унисекс</SelectItem>
                        <SelectItem value="kids">Детский</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Бренд
                  </label>
                  <Input
                    placeholder="Например: Nike"
                    value={formData.brand}
                    onChange={(e) => handleInputChange("brand", e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Описание
                  </label>
                  <Textarea
                    rows={4}
                    placeholder="Подробное описание товара..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">
                  Изображения товара
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative group aspect-square">
                      <img
                        src={img.url}
                        alt="товар"
                        className="w-full h-full object-cover rounded-lg border"
                      />
                      <button
                        onClick={() => removeImage(idx)}
                        className="absolute top-2 right-2 bg-white text-gray-700 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-gray-100"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      {idx === 0 && (
                        <span className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                          Главное
                        </span>
                      )}
                    </div>
                  ))}
                  <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Загрузить фото</span>
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Первое изображение будет главным. Рекомендуемый размер: 1000x1000px
                </p>
              </CardContent>
            </Card>

            {/* Colors */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">
                  Доступные цвета
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color.hex}
                      onClick={() => toggleColor(color)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                        selectedColors.find((c) => c.hex === color.hex)
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div
                        className="h-5 w-5 rounded-full border"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-sm">{color.name}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Variants */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center justify-between">
                  Варианты товара
                  <Button
                    size="sm"
                    onClick={addVariant}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Добавить
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {variants.length === 0 ? (
                  <p className="text-gray-500 text-center py-8 text-sm">
                    Нет вариантов. Нажмите "Добавить" для создания комбинаций размер/цвет
                  </p>
                ) : (
                  variants.map((variant, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-5 gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <Select
                        value={variant.size}
                        onValueChange={(val) => updateVariant(idx, "size", val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Размер" />
                        </SelectTrigger>
                        <SelectContent>
                          {SIZES.map((size) => (
                            <SelectItem key={size} value={size}>
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={variant.color}
                        onValueChange={(val) => updateVariant(idx, "color", val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Цвет" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedColors.map((color) => (
                            <SelectItem key={color.hex} value={color.name}>
                              {color.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Склад"
                        type="number"
                        value={variant.stock}
                        onChange={(e) => updateVariant(idx, "stock", e.target.value)}
                      />
                      <Input
                        placeholder="SKU"
                        value={variant.sku}
                        onChange={(e) => updateVariant(idx, "sku", e.target.value)}
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeVariant(idx)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Цена</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Цена *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      ₽
                    </span>
                    <Input
                      placeholder="0.00"
                      type="number"
                      className="pl-8"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Старая цена
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      ₽
                    </span>
                    <Input
                      placeholder="0.00"
                      type="number"
                      className="pl-8"
                      value={formData.comparePrice}
                      onChange={(e) => handleInputChange("comparePrice", e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5">
                    Для отображения скидки
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Inventory */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Склад</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Артикул (SKU)
                  </label>
                  <Input
                    placeholder="PROD-001"
                    value={formData.sku}
                    onChange={(e) => handleInputChange("sku", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Штрихкод
                  </label>
                  <Input
                    placeholder="123456789"
                    value={formData.barcode}
                    onChange={(e) => handleInputChange("barcode", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Количество
                  </label>
                  <Input
                    placeholder="0"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => handleInputChange("stock", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Shipping */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Доставка</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Вес (кг)
                  </label>
                  <Input
                    placeholder="0.5"
                    type="number"
                    step="0.01"
                    value={formData.weight}
                    onChange={(e) => handleInputChange("weight", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Organization */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">
                  Дополнительно
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Статус
                  </label>
                  <Select
                    value={formData.status}
                    onValueChange={(val) => handleInputChange("status", val)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Активный</SelectItem>
                      <SelectItem value="draft">Черновик</SelectItem>
                      <SelectItem value="archived">Архивный</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Теги
                  </label>
                  <Input
                    placeholder="лето, распродажа, новинка"
                    value={formData.tags}
                    onChange={(e) => handleInputChange("tags", e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1.5">
                    Разделяйте запятыми
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Дата выпуска
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? date.toLocaleDateString("ru-RU") : "Выберите дату"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6 pb-8">
          <Button variant="outline" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            Сохранить черновик
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <>Сохранение...</>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Опубликовать товар
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;