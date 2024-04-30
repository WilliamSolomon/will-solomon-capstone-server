const knex = require('knex')(require('../knexfile'));

const cleanupExpiredAlerts = async () => {
    try {
        // Calculate the date for the previous day
        const currentDate = new Date();
        const previousDate = new Date(currentDate);
        previousDate.setDate(previousDate.getDate() - 1);

        // Convert previousDate to a Unix timestamp (number of seconds since January 1, 1970)
        const previousDateUnixTimestamp = Math.floor(previousDate.getTime() / 1000);

        // Delete alerts with specified_date from the previous day
        const deletedRows = await knex('alerts')
            .where('specified_date', '<', previousDateUnixTimestamp)
            .del();

        console.log(`${deletedRows} alerts deleted from the previous day.`);
    } catch (error) {
        console.error(`Error deleting previous day alerts: ${error}`);
    }
};


module.exports = { cleanupExpiredAlerts };
