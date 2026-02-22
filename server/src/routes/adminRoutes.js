const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// ─── Calendar ─────────────────────────────────────────────────────────
router.get('/calendar', (req, res) => adminController.getCalendarEvents(req, res));

// ─── Cars CRUD ────────────────────────────────────────────────────────
router.get('/cars', (req, res) => adminController.getAllCars(req, res));
router.post('/cars', (req, res) => adminController.createCar(req, res));
router.put('/cars/:id', (req, res) => adminController.updateCar(req, res));
router.delete('/cars/:id', (req, res) => adminController.deleteCar(req, res));
router.put('/cars/:id/maintenance', (req, res) => adminController.toggleMaintenance(req, res));

// ─── Car Image Upload ──────────────────────────────────────────────────
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const carImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../../uploads/cars');
        fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `car_${Date.now()}${ext}`);
    },
});
const carImageUpload = multer({
    storage: carImageStorage,
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp'];
        cb(null, allowed.includes(file.mimetype));
    },
    limits: { fileSize: 5 * 1024 * 1024 },
});
router.post('/upload-car-image', carImageUpload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, message: 'No image uploaded.' });
    const imageUrl = `/uploads/cars/${req.file.filename}`;
    res.json({ success: true, imageUrl });
});

// ─── Bookings CRUD ───────────────────────────────────────────────────
router.get('/bookings', (req, res) => adminController.getAllBookings(req, res));
router.post('/bookings', (req, res) => adminController.createBooking(req, res));
router.patch('/bookings/:id/confirm', (req, res) => adminController.confirmBooking(req, res));
router.patch('/bookings/:id/cancel', (req, res) => adminController.cancelBooking(req, res));
router.delete('/bookings/:id', (req, res) => adminController.deleteBooking(req, res));

// ─── Blocked Dates ───────────────────────────────────────────────────
router.get('/cars/:id/blocked-dates', (req, res) => adminController.getBlockedDates(req, res));
router.post('/cars/:id/blocked-dates', (req, res) => adminController.createBlockedDate(req, res));
router.delete('/blocked-dates/:id', (req, res) => adminController.deleteBlockedDate(req, res));

module.exports = router;
