import "express-async-errors";

import express from "express";
import helmet from "helmet";
import pinoHttp from "pino-http";

import { rootRouter } from "./router";
import { errorMiddleware, notFoundMiddleware } from "./util/error";
import { logger } from "./util/logger";

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(pinoHttp({ logger }));

app.use("/api", rootRouter);

app.use([notFoundMiddleware, errorMiddleware]);

export { app };
