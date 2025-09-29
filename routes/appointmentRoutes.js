const express = require('express');
const multer = require('multer');
const path = require('path');
const { createAppointment } = require('../controllers/appointmentController');

const router = express.Router();

// Configure multer for file storage in the 'uploads' directory
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

// Define the POST endpoint for scheduling.
// 'upload.single('image')' middleware will process an uploaded file with the field name 'image'.
router.post('/schedule', upload.single('image'), createAppointment);

module.exports = router;