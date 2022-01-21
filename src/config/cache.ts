import joi from "joi";

import { loadConfig } from "../util/load-config";

export interface CacheEnv {
  CACHE_HOST: string;
  CACHE_PORT: number;
  CACHE_USER: string;
  CACHE_PASS: string;
  CACHE_DB: number;
}

const schema = joi
  .object()
  .keys({
    CACHE_HOST: joi.string().required(),
    CACHE_PORT: joi.number().port().required(),
    CACHE_USER: joi.string().allow(""),
    CACHE_PASS: joi.string().allow(""),
    CACHE_DB: joi.number().default(0),
  })
  .unknown();

const env = loadConfig(schema);

export const cache = {
  socket: {
    host: env.CACHE_HOST,
    port: env.CACHE_PORT,
  },
  username: env.CACHE_USER,
  password: env.CACHE_PASS,
  database: env.CACHE_DB,
};
