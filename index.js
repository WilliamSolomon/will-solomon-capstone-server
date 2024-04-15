const express = require('express');
const app = express();
require("dotenv").config();
const cron = require('node-cron');
const { exec } = require('child_process');


const PORT = process.env.PORT || 5050;

const apiRoutes = require('./routes/api-routes');

// Enable CORS
const cors = require("cors")
app.use(cors());

// Middleware
app.use(express.json());

// Serve static files from the /assets/images folder
app.use("/images", express.static("images"));

// API routes
app.use('/api', apiRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);

    // Schedule a cron job to run cleanupExpiredAlerts.js every night at midnight (00:00)
    cron.schedule('0 0 * * *', () => {
        console.log('Running cleanupExpiredAlerts.js...');

        // Execute the cleanupExpiredAlerts.js script
        const child = exec('node cleanupExpiredAlerts.js');

        child.stdout.on('data', (data) => {
            console.log(data);
        });

        child.stderr.on('data', (data) => {
            console.error(data);
        });

        child.on('close', (code) => {
            console.log(`cleanupExpiredAlerts.js process exited with code ${code}`);
        });
    });
});
