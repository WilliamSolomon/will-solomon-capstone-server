const { generateAlerts } = require('./generateAlerts');
const fs = require('fs');
const knex = require('knex')(require('../knexfile'));

const currentWeatherAPI_URL = process.env.currentWeatherAPI_URL
const forecastWeatherAPI_URL = process.env.forecastWeatherAPI_URL
const weatherAPI_Key = process.env.weatherAPI_Key

const generateAlertsForAllUsers = async () => {
    try {
        // // Read user details from file
        // const userData = fs.readFileSync("./data/user-details.json");
        // const users = JSON.parse(userData);

        // Retrieve user details from the 'users' table using Knex
        const users = await knex.select('id', 'latitude', 'longitude').from('user');

        console.log("User Information", users);

        // Iterate over each user
        for (const user of users) {
            // const { id, coord: { lat, lon } } = user;
            // // Call generateAlerts function for each user
            // await generateAlerts(id, lat, lon);

            console.log(`Working on user ${user.id}`);

            const { id, latitude, longitude } = user;
            // Call generateAlerts function for each user
            await generateAlerts(id, latitude, longitude);

        }
        console.log("Alert generation for all users completed.");
    } catch (error) {
        console.error(`Error generating alerts for all users: ${error}`);
    }
}

// // Call the function to generate alerts for all users
// generateAlertsForAllUsers();

module.exports = generateAlertsForAllUsers;
