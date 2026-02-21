const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// ─── Calendar ─────────────────────────────────────────────────────────
router.get('/calendar', (req, res) => adminController.getCalendarEvents(req, res));

// ─── Cars CRUD ────────────────────────────────────────────────────────
router.get('/cars', (req, res) => adminController.getAllCars(req, res));
router.post('/cars', (req, res) => adminController.createCar(req, res));
router.put('/cars/:id', (req, res) => adminController.updateCar(req, res));
router.delete('/cars/:id', (req, res) => adminController.deleteCar(req, res));
router.put('/cars/:id/maintenance', (req, res) => adminController.toggleMaintenance(req, res));

// ─── Bookings CRUD ───────────────────────────────────────────────────
router.get('/bookings', (req, res) => adminController.getAllBookings(req, res));
router.post('/bookings', (req, res) => adminController.createBooking(req, res));
router.patch('/bookings/:id/confirm', (req, res) => adminController.confirmBooking(req, res));
router.patch('/bookings/:id/cancel', (req, res) => adminController.cancelBooking(req, res));
router.delete('/bookings/:id', (req, res) => adminController.deleteBooking(req, res));

module.exports = router;
