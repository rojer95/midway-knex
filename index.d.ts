import { KnexConfigOptions } from "./dist/index";

export * from "./dist/index";

declare module "@midwayjs/core/dist/interface" {
  interface MidwayConfig {
    knex?: PowerPartial<KnexConfigOptions>;
  }
}
