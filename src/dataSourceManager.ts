import {
  Config,
  DataSourceManager,
  ILogger,
  Init,
  Inject,
  Logger,
  Provide,
  Scope,
  ScopeEnum,
} from "@midwayjs/core";
import knex, { Knex } from "knex";

@Provide()
@Scope(ScopeEnum.Singleton)
export class KnexDataSourceManage extends DataSourceManager<Knex> {
  @Config("knex")
  knexConfig;

  @Inject()
  baseDir: string;

  @Logger("coreLogger")
  coreLogger: ILogger;

  getName(): string {
    return "knex";
  }

  @Init()
  async init() {
    await this.initDataSource(this.knexConfig, this.baseDir);
  }

  protected async createDataSource(
    config: any,
    dataSourceName: string
  ): Promise<void | Knex<any, any[]>> {
    return knex(config);
  }

  protected async checkConnected(
    dataSource: Knex<any, any[]>
  ): Promise<boolean> {
    try {
      await dataSource.select(dataSource.raw("1=1"));
      return true;
    } catch (err) {
      this.coreLogger.error(err);
      return false;
    }
  }

  protected async destroyDataSource(
    dataSource: Knex<any, any[]>
  ): Promise<void> {
    if (await this.checkConnected(dataSource)) {
      await dataSource.destroy();
    }
  }

  getDefaultDataSourceName() {
    return "default";
  }
}
