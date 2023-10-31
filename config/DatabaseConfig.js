const mysql = require("mysql2");
module.exports = class DatabaseConfig{

    constructor() {
        this.connection = mysql.createConnection({

            host: "se-db-1.cn6ajpioczny.us-east-1.rds.amazonaws.com",
              user: "app_user",
              password: "xYHj-FIOpbha-Fhswq",
              database: "SE_DB_1",
        });

        this.connectDatabase(this.connection);

    }

    async connectDatabase(connection) {
        await connection.connect(function (err) {
            if (err) {
                console.error('Database connection failed: ' + err.stack);
                throw error;
            }

            console.log('Connected to database.');
        });


         connection.query('SHOW TABLES',[], function (error, results, fields) {
                     if (error){
                         res.statusCode = 400;
                         res.setHeader('Content-Type', 'text/plain');
                         res.end("fetching record");
                         throw error;
                     }

                     console.log(results);

                 });
    }

}






