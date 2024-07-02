// knexfile.js
module.exports = {
    development: {
      client: 'sqlite3',
      connection: {
        filename: './family_history.db'
      },
      useNullAsDefault: true,
      migrations: {
        directory: './migrations'
      }
    }
  };
  