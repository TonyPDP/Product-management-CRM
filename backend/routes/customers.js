// ==========================================
// Customers Backend Endpoint
// Save as: backend/routes/customers.js
// ==========================================

const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// GET /api/customers
router.get('/customers', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // TODO: Replace with real database query when you have customer tracking
    // const customers = await getCustomersFromDB(userId);
    
    // For now, generate mock data
    const mockData = generateMockCustomers();
    
    res.json(mockData);
  } catch (error) {
    console.error('Customers error:', error);
    res.status(500).json({ error: 'Failed to fetch customers data' });
  }
});

// POST /api/customers - Add new customer
router.post('/customers', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, email, phone, city } = req.body;

    // TODO: Add to database
    // const newCustomer = await addCustomerToDB({ userId, firstName, lastName, email, phone, city });

    // For now, return mock response
    res.json({
      success: true,
      customer: {
        id: Date.now(),
        firstName,
        lastName,
        email,
        phone,
        city,
        totalSpent: 0,
        orders: 0,
        status: 'active',
        joinDate: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('Add customer error:', error);
    res.status(500).json({ error: 'Failed to add customer' });
  }
});

// PUT /api/customers/:id - Update customer
router.put('/customers/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // TODO: Update in database
    // await updateCustomerInDB(id, updates);

    res.json({ success: true, message: 'Customer updated successfully' });
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

// DELETE /api/customers/:id - Delete customer
router.delete('/customers/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // TODO: Delete from database
    // await deleteCustomerFromDB(id);

    res.json({ success: true, message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

// ========== HELPER FUNCTIONS ==========

function generateMockCustomers() {
  const firstNames = [
    'Александр', 'Дмитрий', 'Максим', 'Иван', 'Артем',
    'Елена', 'Мария', 'Анна', 'Ольга', 'Наталья',
    'Сергей', 'Андрей', 'Михаил', 'Екатерина', 'Татьяна'
  ];
  
  const lastNames = [
    'Иванов', 'Петров', 'Сидоров', 'Козлов', 'Новиков',
    'Морозов', 'Волков', 'Соловьев', 'Васильев', 'Зайцев'
  ];
  
  const cities = ['Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань', 'Нижний Новгород'];

  const customers = Array.from({ length: 15 }, (_, i) => {
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
      lastOrder: lastOrderDate.toISOString().split('T')[0],
      status: daysAgo < 30 ? 'active' : 'inactive',
      rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 - 5.0
      joinDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    };
  });

  // Sort by total spent
  customers.sort((a, b) => b.totalSpent - a.totalSpent);

  // Calculate stats
  const stats = {
    totalCustomers: customers.length,
    activeCustomers: customers.filter(c => c.status === 'active').length,
    totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
    avgOrderValue: customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.reduce((sum, c) => sum + c.orders, 0),
  };

  return { customers, stats };
}

// ========== DATABASE QUERIES (for when you're ready) ==========

// Example PostgreSQL queries for later use:
/*
async function getCustomersFromDB(userId) {
  const { pool } = require('../db');
  
  const query = `
    SELECT 
      c.id,
      c.first_name as "firstName",
      c.last_name as "lastName",
      c.email,
      c.phone,
      c.city,
      c.join_date as "joinDate",
      c.rating,
      COUNT(o.id) as orders,
      COALESCE(SUM(o.total_amount), 0) as "totalSpent",
      MAX(o.created_at) as "lastOrder",
      CASE 
        WHEN MAX(o.created_at) > NOW() - INTERVAL '30 days' THEN 'active'
        ELSE 'inactive'
      END as status
    FROM customers c
    LEFT JOIN orders o ON c.id = o.customer_id
    WHERE c.user_id = $1
    GROUP BY c.id, c.first_name, c.last_name, c.email, c.phone, c.city, c.join_date, c.rating
    ORDER BY "totalSpent" DESC
  `;
  
  const result = await pool.query(query, [userId]);
  
  const customers = result.rows.map(row => ({
    ...row,
    avgOrderValue: row.orders > 0 ? row.totalSpent / row.orders : 0,
    lastOrder: row.lastOrder ? row.lastOrder.toISOString().split('T')[0] : null,
  }));

  const stats = {
    totalCustomers: customers.length,
    activeCustomers: customers.filter(c => c.status === 'active').length,
    totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
    avgOrderValue: customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.reduce((sum, c) => sum + c.orders, 0),
  };

  return { customers, stats };
}

async function addCustomerToDB(customerData) {
  const { pool } = require('../db');
  
  const query = `
    INSERT INTO customers (user_id, first_name, last_name, email, phone, city, join_date)
    VALUES ($1, $2, $3, $4, $5, $6, NOW())
    RETURNING *
  `;
  
  const values = [
    customerData.userId,
    customerData.firstName,
    customerData.lastName,
    customerData.email,
    customerData.phone,
    customerData.city,
  ];
  
  const result = await pool.query(query, values);
  return result.rows[0];
}

async function updateCustomerInDB(customerId, updates) {
  const { pool } = require('../db');
  
  const fields = [];
  const values = [];
  let paramCount = 1;
  
  Object.entries(updates).forEach(([key, value]) => {
    fields.push(`${key} = $${paramCount}`);
    values.push(value);
    paramCount++;
  });
  
  values.push(customerId);
  
  const query = `
    UPDATE customers
    SET ${fields.join(', ')}
    WHERE id = $${paramCount}
    RETURNING *
  `;
  
  const result = await pool.query(query, values);
  return result.rows[0];
}

async function deleteCustomerFromDB(customerId) {
  const { pool } = require('../db');
  
  const query = 'DELETE FROM customers WHERE id = $1';
  await pool.query(query, [customerId]);
}
*/

module.exports = router;

// ==========================================
// USAGE:
// In your server.js/app.js:
// const customersRoutes = require('./routes/customers');
// app.use('/api', customersRoutes);
// ==========================================