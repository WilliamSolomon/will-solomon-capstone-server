const fs = require("fs");
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authorize = require('../middleware/authorize');
const knex = require('knex')(require('../knexfile'));


const currentWeatherAPI_URL = process.env.currentWeatherAPI_URL
const forecastWeatherAPI_URL = process.env.forecastWeatherAPI_URL
const weatherAPI_Key = process.env.weatherAPI_Key


const registerNewUser = async (req, res) => {
    let { first_name, last_name, email, password, city, latitude, longitude } = req.body;

    if (!first_name || !last_name || !email || !password) {
        return res.status(400).send("Please enter the required fields.");
    }

    password = bcrypt.hashSync(password, 10);

    try {

        const newUser = await knex('user')
            .insert({
                first_name, last_name, email, password, city, longitude, latitude
            })

        res.status(201).send("Registered successfully");
    } catch (error) {
        console.log(error);
        res.status(400).send("Failed registration");
    }

}

const loginAuthenticate = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send("Please enter the required fields");
    }

    try {
        const user = await knex('user').where('email', email).first();

        if (!user) {
            return res.status(400).send("Invalid Email");
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).send("Invalid Password");
        }

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


const getCurrentUser = async (req, res) => {
    try {

        const user = await knex('user').where('id', req.user.id).first();

        if (!user) {
            return res.status(404).send("User not found");
        }

        res.json(user);
    } catch (error) {
        return res.status(500).send(`Unknown server error: ${error}`);
    }
}

const getAllUsers = async (req, res) => {
    try {

        const userData = await knex("user")
            // .where({ user_id: req.params.id, status: "active" });

        res.status(200).json(userAlerts);

        res.json(userData);
    } catch (error) {
        res.status(500).json({ message: "Unable to retrieve users data" });
    }
}


