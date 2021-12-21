import joi from "joi";

import { loadConfig } from "../util/load-config";

export interface AppEnv {
  NODE_ENV: "development" | "test" | "production";
  PORT: number;
}

const schema = joi
  .object()
  .keys({
    NODE_ENV: joi
      .string()
      .valid("development", "test", "production")
      .default("development"),
    PORT: joi.number().port().default(3000),
  })
  .unknown();

const env = loadConfig(schema);

export const app = {
  env: env.NODE_ENV,
  port: env.PORT,
};
