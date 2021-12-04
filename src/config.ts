import joi from "joi";

import { loadConfig } from "./util/load-config";

const schema = joi.object()
    .keys({
        NODE_ENV: joi.string()
            .valid("development", "test", "production")
            .default("development"),
        PORT: joi.number().port().default(3000),
    })
    .unknown();

const env = loadConfig(schema);

export const config = {
    env: env.NODE_ENV as "development" | "test" | "production",
    port: env.PORT as number,
}