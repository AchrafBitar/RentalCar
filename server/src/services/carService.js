const carRepository = require('../repositories/carRepository');

class CarService {
    /**
     * Get all AVAILABLE cars (for client-facing list).
     * Cars in MAINTENANCE status are excluded.
     */
    async getAllCars() {
        return await carRepository.findAllAvailable();
    }

    /**
     * Get all cars including maintenance (for admin views).
     */
    async getAllCarsAdmin() {
        return await carRepository.findAll();
    }

    /**
     * Get a single car by ID.
     */
    async getCarById(id) {
        const car = await carRepository.findById(id);
        if (!car) {
            throw new Error('Car not found');
        }
        return car;
    }

    /**
     * Create a new car.
     */
    async createCar(data) {
        return await carRepository.create(data);
    }

    /**
     * Update a car's attributes.
     */
    async updateCar(id, data) {
        const car = await carRepository.findById(id);
        if (!car) {
            throw new Error('CAR_NOT_FOUND');
        }
        return await carRepository.update(id, data);
    }

    /**
     * Delete a car (cascades to bookings).
     */
    async deleteCar(id) {
        const car = await carRepository.findById(id);
        if (!car) {
            throw new Error('CAR_NOT_FOUND');
        }
        return await carRepository.delete(id);
    }
}

module.exports = new CarService();
