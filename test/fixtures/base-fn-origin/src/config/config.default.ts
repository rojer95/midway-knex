export default (appInfo) => {
  return {
    knex: {
      dataSource: {
        default: {
          debug: true,
          client: "sqlite3",
          connection: {
            filename: ":memory:",
          },
        },
      },
    },
  };
};
