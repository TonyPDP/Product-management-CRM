// ==========================================
// Backend Analytics Endpoint
// Add this to your Express backend
// ==========================================

// In your routes file (e.g., routes/analytics.js)
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth'); // Your auth middleware

// GET /api/analytics?range=daily|weekly|monthly
router.get('/analytics', authenticateToken, async (req, res) => {
  try {
    const { range = 'weekly' } = req.query;
    const userId = req.user.id; // From your auth middleware

    // Calculate date ranges
    const now = new Date();
    let startDate;
    let groupBy;

    switch (range) {
      case 'daily':
        // Last 24 hours, grouped by hour
        startDate = new Date(now - 24 * 60 * 60 * 1000);
        groupBy = 'hour';
        break;
      case 'weekly':
        // Last 7 days, grouped by day
        startDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
        groupBy = 'day';
        break;
      case 'monthly':
        // Last 30 days, grouped by day
        startDate = new Date(now - 30 * 24 * 60 * 60 * 1000);
        groupBy = 'day';
        break;
      default:
        startDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
        groupBy = 'day';
    }

    // ========== SALES DATA QUERY ==========
    // This assumes you have an 'orders' or 'sales' table
    // Adjust the query based on your database structure
    
    const salesData = await getSalesDataByRange(userId, startDate, now, groupBy, range);
    
    // ========== STATISTICS ==========
    const stats = await getStatistics(userId, startDate, now);
    
    // ========== TOP PRODUCTS ==========
    const topProducts = await getTopProducts(userId, startDate, now);
    
    // ========== CATEGORY DATA ==========
    const categoryData = await getCategoryData(userId, startDate, now);

    res.json({
      salesData,
      stats,
      topProducts,
      categoryData,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics data' });
  }
});

// ========== HELPER FUNCTIONS ==========

// If using PostgreSQL with pg library:
async function getSalesDataByRange(userId, startDate, endDate, groupBy, range) {
  const { pool } = require('../db'); // Your database connection
  
  let query, values;

  if (range === 'daily') {
    // Group by hour for last 24 hours
    query = `
      SELECT 
        EXTRACT(HOUR FROM created_at) as hour,
        COUNT(*) as orders,
        SUM(total_amount) as revenue,
        SUM(quantity) as sales
      FROM orders
      WHERE user_id = $1 
        AND created_at >= $2 
        AND created_at <= $3
      GROUP BY EXTRACT(HOUR FROM created_at)
      ORDER BY hour
    `;
    
    const result = await pool.query(query, [userId, startDate, endDate]);
    
    // Format for frontend (0:00 - 23:00)
    return Array.from({ length: 24 }, (_, i) => {
      const hourData = result.rows.find(row => parseInt(row.hour) === i);
      return {
        name: `${i}:00`,
        orders: hourData ? parseInt(hourData.orders) : 0,
        revenue: hourData ? parseFloat(hourData.revenue) : 0,
        sales: hourData ? parseInt(hourData.sales) : 0,
      };
    });
  } else if (range === 'weekly') {
    // Group by day for last 7 days
    query = `
      SELECT 
        TO_CHAR(created_at, 'Dy') as day,
        EXTRACT(DOW FROM created_at) as day_num,
        COUNT(*) as orders,
        SUM(total_amount) as revenue,
        SUM(quantity) as sales
      FROM orders
      WHERE user_id = $1 
        AND created_at >= $2 
        AND created_at <= $3
      GROUP BY TO_CHAR(created_at, 'Dy'), EXTRACT(DOW FROM created_at)
      ORDER BY day_num
    `;
    
    const result = await pool.query(query, [userId, startDate, endDate]);
    const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    
    return Array.from({ length: 7 }, (_, i) => {
      const dayData = result.rows.find(row => parseInt(row.day_num) === i);
      return {
        name: days[i],
        orders: dayData ? parseInt(dayData.orders) : 0,
        revenue: dayData ? parseFloat(dayData.revenue) : 0,
        sales: dayData ? parseInt(dayData.sales) : 0,
      };
    });
  } else {
    // Group by day for last 30 days
    query = `
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as orders,
        SUM(total_amount) as revenue,
        SUM(quantity) as sales
      FROM orders
      WHERE user_id = $1 
        AND created_at >= $2 
        AND created_at <= $3
      GROUP BY DATE(created_at)
      ORDER BY date
    `;
    
    const result = await pool.query(query, [userId, startDate, endDate]);
    
    return Array.from({ length: 30 }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const dayData = result.rows.find(row => row.date === dateStr);
      
      return {
        name: `${date.getDate()}/${date.getMonth() + 1}`,
        orders: dayData ? parseInt(dayData.orders) : 0,
        revenue: dayData ? parseFloat(dayData.revenue) : 0,
        sales: dayData ? parseInt(dayData.sales) : 0,
      };
    });
  }
}

async function getStatistics(userId, startDate, endDate) {
  const { pool } = require('../db');
  
  // Current period stats
  const currentQuery = `
    SELECT 
      COUNT(*) as total_orders,
      SUM(total_amount) as total_revenue,
      SUM(quantity) as total_sales
    FROM orders
    WHERE user_id = $1 
      AND created_at >= $2 
      AND created_at <= $3
  `;
  
  const current = await pool.query(currentQuery, [userId, startDate, endDate]);
  
  // Previous period stats (for comparison)
  const periodLength = endDate - startDate;
  const prevStartDate = new Date(startDate - periodLength);
  const prevEndDate = startDate;
  
  const prevQuery = `
    SELECT 
      COUNT(*) as total_orders,
      SUM(total_amount) as total_revenue
    FROM orders
    WHERE user_id = $1 
      AND created_at >= $2 
      AND created_at <= $3
  `;
  
  const previous = await pool.query(prevQuery, [userId, prevStartDate, prevEndDate]);
  
  const currentRevenue = parseFloat(current.rows[0].total_revenue) || 0;
  const currentOrders = parseInt(current.rows[0].total_orders) || 0;
  const prevRevenue = parseFloat(previous.rows[0].total_revenue) || 1;
  const prevOrders = parseInt(previous.rows[0].total_orders) || 1;
  
  const revenueGrowth = ((currentRevenue - prevRevenue) / prevRevenue * 100).toFixed(1);
  const ordersGrowth = ((currentOrders - prevOrders) / prevOrders * 100).toFixed(1);
  
  return {
    totalRevenue: currentRevenue,
    totalOrders: currentOrders,
    avgOrderValue: currentOrders > 0 ? currentRevenue / currentOrders : 0,
    revenueGrowth: parseFloat(revenueGrowth),
    ordersGrowth: parseFloat(ordersGrowth),
  };
}

async function getTopProducts(userId, startDate, endDate) {
  const { pool } = require('../db');
  
  const query = `
    SELECT 
      p.name,
      COUNT(o.id) as sales,
      SUM(o.total_amount) as revenue,
      p.id
    FROM orders o
    JOIN products p ON o.product_id = p.id
    WHERE o.user_id = $1 
      AND o.created_at >= $2 
      AND o.created_at <= $3
    GROUP BY p.id, p.name
    ORDER BY sales DESC
    LIMIT 5
  `;
  
  const result = await pool.query(query, [userId, startDate, endDate]);
  
  const colors = ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6'];
  
  return result.rows.map((row, idx) => ({
    name: row.name,
    sales: parseInt(row.sales),
    revenue: parseFloat(row.revenue),
    color: colors[idx % colors.length],
  }));
}

async function getCategoryData(userId, startDate, endDate) {
  const { pool } = require('../db');
  
  const query = `
    SELECT 
      p.category as name,
      COUNT(o.id) as value,
      SUM(o.total_amount) as sales
    FROM orders o
    JOIN products p ON o.product_id = p.id
    WHERE o.user_id = $1 
      AND o.created_at >= $2 
      AND o.created_at <= $3
    GROUP BY p.category
    ORDER BY value DESC
  `;
  
  const result = await pool.query(query, [userId, startDate, endDate]);
  
  return result.rows.map(row => ({
    name: row.name,
    value: parseInt(row.value),
    sales: parseFloat(row.sales),
  }));
}

module.exports = router;

// ==========================================
// Don't forget to register this route in your main app file:
// const analyticsRoutes = require('./routes/analytics');
// app.use('/api', analyticsRoutes);
// ==========================================