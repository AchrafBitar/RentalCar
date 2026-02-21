const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uploadController = require('../controllers/uploadController');

// Multer storage — saves to server/uploads/{reservationId}/
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../../uploads', req.params.reservationId);
        fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const prefix = file.fieldname; // 'permis' or 'cin'
        cb(null, `${prefix}_${Date.now()}${ext}`);
    },
});

// File filter — images and PDFs only, max 5MB
const fileFilter = (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Format non supporté. Utilisez JPG, PNG, WebP ou PDF.'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// POST /api/uploads/:reservationId
router.post(
    '/:reservationId',
    upload.fields([
        { name: 'permis', maxCount: 1 },
        { name: 'cin', maxCount: 1 },
    ]),
    uploadController.uploadDocuments
);

module.exports = router;
