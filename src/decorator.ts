import {
  createCustomPropertyDecorator,
  saveClassMetadata,
} from "@midwayjs/core";

export const KNEX_INSTANCE_KEY = "knex:instance";
export const KNEX_MODEL_KEY = "knex:model";
export const KNEX_TABLE_KEY = "knex:table";

export function Table(tableName: string) {
  return (target) => {
    saveClassMetadata(
      KNEX_TABLE_KEY,
      {
        tableName,
      },
      target
    );
  };
}

export function InjectKnex(connectionName?: string) {
  return createCustomPropertyDecorator(KNEX_INSTANCE_KEY, {
    connectionName,
  });
}

export function InjectKnexModel(
  modelClass: new () => any,
  connectionName?: string
) {
  return createCustomPropertyDecorator(KNEX_MODEL_KEY, {
    modelClass,
    connectionName,
  });
}
