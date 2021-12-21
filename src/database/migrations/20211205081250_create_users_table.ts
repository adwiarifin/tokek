import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("users", t => {
    t.string("id", 26).notNullable().primary();
    t.string("name", 100).notNullable();
    t.string("phone_number", 16).notNullable().unique();
    t.string("email", 100).notNullable().unique();
    t.string("password", 60).notNullable();
    t.timestamps(false, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("users");
}
