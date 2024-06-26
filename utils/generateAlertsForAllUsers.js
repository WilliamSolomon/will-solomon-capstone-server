const { generateAlerts } = require('./generateAlerts');
const fs = require('fs');
const knex = require('knex')(require('../knexfile'));

const currentWeatherAPI_URL = process.env.currentWeatherAPI_URL
const forecastWeatherAPI_URL = process.env.forecastWeatherAPI_URL
const weatherAPI_Key = process.env.weatherAPI_Key

const generateAlertsForAllUsers = async () => {
    try {

        // Retrieve user details from the 'users' table using Knex
        const users = await knex.select('id', 'latitude', 'longitude').from('user');

        // Iterate over each user
        for (const user of users) {

            const { id, latitude, longitude } = user;
            // Call generateAlerts function for each user
            await generateAlerts(id, latitude, longitude);

        }
        console.log("Alert generation for all users completed.");
    } catch (error) {
        console.error(`Error generating alerts for all users: ${error}`);
    }
}

module.exports = generateAlertsForAllUsers;
