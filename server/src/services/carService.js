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
}

module.exports = new CarService();
