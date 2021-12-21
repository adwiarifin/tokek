// Update with your config settings.

import { config } from "../config";

export default {
  client: "mysql2",
  connection: {
    host: config.database.host,
    port: config.database.port,
    user: config.database.username,
    password: config.database.password,
    database: config.database.name,
  },
  pool: {
    min: config.database.pool.min,
    max: config.database.pool.max,
  },
  migrations: {
    directory: "./migrations",
    tableName: "knex_migrations",
  },
  seeds: {
    directory: "./seeds",
  },
};
