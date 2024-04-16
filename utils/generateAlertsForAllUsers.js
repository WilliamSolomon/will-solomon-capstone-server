const { generateAlerts } = require('./generateAlerts');
const fs = require('fs');

const currentWeatherAPI_URL = process.env.currentWeatherAPI_URL
const forecastWeatherAPI_URL = process.env.forecastWeatherAPI_URL
const weatherAPI_Key = process.env.weatherAPI_Key

const generateAlertsForAllUsers = async () => {
    try {
        // Read user details from file
        const userData = fs.readFileSync("./data/user-details.json");
        const users = JSON.parse(userData);

        // Iterate over each user
        for (const user of users) {
            const { id, coord: { lat, lon } } = user;
            // Call generateAlerts function for each user
            await generateAlerts(id, lat, lon);
        }
        console.log("Alert generation for all users completed.");
    } catch (error) {
        console.error(`Error generating alerts for all users: ${error}`);
    }
}

// // Call the function to generate alerts for all users
// generateAlertsForAllUsers();

module.exports = generateAlertsForAllUsers;
