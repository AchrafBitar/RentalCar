const carService = require('../services/carService');

class CarController {
    async getAllCars(req, res) {
        try {
            const cars = await carService.getAllCars();
            res.json(cars);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getCarById(req, res) {
        try {
            const car = await carService.getCarById(req.params.id);
            res.json(car);
        } catch (error) {
            if (error.message === 'Car not found') {
                res.status(404).json({ error: error.message });
            } else {
                res.status(500).json({ error: error.message });
            }
        }
    }

    async getCarAvailability(req, res) {
        try {
            const data = await carService.getCarAvailability(req.params.id);
            res.json(data);
        } catch (error) {
            if (error.message === 'Car not found') {
                res.status(404).json({ error: error.message });
            } else {
                res.status(500).json({ error: error.message });
            }
        }
    }
}

module.exports = new CarController();
