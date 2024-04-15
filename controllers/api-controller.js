const fs = require("fs");
const { v4: uuidv4 } = require('uuid');


const getAllUserAlerts = async (req, res) => {
    try {
        const userId = req.params.id;
        const alertsData = fs.readFileSync("./data/alert-details.json");
        const parsedData = JSON.parse(alertsData);

        //Filter for specific user
        const userAlerts = parsedData.filter(alert => alert.user_id === userId);

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
            ...newAlert // Spread the remaining properties from newAlert object
        };

        let alertsData = JSON.parse(fs.readFileSync("./data/alert-details.json"));

        alertsData.unshift(updatedAlert);

        console.log(alertsData);

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

        let alertsData = JSON.parse(fs.readFileSync("./data/alert-details.json"));

        // Locate the index of the alert
        const alertIndex = alertsData.findIndex(alert => alert.id === alertId);

        if (alertIndex === -1) {
            return res.status(404).send("Alert not found");
        }

        alertsData[alertIndex] = {
            ...alertsData[alertIndex],
            ...updatedAlertData,
            updated_at: new Date().toISOString() // Update the updated_at field with current date and time
        };

        fs.writeFileSync("./data/alert-details.json", JSON.stringify(alertsData, null, 2));

        res.status(200).json(alertsData[alertIndex]);
    } catch (err) {
        res.status(400).send(`Error editing alert: ${err}`);
    }
}

const removeAlert = async (req, res) => {
    try {
        const alertId = req.params.id;

        let alertsData = JSON.parse(fs.readFileSync("./data/alert-details.json"));

        // Locate alert with matching ID
        const alertIndex = alertsData.findIndex(alert => alert.id === alertId);

        if (alertIndex === -1) {
            return res.status(404).send("Alert not found");
        }

        // Remove the alert from the array. '1' specifies number of elements to remove
        alertsData.splice(alertIndex, 1);

        fs.writeFileSync("./data/alert-details.json", JSON.stringify(alertsData, null, 2));

        res.status(200).send("Alert deleted successfully");
    } catch (err) {
        res.status(400).send(`Error deleting alert: ${err}`);
    }
}


const getUserAlertSettings = async (req, res) => {
    try {
        const userId = req.params.id;
        const settingsData = fs.readFileSync("./data/settings-details.json");
        const parsedData = JSON.parse(settingsData);

        //Filter for specific user
        const userSettings = parsedData.filter(setting => setting.user_id === userId);

        res.status(200).json(userSettings);
    } catch (err) {
        res.status(400).send(`Error retrieving user(${req.params.id}) settings: ${err}`)
    }
}


const addAlertSetting = async (req, res) => {
    try {
        const newSetting = req.body;

        const newId = uuidv4();
        const createdAt = new Date().toISOString();

        const updatedSetting = {
            id: newId,
            created_at: createdAt,
            ...newSetting // Spread the remaining properties from newSetting object
        };

        let settingData = JSON.parse(fs.readFileSync("./data/settings-details.json"));

        settingData.unshift(updatedSetting);

        console.log(settingData);

        fs.writeFileSync("./data/settings-details.json", JSON.stringify(settingData, null, 2)); // null for no transformation, 2 for formatting output

        res.status(201).json(settingData);
    } catch (err) {
        res.status(400).send(`Error adding new alert: ${err}`);
    }
}

const getAlertSetting = async (req, res) => {
    try {
        const settingId = req.params.id;
        const updatedSettingData = req.body; 

        let settingData = JSON.parse(fs.readFileSync("./data/settings-details.json"));

        // Locate the index of the alert
        const settingIndex = settingData.findIndex(setting => setting.id === settingId);

        if (settingIndex === -1) {
            return res.status(404).send("Setting not found");
        }

        settingData[settingIndex] = {
            ...settingData[settingIndex],
            ...updatedSettingData,
            // updated_at: new Date().toISOString() // Update the updated_at field with current date and time
        };

        fs.writeFileSync("./data/settings-details.json", JSON.stringify(settingData, null, 2));

        res.status(200).json(settingData[settingIndex]);
    } catch (err) {
        res.status(400).send(`Error editing alert: ${err}`);
    }
}

const editAlertSetting = async (req, res) => {
    try {
        const alertSettingId = req.params.id;
        const updatedSettingData = req.body; 

        let settingData = JSON.parse(fs.readFileSync("./data/settings-details.json"));

        // Locate the index of the setting
        const alertIndex = settingData.findIndex(alert => alert.id === alertSettingId);

        if (alertIndex === -1) {
            return res.status(404).send("Alert not found");
        }

        settingData[alertIndex] = {
            ...settingData[alertIndex],
            ...updatedAlertData,
            updated_at: new Date().toISOString() // Update the updated_at field with current date and time
        };
        
        fs.writeFileSync("./data/settings-details.json", JSON.stringify(settingData, null, 2));

        res.status(200).json(settingData[alertIndex]);
    } catch (err) {
        res.status(400).send(`Error editing alert: ${err}`);
    }
}

const removeAlertSetting = async (req, res) => {
    try {
        const settingId = req.params.id;

        let settingsData = JSON.parse(fs.readFileSync("./data/settings-details.json"));

        // Locate setting with matching ID
        const settingIndex = settingsData.findIndex(setting => setting.id === settingId);

        if (settingIndex === -1) {
            return res.status(404).send("Alert not found");
        }

        // Remove the alert from the array. '1' specifies number of elements to remove
        settingsData.splice(settingIndex, 1);

        fs.writeFileSync("./data/settings-details.json", JSON.stringify(settingsData, null, 2));

        res.status(200).send("Alert deleted successfully");
    } catch (err) {
        res.status(400).send(`Error deleting alert: ${err}`);
    }
}


const getUserData = async (req, res) => {
    try {
        const userId = req.params.id;
        const userData = fs.readFileSync("./data/user-details.json");
        const parsedData = JSON.parse(userData);

        //Filter for specific user
        const userInfo = parsedData.filter(user => user.id === userId);

        res.status(200).json(userInfo);
    } catch (err) {
        res.status(400).send(`Error retrieving user(${req.params.id}) information: ${err}`)
    }
}


module.exports = {
    getAllUserAlerts,
    addAlert,
    editAlert,
    removeAlert,
    getUserAlertSettings,
    addAlertSetting,
    getAlertSetting,
    editAlertSetting,
    removeAlertSetting,
    getUserData
};