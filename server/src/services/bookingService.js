const bookingRepository = require('../repositories/bookingRepository');
const carRepository = require('../repositories/carRepository');

class BookingService {
    async createBooking(data) {
        // Check if car exists
        const car = await carRepository.findById(data.carId);
        if (!car) {
            throw new Error('Car not found');
        }
        // Check availability logic (omitted for MVP simplicity or can be added)
        // For now just create
        return await bookingRepository.create(data);
    }
}

module.exports = new BookingService();
