const fs = require("fs");
const { v4: uuidv4 } = require('uuid');

const currentWeatherAPI_URL = process.env.currentWeatherAPI_URL
const forecastWeatherAPI_URL = process.env.forecastWeatherAPI_URL
const weatherAPI_Key = process.env.weatherAPI_Key

const generateAlerts = async (userId, lat, lon) => {
    // let forecastData;
    // try {
        const response = await fetch(`${forecastWeatherAPI_URL}?lat=${lat}&lon=${lon}&exclude=hourly&appid=${weatherAPI_Key}&units=imperial`);
        const forecastData = await response.json();
        // console.log("Forecast Data",forecastData);

  

    // } catch (error) {
    //     console.error(error);
    //     // res.status(500).json({ error: "Internal server error" });
    // }

    // console.log("Forecast Data",forecastData);

    const settingsData = fs.readFileSync("./data/settings-details.json");
    const parsedData = JSON.parse(settingsData);
    const userSettings = parsedData.filter(setting => setting.user_id === userId);
    const conditions = Array.from(new Set(userSettings.map(setting => setting.condition.toLowerCase())));

    const dailyWeatherMainFiltered = forecastData.daily
        .map(day => ({
            dt: day.dt,
            main: day.weather[0].main.toLowerCase()
        }))
        .filter(day => conditions.includes(day.main.toLowerCase()));

    const alerts = dailyWeatherMainFiltered.map(day => ({
        id: uuidv4(),
        created_at: new Date().toISOString(),
        user_id: userId,
        category: "weather_type",
        condition: day.main,
        current_condition: null,
        status: "active",
        specified_date: day.dt
    }));

    try {
        let alertsData = JSON.parse(fs.readFileSync("./data/alert-details.json"));

        for (const alert of alerts) {
            // Check if alert with same user_id, condition, and specified_date already exists
            const isDuplicate = alertsData.some(existingAlert =>
                existingAlert.user_id === alert.user_id &&
                existingAlert.condition === alert.condition &&
                existingAlert.specified_date === alert.specified_date
            );

            if (!isDuplicate) {
                alertsData.unshift(alert);
                console.log("Alert has been written to alerts-details.json");
            }
        }

        // Write updated alerts data back to file
        fs.writeFileSync("./data/alert-details.json", JSON.stringify(alertsData, null, 2));
        
    } catch (err) {
        console.error(`Error writing alerts to file: ${err}`);
    }
}

module.exports = { generateAlerts };
