const express = require('express');
const app = express();
require("dotenv").config();
const cron = require('node-cron');
const { exec } = require('child_process');

const generateAlertsForAllUsers = require('./utils/generateAlertsForAllUsers');
const { cleanupExpiredAlerts } = require('./utils/cleanupExpiredAlerts');

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
app.listen(PORT, async () => {
    console.log(`Server is running at http://localhost:${PORT}`);

    // Call generateAlertsForAllUsers function when the server starts
    await generateAlertsForAllUsers();
    await cleanupExpiredAlerts();

    // Hourly cron job to run generateAlertsForAllUsers()
    cron.schedule('0 * * * *', async () => {
        console.log('Running generateAlertsForAllUsers()...');

        try {
            // Call generateAlertsForAllUsers function
            await generateAlertsForAllUsers();
            console.log('generateAlertsForAllUsers() completed successfully.');
        } catch (error) {
            console.error('Error running generateAlertsForAllUsers():', error);
        }
    });

    cron.schedule('1 0 * * *', async () => {
        try {
            await cleanupExpiredAlerts();
        } catch (error) {
            console.error('Error running cleanupExpiredAlerts:', error);
        }
    }, {
        scheduled: true,
        timezone: 'America/New_York'
    });
});
