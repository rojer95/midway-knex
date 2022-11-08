# Knex

本文档介绍如何在 Midway 中使用 Knex。

## 安装依赖

```bash
$ npm install midway-knex knex
```

## 安装数据库 Driver

常用数据库驱动如下，选择你对应连接的数据库类型安装：

```bash
$ npm install pg
$ npm install pg-native
$ npm install sqlite3
$ npm install better-sqlite3
$ npm install mysql
$ npm install mysql2
$ npm install oracledb
$ npm install tedious
```

下面的文档，我们将以 `mysql2` 作为示例。

## 启用组件

在 `src/configuration.ts` 文件中启用组件。

```typescript
import { Configuration } from "@midwayjs/decorator";
import { ILifeCycle } from "@midwayjs/core";
import { join } from "path";
import * as knex from "midway-knex";

@Configuration({
  imports: [
    // ...
    knex,
  ],
  importConfigs: [join(__dirname, "./config")],
})
export class MainConfiguration implements ILifeCycle {
  // ...
}
```

## 模型定义

### 创建 Model（可选）

```typescript
// src/model/person.ts
import { Table } from "midway-knex";

// 由于knex不是ORM，所以这里只需要关心表名称即可

@Table("Person")
class Person {
  name?: number;
  name?: string;
}
```

## 数据源配置

新版本 Midway 启用了 数据源机制 ，在 `src/config.default.ts` 中配置：

```typescript
// src/config/config.default.ts

export default {
  // ...
  sequelize: {
    dataSource: {
      // 第一个数据源，数据源的名字可以完全自定义
      default: {
        client: "mysql2",
        connection: {
          host: "127.0.0.1",
          port: 3306,
          user: "root",
          password: "root",
          database: "database",
          timezone: "+08:00",
          dateStrings: true,
          // ...其他配置
        },
      },

      // 第二个数据源
      default2: {
        // ...
      },
    },
  },
};
```

## 使用方法

```typescript
import { Provide } from "@midwayjs/decorator";
import { Person } from "../model/person";
import { InjectKnex, InjectKnexModel } from "midway-knex";

@Provide()
export class PersonService {
  @InjectKnexModel(Person)
  person: Knex<Person>;

  @InjectKnex()
  knex: Knex;

  async createPerson() {
    return await this.person.insert(
      {
        name: "name",
      },
      "*"
    );
  }

  /**
   * 事务操作
   */
  async transaction() {
    return await this.knex.transaction(async (t) => {
      const person = await this.person
        .select()
        .transacting(t)
        .forUpdate()
        .first();

      if (person) {
        await this.person
          .update({ name: "name2" })
          .where("id", person.id)
          .transacting(t);
      }

      return person;
    });
  }
}
```
