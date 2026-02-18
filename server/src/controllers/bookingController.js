const bookingService = require('../services/bookingService');

class BookingController {
    async createBooking(req, res) {
        try {
            const booking = await bookingService.createBooking(req.body);
            res.status(201).json(booking);
        } catch (error) {
            if (error.message === 'Car not found') {
                res.status(404).json({ error: error.message });
            } else {
                res.status(500).json({ error: error.message });
            }
        }
    }
}

module.exports = new BookingController();
