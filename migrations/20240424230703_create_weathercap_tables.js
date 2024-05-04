/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .createTable("user", (table) => {
            table.increments("id").primary();
            table.string("first_name").notNullable();
            table.string("last_name").notNullable();
            table.string("email").notNullable().unique();
            table.string("password").notNullable();
            table.string("city").notNullable();
            table.decimal("latitude", 9, 6).notNullable();
            table.decimal("longitude", 9, 6).notNullable();
            table.timestamps(true, true);
        })

        .createTable("alerts", (table) => {
            table.increments("id").primary();
            table.timestamp("created_at").defaultTo(knex.fn.now());
            table
                .integer("user_id")
                .unsigned()
                .references("user.id")
                .onUpdate("CASCADE")
                .onDelete("CASCADE");
            table.string("weather_type").notNullable();
            table.string("current_condition").notNullable();
            table.string("status").notNullable();
            table.integer("specified_date").notNullable();
        })

        .createTable("settings", (table) => {
            table.increments("id").primary();
            table
                .integer("user_id")
                .unsigned()
                .references("user.id")
                .onUpdate("CASCADE")
                .onDelete("CASCADE");
            table.string("category").notNullable();
            table.string("condition").notNullable();
            table.string("status").notNullable();
            table.string("city").notNullable();
            table.integer("specified_date");
            table.timestamps(true, true);
        })

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("user").dropTable("alerts").dropTable("settings");
};

