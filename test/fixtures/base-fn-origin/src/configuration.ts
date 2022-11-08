import { App, Configuration, Inject } from "@midwayjs/core";
import * as knex from "../../../../src";
import { join } from "path";
import { IMidwayApplication } from "@midwayjs/core";
import { InjectKnexModel } from "../../../../src";
import { Knex } from "knex";
import { Book } from "./model";

@Configuration({
  imports: [knex],
  importConfigs: [join(__dirname, "./config")],
})
export class ContainerConfiguration {
  @App()
  app: IMidwayApplication;

  @Inject()
  knexDataSourceManager: knex.KnexDataSourceManage;

  @InjectKnexModel(Book)
  book: Knex<Book>;

  async onReady() {
    const knex = this.knexDataSourceManager.getDataSource("default");
    const tableExist = await knex.schema.hasTable("Book");

    if (!tableExist) {
      await knex.schema.createTable("Book", (table) => {
        table.increments("id");
        table.string("title");
        table.string("foo");
        table.datetime("created_at");
        table.datetime("updated_at");
      });
    }

    const book = await this.book.insert(
      {
        title: "b1",
        foo: "bar",
        created_at: new Date(),
        updated_at: new Date(),
      },
      "*"
    );

    this.app.setAttr("result", "hello world" + JSON.stringify(book));
  }
}
