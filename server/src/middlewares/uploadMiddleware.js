const multer = require('multer');

// Configure memory storage
const storage = multer.memoryStorage();

// File filter (JPG, PNG, PDF only)
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Seuls les formats JPG, PNG et PDF sont acceptés.'), false);
    }
};

// Multer upload config
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB per file
    }
});

// Middleware for parsing the specific fields
const uploadMiddleware = upload.fields([
    { name: 'permis', maxCount: 1 },
    { name: 'cin', maxCount: 1 }
]);

// Wrapper to catch Multer errors (like file size limit)
const handleUpload = (req, res, next) => {
    uploadMiddleware(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ success: false, error: 'FILE_TOO_LARGE', message: 'La taille du fichier ne doit pas dépasser 5 Mo.' });
            }
            return res.status(400).json({ success: false, error: 'UPLOAD_ERROR', message: err.message });
        } else if (err) {
            return res.status(400).json({ success: false, error: 'INVALID_FILE_TYPE', message: err.message });
        }
        next();
    });
};

module.exports = handleUpload;