const getCurrentWeather = async (req, res) => {
    try {
        const { lat, lon } = req.query;
        // const { userId } = req.params;
        const response = await fetch(`${currentWeatherAPI_URL}/weather?lat=${lat}&lon=${lon}&appid=${weatherAPI_Key}&units=imperial`);
        const weatherData = await response.json();
        res.json(weatherData);

        const currentWeatherData = {
            // user_id: userId,
            weather: weatherData
        };

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getForecastWeather = async (req, res) => {
    try {
        const { lat, lon } = req.query;
        // const { userId } = req.params;
        const response = await fetch(`${forecastWeatherAPI_URL}?lat=${lat}&lon=${lon}&exclude=hourly&appid=${weatherAPI_Key}&units=imperial`);
        const forecastData = await response.json();
        res.json(forecastData);

        const forecastWeatherData = {
            // user_id: userId,
            weather: forecastData
        };


    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};


// // Log weather fetches to file
// const logWeatherData = (weatherData) => {
//     try {
//         let weatherDetails = JSON.parse(fs.readFileSync("./data/weather-details.json"));
//         weatherDetails.unshift(weatherData);

//         // console.log("Weather Details", weatherDetails);

//         fs.writeFileSync("./data/weather-details.json", JSON.stringify(weatherDetails, null, 2));
//     } catch (error) {
//         console.error("Error logging weather data:", error);
//     }
// };


const getAllUserAlerts = async (req, res) => {
    try {

        const userAlerts = await knex("alerts")
            .where({ user_id: req.params.id, status: "active" });

        res.status(200).json(userAlerts);
    } catch (err) {
        res.status(400).send(`Error retrieving user(${req.params.id}) alerts: ${err}`)
    }
}


const addAlert = async (req, res) => {
    try {
        const newAlert = req.body;

        const newId = uuidv4();
        const createdAt = new Date().toISOString();

        const updatedAlert = {
            id: newId,
            created_at: createdAt,
            ...newAlert
        };

        let alertsData = JSON.parse(fs.readFileSync("./data/alert-details.json"));

        alertsData.unshift(updatedAlert);

        fs.writeFileSync("./data/alert-details.json", JSON.stringify(alertsData, null, 2)); // null for no transformation, 2 for formatting output

        res.status(201).json(updatedAlert);
    } catch (err) {
        res.status(400).send(`Error adding new alert: ${err}`);
    }
}

const editAlert = async (req, res) => {
    try {
        const alertId = req.params.id;
        const updatedAlertData = req.body;

        console.log("Alert ID", req.params.id);
        console.log("Updated Alert Data", updatedAlertData);

        const affectedRows = await knex("alerts")
            .where({ id: alertId })
            .update({
                ...updatedAlertData,
                updated_at: knex.fn.now() // Updates the field with current timestamp
            })

        if (affectedRows === 0) {
            return res.status(404).send("Alert not found");
        }

        const updatedAlert = await knex("alerts")
            .where({ id: alertId })
            .first();

        console.log("Updated Alert", updatedAlert);

        res.status(200).json(updatedAlert);
    } catch (err) {
        res.status(400).send(`Error editing alert: ${err}`);
    }
}


const archiveAlert = async (req, res) => {
    try {

        console.log("Found the right function");
        const alertId = req.params.id;


        // Update the alert status to "archived" in the database
        const affectedRows = await knex("alerts")
            .where({ id: alertId })
            .update({
                status: "archived"
            });

        if (affectedRows === 0) {
            return res.status(404).send("Alert not found");
        }

        // Fetch the updated alert from the database
        const updatedAlert = await knex("alerts").where({ id: alertId }).first();

        res.status(200).json(updatedAlert);
    } catch (err) {
        res.status(400).send(`Error editing alert: ${err}`);
    }
}


const getUserAlertSettings = async (req, res) => {
    try {
        const userId = req.params.id;

        const userSettings = await knex("settings")
            .where({ user_id: userId })

        res.status(200).json(userSettings);
    } catch (err) {
        res.status(400).send(`Error retrieving user(${req.params.id}) settings: ${err}`)
    }
}


const addAlertSetting = async (req, res) => {
    try {

        const { user_id, category, condition, status, specified_date, city } = req.body;

        const newSetting = await knex('settings')
            .insert({
                user_id, category, condition, status, specified_date, city
            })

        res.status(201).json(newSetting);
    } catch (err) {
        res.status(400).send(`Error adding new alert setting: ${err}`);
    }
}

const getAlertSetting = async (req, res) => {
    try {
        const settingId = req.params.id;

        const userAlertSetting = await knex("settings")
            .where({ id: settingId });



        if (userAlertSetting === 0) {
            return res.status(404).send("Setting not found");
        }

        res.status(200).json(userAlertSetting);
    } catch (err) {
        res.status(400).send(`Error editing alert: ${err}`);
    }
}

const editAlertSetting = async (req, res) => {
    try {
        const alertSettingId = req.params.id;
        const updatedSettingData = req.body;

        console.log("Setting ID", req.params.id);
        console.log("Updated Setting Data", updatedSettingData);

        const affectedRows = await knex("settings")
            .where({ id: alertSettingId })
            .update({
                ...updatedSettingData

            })

        if (affectedRows === 0) {
            return res.status(404).send("Setting not found");
        }

        const updatedSetting = await knex("alerts")
            .where({ id: alertSettingId })
            .first();

        res.status(200).json(updatedSetting);
    } catch (err) {
        res.status(400).send(`Error editing alert setting: ${err}`);
    }
}

const removeAlertSetting = async (req, res) => {
    try {
        const settingId = req.params.id;

        // Delete the alert setting from the 'settings' table
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


// const getUserData = async (req, res) => {
//     try {
//         const userId = req.params.id;
//         const userData = fs.readFileSync("./data/user-details.json");
//         const parsedData = JSON.parse(userData);

//         //Filter for specific user
//         const userInfo = parsedData.filter(user => user.id === userId);

//         res.status(200).json(userInfo);
//     } catch (err) {
//         res.status(400).send(`Error retrieving user(${req.params.id}) information: ${err}`)
//     }
// }


module.exports = {
    registerNewUser,
    loginAuthenticate,
    getCurrentUser,
    // getAllUsers,
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
    // getUserData
};