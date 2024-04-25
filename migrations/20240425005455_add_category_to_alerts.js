exports.up = function (knex) {
    return knex.schema.table("alerts", function (table) {
        table.string("category").notNullable();
    });
};

exports.down = function (knex) {
    return knex.schema.table("alerts", function (table) {
        table.dropColumn("category");
    });
};
