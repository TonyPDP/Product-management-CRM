// server.js
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: "https://sparkling-lebkuchen-b1967a.netlify.app", // ✅ Fixed: removed trailing slash
    credentials: true,
  })
);
app.use(express.json());

// ============= HARDCODED AUTHORIZED USERS =============
const AUTHORIZED_USERS = [
  {
    id: 1,
    email: "admin@crm.com",
    password: "admin123",
    name: "Administrator",
  },
  { id: 2, email: "user1@crm.com", password: "user123", name: "User One" },
  { id: 3, email: "user2@crm.com", password: "user456", name: "User Two" },
  { id: 4, email: "manager@crm.com", password: "manager789", name: "Manager" },
  { id: 5, email: "sales@crm.com", password: "sales2024", name: "Sales Team" },
];

// In-memory storage for products (each user has their own products)
// Structure: { userId: [products...] }
const productsStore = {};

// ============= MIDDLEWARE =============

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log("Auth Header:", authHeader); // Debug log
  console.log("Token:", token); // Debug log
  console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET); // Debug log

  if (!token) {
    return res.status(401).json({ error: "Доступ запрещен" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("JWT Verification Error:", err.message); // Debug log
      return res
        .status(403)
        .json({ error: "Неверный токен", details: err.message });
    }
    req.user = user;
    next();
  });
};

// ============= AUTH ROUTES =============

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user in authorized list
    const user = AUTHORIZED_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return res.status(401).json({ error: "Неверный email или пароль" });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      user: { id: user.id, email: user.email, name: user.name },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Get current user
app.get("/api/auth/me", authenticateToken, async (req, res) => {
  try {
    const user = AUTHORIZED_USERS.find((u) => u.id === req.user.userId);

    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// ============= PRODUCTS ROUTES (Protected) =============

// Helper function to get user's products
const getUserProducts = (userId) => {
  if (!productsStore[userId]) {
    productsStore[userId] = [];
  }
  return productsStore[userId];
};

// Get all products for current user
app.get("/api/products", authenticateToken, (req, res) => {
  try {
    const products = getUserProducts(req.user.userId);
    res.json(products);
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Get single product
app.get("/api/products/:id", authenticateToken, (req, res) => {
  try {
    const products = getUserProducts(req.user.userId);
    const product = products.find((p) => p.id === req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Товар не найден" });
    }

    res.json(product);
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Create product
app.post("/api/products", authenticateToken, (req, res) => {
  try {
    const {
      name,
      sku,
      barcode,
      category,
      brand,
      price,
      stock,
      color,
      size,
      image,
    } = req.body;

    // Calculate status
    let status = "В наличии";
    if (stock === 0) status = "Нет в наличии";
    else if (stock < 15) status = "Мало на складе";

    // Generate ID
    const id = `PROD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const newProduct = {
      id,
      name,
      sku,
      barcode,
      category,
      brand,
      price: parseFloat(price),
      stock: parseInt(stock),
      color,
      size,
      status,
      image,
      lastRestocked: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const products = getUserProducts(req.user.userId);
    products.push(newProduct);
    productsStore[req.user.userId] = products;

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Update product
app.put("/api/products/:id", authenticateToken, (req, res) => {
  try {
    const {
      name,
      sku,
      barcode,
      category,
      brand,
      price,
      stock,
      color,
      size,
      image,
    } = req.body;

    // Calculate status
    let status = "В наличии";
    if (stock === 0) status = "Нет в наличии";
    else if (stock < 15) status = "Мало на складе";

    const products = getUserProducts(req.user.userId);
    const productIndex = products.findIndex((p) => p.id === req.params.id);

    if (productIndex === -1) {
      return res.status(404).json({ error: "Товар не найден" });
    }

    const updatedProduct = {
      ...products[productIndex],
      name,
      sku,
      barcode,
      category,
      brand,
      price: parseFloat(price),
      stock: parseInt(stock),
      color,
      size,
      status,
      image,
      lastRestocked: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString(),
    };

    products[productIndex] = updatedProduct;
    productsStore[req.user.userId] = products;

    res.json(updatedProduct);
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Delete product
app.delete("/api/products/:id", authenticateToken, (req, res) => {
  try {
    const products = getUserProducts(req.user.userId);
    const productIndex = products.findIndex((p) => p.id === req.params.id);

    if (productIndex === -1) {
      return res.status(404).json({ error: "Товар не найден" });
    }

    products.splice(productIndex, 1);
    productsStore[req.user.userId] = products;

    res.json({ message: "Товар успешно удален" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Bulk delete products
app.post("/api/products/bulk-delete", authenticateToken, (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids)) {
      return res.status(400).json({ error: "IDs должны быть массивом" });
    }

    const products = getUserProducts(req.user.userId);
    const filteredProducts = products.filter((p) => !ids.includes(p.id));
    productsStore[req.user.userId] = filteredProducts;

    res.json({ message: "Товары успешно удалены", deletedCount: ids.length });
  } catch (error) {
    console.error("Bulk delete error:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Get statistics
app.get("/api/statistics", authenticateToken, (req, res) => {
  try {
    const products = getUserProducts(req.user.userId);

    const stats = {
      total_products: products.length,
      total_value: products
        .reduce((sum, p) => sum + p.price * p.stock, 0)
        .toFixed(2),
      low_stock: products.filter((p) => p.status === "Мало на складе").length,
      out_of_stock: products.filter((p) => p.status === "Нет в наличии").length,
    };

    res.json(stats);
  } catch (error) {
    console.error("Statistics error:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// ============= SERVER START =============

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   🚀 Server running successfully!     ║
╠════════════════════════════════════════╣
║   📡 URL: http://localhost:${PORT}      ║
║   🔐 Auth: JWT Token                  ║
║   👥 Users: 5 authorized accounts     ║
╠════════════════════════════════════════╣
║   Authorized Accounts:                ║
║   📧 admin@crm.com / admin123         ║
║   📧 user1@crm.com / user123          ║
║   📧 user2@crm.com / user456          ║
║   📧 manager@crm.com / manager789     ║
║   📧 sales@crm.com / sales2024        ║
╚════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
  });
});