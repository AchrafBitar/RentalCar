const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// GET /api/admin/calendar — Fetch calendar events + car data for admin dashboard
router.get('/calendar', (req, res) => adminController.getCalendarEvents(req, res));

// PUT /api/admin/cars/:id/maintenance — Toggle maintenance mode for a car
router.put('/cars/:id/maintenance', (req, res) => adminController.toggleMaintenance(req, res));

module.exports = router;
