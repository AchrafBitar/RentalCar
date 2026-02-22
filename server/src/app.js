const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authMiddleware = require('./middleware/authMiddleware');
const tenantMiddleware = require('./middlewares/tenantMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded files as static
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Public routes (Multi-Tenant Context required)
app.use('/api/tenant', require('./routes/tenantRoutes'));
app.use('/api/cars', tenantMiddleware, require('./routes/carRoutes'));
app.use('/api/bookings', tenantMiddleware, require('./routes/bookingRoutes'));

// Standalone public routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/uploads', require('./routes/uploadRoutes'));

// Protected admin routes
app.use('/api/admin', authMiddleware, require('./routes/adminRoutes'));

app.get('/', (req, res) => {
    res.send('Rental Car API is running');
});

module.exports = app;
