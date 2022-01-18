import joi from "joi";

import { loadConfig } from "../util/load-config";

export interface AppEnv {
  NODE_ENV: "development" | "test" | "production";
  PORT: number;
  TOKEN_SECRET: string;
  TOKEN_EXPIRE: string;
}

const schema = joi
  .object()
  .keys({
    NODE_ENV: joi
      .string()
      .valid("development", "test", "production")
      .default("development"),
    PORT: joi.number().port().default(3000),
    TOKEN_SECRET: joi.string().min(12),
    TOKEN_EXPIRE: joi.string().default("1800s"),
  })
  .unknown();

const env = loadConfig(schema);

export const app = {
  env: env.NODE_ENV,
  port: env.PORT,
  token: {
    secret: env.TOKEN_SECRET,
    expire: env.TOKEN_EXPIRE,
  },
};
