import Knex from "knex";
import KnexTinyLogger from "knex-tiny-logger";
import KnexFile from "./knexfile";

export default KnexTinyLogger(Knex(KnexFile), { bindings: false });
