const knex = require('knex')(require('../knexfile'));

// const currentWeatherAPI_URL = process.env.currentWeatherAPI_URL
const forecastWeatherAPI_URL = process.env.forecastWeatherAPI_URL
const weatherAPI_Key = process.env.weatherAPI_Key

const generateAlerts = async (userId, lat, lon) => {
    try {
        const response = await fetch(`${forecastWeatherAPI_URL}?lat=${lat}&lon=${lon}&exclude=hourly&appid=${weatherAPI_Key}`);
        const forecastData = await response.json();

        console.log("Forecast weather data", forecastData);

        const userSettings = await knex("settings")
            .where({ user_id: userId });


        console.log("User Settings", userSettings);

        const conditions = Array.from(new Set(userSettings.map(setting => setting.condition.toLowerCase())));

        console.log("Conditions: ", conditions);

        const dailyWeatherMainFiltered = forecastData.daily
            .map(day => ({
                dt: day.dt,
                main: day.weather[0].main.toLowerCase()
            }))
            .filter(day => conditions.includes(day.main.toLowerCase()));

        console.log("Daily Weather Main Filtered ", dailyWeatherMainFiltered);

        const alerts = dailyWeatherMainFiltered.map(day => ({
            user_id: userId,
            category: "weather_type",
            condition: day.main,
            current_condition: day.main,
            status: "active",
            specified_date: day.dt
        }));

        console.log("Generated alerts", alerts);

        for (const alert of alerts) {
            const existingAlert = await knex("alerts")
                .where({
                    user_id: alert.user_id,
                    condition: alert.condition,
                    specified_date: alert.specified_date
                })
                .first();

            if (!existingAlert) {
                await knex("alerts").insert(alert);
                console.log("Alert has been inserted into the database");
            }
        }

        console.log("Alerts generation completed");
    } catch (err) {
        console.error(`Error generating alerts: ${err}`);
    }
}

module.exports = { generateAlerts };
