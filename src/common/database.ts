import Knex from "knex";
import KnexTinyLogger from "knex-tiny-logger";
import { config } from "../config";

export default KnexTinyLogger(Knex(config.database), { bindings: false });
