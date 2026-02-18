const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');

router.get('/', (req, res) => carController.getAllCars(req, res));
router.get('/:id', (req, res) => carController.getCarById(req, res));

module.exports = router;
