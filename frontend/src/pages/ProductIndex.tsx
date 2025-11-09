// Copy this code to replace your warehouse/product display component

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Search,
  Download,
  Trash2,
  Edit2,
  Package,
  AlertCircle,
  TrendingUp,
  ShoppingBag,
  X,
  Save,
  RefreshCw,
} from "lucide-react";

const API_URL = "http://localhost:3001/api";

const ProductWarehouse = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total_products: 0,
    total_value: 0,
    low_stock: 0,
    out_of_stock: 0,
  });

  const getToken = () => {
    return localStorage.getItem("token");
  };

  useEffect(() => {
    loadProducts();
    loadStats();

    const handleProductAdded = () => {
      loadProducts();
      loadStats();
    };

    window.addEventListener("productAdded", handleProductAdded);

    return () => {
      window.removeEventListener("productAdded", handleProductAdded);
    };
  }, []);

  const loadProducts = async () => {
    const token = getToken();
    if (!token) {
      console.log("No token found");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  const loadStats = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/statistics`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  useEffect(() => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.barcode.includes(searchQuery)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }

    setFilteredProducts(filtered);
  }, [searchQuery, statusFilter, categoryFilter, products]);

  const deleteProduct = async (productId) => {
    if (!confirm("Удалить этот товар?")) return;

    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setProducts(products.filter((p) => p.id !== productId));
        loadStats();
        alert("Товар успешно удален");
      }
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Ошибка при удалении товара");
    }
  };

  const startEdit = (product) => {
    setEditingProduct(product);
    setEditForm({ ...product });
  };

  const saveEdit = async () => {
    const token = getToken();
    if (!token) return;

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/products/${editForm.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      const updatedProduct = await response.json();
      setProducts(
        products.map((p) => (p.id === editForm.id ? updatedProduct : p))
      );
      setEditingProduct(null);
      setEditForm({});
      loadStats();
      alert("Товар успешно обновлен");
    } catch (error) {
      console.error("Error updating:", error);
      alert("Ошибка при сохранении");
    } finally {
      setLoading(false);
    }
  };

  const bulkDelete = async () => {
    if (!confirm(`Удалить ${selectedProducts.length} товаров?`)) return;

    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/products/bulk-delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ids: selectedProducts }),
      });

      if (response.ok) {
        setProducts(products.filter((p) => !selectedProducts.includes(p.id)));
        setSelectedProducts([]);
        loadStats();
        alert("Товары успешно удалены");
      }
    } catch (error) {
      console.error("Error bulk deleting:", error);
      alert("Ошибка при удалении товаров");
    }
  };

  const exportData = () => {
    const csv = [
      ["ID", "Название", "SKU", "Категория", "Цена", "Остаток", "Статус"],
      ...filteredProducts.map((p) => [
        p.id,
        p.name,
        p.sku,
        p.category,
        p.price,
        p.stock,
        p.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `товары-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const getStatusBadge = (status) => {
    const styles = {
      "В наличии": "bg-green-100 text-green-700",
      "Мало на складе": "bg-yellow-100 text-yellow-700",
      "Нет в наличии": "bg-red-100 text-red-700",
    };
    return styles[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Склад</h1>
              <p className="text-sm text-gray-500 mt-1">Управление товарами</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  loadProducts();
                  loadStats();
                }}
                variant="outline"
                size="sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Обновить
              </Button>
              <Button onClick={exportData} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Экспорт
              </Button>
              {selectedProducts.length > 0 && (
                <Button onClick={bulkDelete} variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Удалить ({selectedProducts.length})
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Товаров</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.total_products}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Стоимость</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    ${stats.total_value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Мало</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.low_stock}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Нет</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.out_of_stock}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Поиск..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="В наличии">В наличии</SelectItem>
                  <SelectItem value="Мало на складе">Мало на складе</SelectItem>
                  <SelectItem value="Нет в наличии">Нет в наличии</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Категория" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все категории</SelectItem>
                  <SelectItem value="Кроссовки">Кроссовки</SelectItem>
                  <SelectItem value="Футболки">Футболки</SelectItem>
                  <SelectItem value="Штаны">Штаны</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product.id)}
                  onChange={() => {
                    if (selectedProducts.includes(product.id)) {
                      setSelectedProducts(
                        selectedProducts.filter((id) => id !== product.id)
                      );
                    } else {
                      setSelectedProducts([...selectedProducts, product.id]);
                    }
                  }}
                  className="absolute top-3 left-3 h-5 w-5 rounded"
                />
                <span
                  className={`absolute top-3 right-3 px-2 py-1 text-xs font-medium rounded ${getStatusBadge(
                    product.status
                  )}`}
                >
                  {product.status}
                </span>
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium text-gray-900 mb-1 truncate">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  {product.color} • {product.size}
                </p>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">SKU:</span>
                    <span className="font-medium">{product.sku}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Остаток:</span>
                    <span
                      className={`font-semibold ${
                        product.stock === 0
                          ? "text-red-600"
                          : product.stock < 15
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {product.stock} шт
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Цена:</span>
                    <span className="font-semibold text-gray-900">
                      ${product.price}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => startEdit(product)}
                    size="sm"
                    className="flex-1"
                    variant="outline"
                  >
                    <Edit2 className="h-3 w-3 mr-1" />
                    Изменить
                  </Button>
                  <Button
                    onClick={() => deleteProduct(product.id)}
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Товары не найдены</p>
            </CardContent>
          </Card>
        )}
      </div>

      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="border-b p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Редактирование товара</h2>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setEditForm({});
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <img
                    src={editForm.image}
                    alt=""
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Название товара
                  </label>
                  <Input
                    value={editForm.name || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SKU
                  </label>
                  <Input
                    value={editForm.sku || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, sku: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Штрихкод
                  </label>
                  <Input
                    value={editForm.barcode || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, barcode: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Категория
                  </label>
                  <Select
                    value={editForm.category || ""}
                    onValueChange={(value) =>
                      setEditForm({ ...editForm, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Кроссовки">Кроссовки</SelectItem>
                      <SelectItem value="Футболки">Футболки</SelectItem>
                      <SelectItem value="Штаны">Штаны</SelectItem>
                      <SelectItem value="Куртки">Куртки</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Бренд
                  </label>
                  <Input
                    value={editForm.brand || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, brand: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Цвет
                  </label>
                  <Input
                    value={editForm.color || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, color: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Размер
                  </label>
                  <Input
                    value={editForm.size || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, size: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Цена ($)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editForm.price || ""}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        price: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Остаток (шт)
                  </label>
                  <Input
                    type="number"
                    value={editForm.stock || ""}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        stock: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ссылка на изображение
                  </label>
                  <Input
                    value={editForm.image || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, image: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={() => {
                    setEditingProduct(null);
                    setEditForm({});
                  }}
                  variant="outline"
                  className="flex-1"
                  disabled={loading}
                >
                  Отмена
                </Button>
                <Button
                  onClick={saveEdit}
                  className="flex-1"
                  disabled={loading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Сохранение..." : "Сохранить"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProductWarehouse;
