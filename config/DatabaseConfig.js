const mysql = require("mysql2");
module.exports = class DatabaseConfig {
  constructor() {
    this.connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    this.connectDatabase(this.connection);
  }

  async connectDatabase(connection) {
    await connection.connect(function (err) {
      if (err) {
        console.error("Database connection failed: " + err.stack);
        throw error;
      }

      console.log("Connected to database.");
    });

    connection.query("SHOW TABLES", [], function (error, results, fields) {
      if (error) {
        throw error;
      }
      console.log(results);
    });
  }
};
