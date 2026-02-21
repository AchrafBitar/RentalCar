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
     * Get a car's availability data: car info + unavailable date ranges.
     */
    async getCarAvailability(id) {
        const car = await carRepository.findByIdWithAvailability(id);
        if (!car) {
            throw new Error('Car not found');
        }

        const unavailableDates = [
            ...car.bookings.map(b => ({
                id: b.id,
                start: b.startDate,
                end: b.endDate,
                type: 'booking',
                status: b.status,
            })),
            ...car.blockedDates.map(bd => ({
                id: bd.id,
                start: bd.startDate,
                end: bd.endDate,
                type: 'blocked',
                reason: bd.reason,
            })),
        ];

        return {
            car: {
                id: car.id,
                model: car.model,
                image: car.image,
                pricePerDay: car.pricePerDay,
                status: car.status,
                company: car.company,
            },
            unavailableDates,
        };
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
