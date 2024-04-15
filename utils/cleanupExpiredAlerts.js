const fs = require('fs');

// Load the alerts-detail.json file
const alertsData = JSON.parse(fs.readFileSync('alerts-detail.json', 'utf8'));

// Get the current date and time
const currentDate = new Date();

// Filter out entries where the specified_date has passed
const filteredAlerts = alertsData.filter(alert => {
    if (alert.specified_date) {
        const specifiedDate = new Date(alert.specified_date);
        return currentDate < specifiedDate;
    }
    return true; // Keep entries with no specified_date
});

// Write the filtered alerts back to the file
fs.writeFileSync('alerts-detail.json', JSON.stringify(filteredAlerts, null, 2));
