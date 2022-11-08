import { Knex } from "knex";
import { DataSourceManagerConfigOption } from "@midwayjs/core";

export type KnexConfigOptions<D extends Knex.Config = Knex.Config> =
  DataSourceManagerConfigOption<D>;
