const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/', (req, res) => bookingController.createBooking(req, res));

module.exports = router;
