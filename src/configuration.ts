import {
  Configuration,
  Init,
  Inject,
  IMidwayContainer,
  MidwayDecoratorService,
  getClassMetadata,
} from "@midwayjs/core";
import { KnexDataSourceManage } from "./dataSourceManager";
import { KNEX_INSTANCE_KEY, KNEX_MODEL_KEY, KNEX_TABLE_KEY } from "./decorator";

@Configuration({
  namespace: "knex",
  importConfigs: [
    {
      default: {
        knex: {},
      },
    },
  ],
})
export class KnexConfiguration {
  @Inject()
  decoratorService: MidwayDecoratorService;

  dataSourceManager: KnexDataSourceManage;

  @Init()
  async init() {
    this.decoratorService.registerPropertyHandler(
      KNEX_INSTANCE_KEY,
      (
        propertyName,
        meta: {
          connectionName?: string;
        }
      ) => {
        return this.dataSourceManager.getDataSource(
          meta.connectionName ||
            this.dataSourceManager.getDefaultDataSourceName()
        );
      }
    );

    this.decoratorService.registerPropertyHandler(
      KNEX_MODEL_KEY,
      (
        propertyName,
        meta: {
          modelClass: new () => any;
          connectionName?: string;
        }
      ) => {
        const knexInstance = this.dataSourceManager.getDataSource(
          meta.connectionName ||
            this.dataSourceManager.getDefaultDataSourceName()
        );

        const tableMeta = getClassMetadata(KNEX_TABLE_KEY, meta.modelClass);

        if (!tableMeta || !tableMeta.tableName)
          throw new Error("Knex Model need @Table decorator");
        return knexInstance(tableMeta.tableName);
      }
    );
  }

  async onReady(container: IMidwayContainer) {
    this.dataSourceManager = await container.getAsync(KnexDataSourceManage);
  }

  async onStop() {
    if (this.dataSourceManager) {
      await this.dataSourceManager.stop();
    }
  }
}
