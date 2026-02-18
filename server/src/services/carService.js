const carRepository = require('../repositories/carRepository');

class CarService {
    async getAllCars() {
        return await carRepository.findAll();
    }

    async getCarById(id) {
        const car = await carRepository.findById(id);
        if (!car) {
            throw new Error('Car not found');
        }
        return car;
    }

    async createCar(data) {
        // Validate data logic here
        return await carRepository.create(data);
    }
}

module.exports = new CarService();
