// Import necessary modules
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authorize = require('../middleware/authorize'); // Middleware for authorization
const knex = require('knex')(require('../knexfile')); // Database connection using knex

// Environment variables for weather APIs
const currentWeatherAPI_URL = process.env.currentWeatherAPI_URL
const forecastWeatherAPI_URL = process.env.forecastWeatherAPI_URL
const weatherAPI_Key = process.env.weatherAPI_Key

// Register a new user
const registerNewUser = async (req, res) => {
    let { first_name, last_name, email, password, city, latitude, longitude } = req.body;

    // Check for required fields
    if (!first_name || !last_name || !email || !password) {
        return res.status(400).send("Please enter the required fields.");
    }

    // Hash the password before storing
    password = bcrypt.hashSync(password, 10);

    try {
        // Insert new user into the database
        const newUser = await knex('user').insert({
            first_name, last_name, email, password, city, longitude, latitude
        });

        res.status(201).send("Registered successfully");
    } catch (error) {
        console.log(error);
        res.status(400).send("Failed registration");
    }
}

// Authenticate user login
const loginAuthenticate = async (req, res) => {
    const { email, password } = req.body;

    // Check for required fields
    if (!email || !password) {
        return res.status(400).send("Please enter the required fields");
    }

    try {
        // Retrieve user from the database
        const user = await knex('user').where('email', email).first();

        if (!user) {
            return res.status(400).send("Invalid Email");
        }

        // Compare provided password with stored hash
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).send("Invalid Password");
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user.id,
                first_name: user.first_name,
                email: user.email,
                city: user.city,
                coord: {
                    lon: user.longitude,
                    lat: user.latitude
                }
            },
            process.env.JWT_KEY,
            { expiresIn: '365d' }
        );

        res.json({ token });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
}

// Get current authenticated user
const getCurrentUser = async (req, res) => {
    try {
        // Retrieve user by ID from the token
        const user = await knex('user').where('id', req.user.id).first();

        if (!user) {
            return res.status(404).send("User not found");
        }

        res.json(user);
    } catch (error) {
        return res.status(500).send(`Unknown server error: ${error}`);
    }
}

// Get all users
const getAllUsers = async (req, res) => {
    try {
        // Retrieve all users
        const userData = await knex("user");
        res.status(200).json(userData);
    } catch (error) {
        res.status(500).json({ message: "Unable to retrieve users data" });
    }
}

