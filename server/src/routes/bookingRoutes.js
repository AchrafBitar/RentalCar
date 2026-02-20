const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// POST /api/bookings — Create a new booking (with anti-double-booking protection)
router.post('/', (req, res) => bookingController.createBooking(req, res));

// PATCH /api/bookings/:id/confirm — Confirm a pending booking
router.patch('/:id/confirm', (req, res) => bookingController.confirmBooking(req, res));

// PATCH /api/bookings/:id/cancel — Cancel a booking
router.patch('/:id/cancel', (req, res) => bookingController.cancelBooking(req, res));

module.exports = router;
