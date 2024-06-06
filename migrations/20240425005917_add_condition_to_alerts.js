exports.up = function (knex) {
    return knex.schema.table("alerts", function (table) {
        table.string("condition").notNullable();
    });
};

exports.down = function (knex) {
    return knex.schema.table("alerts", function (table) {
        table.dropColumn("condition");
    });
};