// Get current weather data
const getCurrentWeather = async (req, res) => {
    try {
        const { lat, lon } = req.query;
        const response = await fetch(`${currentWeatherAPI_URL}/weather?lat=${lat}&lon=${lon}&appid=${weatherAPI_Key}&units=imperial`);
        const weatherData = await response.json();
        res.json(weatherData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get weather forecast data
const getForecastWeather = async (req, res) => {
    try {
        const { lat, lon } = req.query;
        const response = await fetch(`${forecastWeatherAPI_URL}?lat=${lat}&lon=${lon}&exclude=hourly&appid=${weatherAPI_Key}&units=imperial`);
        const forecastData = await response.json();
        res.json(forecastData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get alerts for a specific user
const getAllUserAlerts = async (req, res) => {
    try {
        const userAlerts = await knex("alerts")
            .where({ user_id: req.params.id, status: "active" });

        res.status(200).json(userAlerts);
    } catch (err) {
        res.status(400).send(`Error retrieving user(${req.params.id}) alerts: ${err}`)
    }
}

// Add a new alert
const addAlert = async (req, res) => {
    try {
        const newAlert = req.body;

        // Generate a new unique ID and timestamp
        const newId = uuidv4();
        const createdAt = new Date().toISOString();

        const updatedAlert = {
            id: newId,
            created_at: createdAt,
            ...newAlert
        };

        // Read existing alerts from file
        let alertsData = JSON.parse(fs.readFileSync("./data/alert-details.json"));

        // Add new alert to the beginning of the array
        alertsData.unshift(updatedAlert);

        // Write updated alerts back to file
        fs.writeFileSync("./data/alert-details.json", JSON.stringify(alertsData, null, 2));

        res.status(201).json(updatedAlert);
    } catch (err) {
        res.status(400).send(`Error adding new alert: ${err}`);
    }
}

// Edit an existing alert
const editAlert = async (req, res) => {
    try {
        const alertId = req.params.id;
        const updatedAlertData = req.body;

        // Update alert in the database
        const affectedRows = await knex("alerts")
            .where({ id: alertId })
            .update({
                ...updatedAlertData,
                updated_at: knex.fn.now() // Update timestamp
            });

        if (affectedRows === 0) {
            return res.status(404).send("Alert not found");
        }

        // Retrieve updated alert
        const updatedAlert = await knex("alerts")
            .where({ id: alertId })
            .first();

        res.status(200).json(updatedAlert);
    } catch (err) {
        res.status(400).send(`Error editing alert: ${err}`);
    }
}

// Archive an existing alert
const archiveAlert = async (req, res) => {
    try {
        const alertId = req.params.id;

        // Update alert status to "archived"
        const affectedRows = await knex("alerts")
            .where({ id: alertId })
            .update({
                status: "archived"
            });

        if (affectedRows === 0) {
            return res.status(404).send("Alert not found");
        }

        // Retrieve updated alert
        const updatedAlert = await knex("alerts").where({ id: alertId }).first();

        res.status(200).json(updatedAlert);
    } catch (err) {
        res.status(400).send(`Error archiving alert: ${err}`);
    }
}

// Get user-specific alert settings
const getUserAlertSettings = async (req, res) => {
    try {
        const userId = req.params.id;

        // Retrieve alert settings for user
        const userSettings = await knex("settings")
            .where({ user_id: userId });

        res.status(200).json(userSettings);
    } catch (err) {
        res.status(400).send(`Error retrieving user(${req.params.id}) settings: ${err}`)
    }
}

// Add a new alert setting
const addAlertSetting = async (req, res) => {
    try {
        const { user_id, category, condition, status, specified_date, city } = req.body;

        // Insert new alert setting into the database
        const newSetting = await knex('settings').insert({
            user_id, category, condition, status, specified_date, city
        });

        res.status(201).json(newSetting);
    } catch (err) {
        res.status(400).send(`Error adding new alert setting: ${err}`);
    }
}

// Get a specific alert setting
const getAlertSetting = async (req, res) => {
    try {
        const settingId = req.params.id;

        // Retrieve alert setting by ID
        const userAlertSetting = await knex("settings").where({ id: settingId });

        if (userAlertSetting.length === 0) { // Corrected condition to check array length
            return res.status(404).send("Setting not found");
        }

        res.status(200).json(userAlertSetting);
    } catch (err) {
        res.status(400).send(`Error retrieving alert setting: ${err}`); // Corrected error message
    }
}

// Edit an existing alert setting
const editAlertSetting = async (req, res) => {
    try {
        const alertSettingId = req.params.id;
        const updatedSettingData = req.body;

        // Update alert setting in the database
        const affectedRows = await knex("settings")
            .where({ id: alertSettingId })
            .update({
                ...updatedSettingData
            });

        if (affectedRows === 0) {
            return res.status(404).send("Setting not found");
        }

        // Retrieve updated setting
        const updatedSetting = await knex("settings")
            .where({ id: alertSettingId })
            .first();

        res.status(200).json(updatedSetting);
    } catch (err) {
        res.status(400).send(`Error editing alert setting: ${err}`);
    }
}

// Remove an alert setting
const removeAlertSetting = async (req, res) => {
    try {
        const settingId = req.params.id;

        // Delete the alert setting from the database
        const deletedRows = await knex('settings')
            .where({ id: settingId })
            .del();

        if (deletedRows === 0) {
            return res.status(404).send("Alert setting not found");
        }

        res.status(200).send("Alert setting deleted successfully");
    } catch (err) {
        res.status(400).send(`Error deleting alert setting: ${err}`);
    }
}

// Export all functions for use in other files
module.exports = {
    registerNewUser,
    loginAuthenticate,
    getCurrentUser,
    getAllUsers,
    getCurrentWeather,
    getForecastWeather,
    getAllUserAlerts,
    addAlert,
    editAlert,
    archiveAlert,
    getUserAlertSettings,
    addAlertSetting,
    getAlertSetting,
    editAlertSetting,
    removeAlertSetting
};
