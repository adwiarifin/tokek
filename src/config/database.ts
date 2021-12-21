import joi from "joi";

import { loadConfig } from "../util/load-config";

export interface DatabaseEnv {
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASS: string;
  DB_NAME: string;
  DB_POOL_MIN: number;
  DB_POOL_MAX: number;
}

const schema = joi
  .object()
  .keys({
    DB_HOST: joi.string().required(),
    DB_PORT: joi.number().port().required(),
    DB_USER: joi.string().required(),
    DB_PASS: joi.string().allow(""),
    DB_NAME: joi.string().required(),
    DB_POOL_MIN: joi.number().default(2),
    DB_POOL_MAX: joi.number().default(10),
  })
  .unknown();

const env = loadConfig(schema);

export const database = {
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASS,
  name: env.DB_NAME,
  pool: {
    min: env.DB_POOL_MIN,
    max: env.DB_POOL_MAX,
  },
};
