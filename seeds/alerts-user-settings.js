// import seed data files, arrays of objects
const userData = require('../seed-data/user');
const alertsData = require('../seed-data/alerts');
const settingsData = require('../seed-data/settings');

exports.seed = async function(knex) {
  // await knex('user').del();
  // await knex('alerts').del();
  await knex('settings').del();
  // await knex('user').insert(userData);
  // await knex('alerts').insert(alertsData);
  await knex('settings').insert(settingsData);
};

