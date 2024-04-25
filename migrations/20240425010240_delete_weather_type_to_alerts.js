exports.up = function (knex) {
    return knex.schema.table("alerts", function (table) {
        table.dropColumn("weather_type");
    });
};

exports.down = function (knex) {
    return knex.schema.table("alerts", function (table) {
        table.string("weather_type").notNullable();
    });
};

