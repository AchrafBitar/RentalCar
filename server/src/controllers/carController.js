const carService = require('../services/carService');

class CarController {
    async getAllCars(req, res) {
        try {
            const tenantId = req.tenantId || (req.admin && req.admin.companyId);
            const cars = await carService.getAllCars(tenantId);
            res.json(cars);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getCarById(req, res) {
        try {
            const tenantId = req.tenantId || (req.admin && req.admin.companyId);
            const car = await carService.getCarById(req.params.id, tenantId);
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
            const tenantId = req.tenantId || (req.admin && req.admin.companyId);
            const data = await carService.getCarAvailability(req.params.id, tenantId);
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
