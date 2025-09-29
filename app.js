const express = require('express');
const path = require('path');
const appointmentRoutes = require('./routes/appointmentRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Use the appointment routes for any requests to /api
app.use('/api', appointmentRoutes);

// Simple welcome route for the root
app.get('/', (req, res) => {
    res.send('AI Appointment Scheduler is running. Please use the /api/schedule endpoint.');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});