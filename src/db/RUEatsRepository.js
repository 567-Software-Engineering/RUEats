
const DatabaseConfig = require('./../../config/DatabaseConfig');
module.exports = class RUEatsRepository{

    constructor() {
        this.connection = new DatabaseConfig().connection;
    }

    //Create new method below
    // Sample Code
    // function testdb(identifier){
    //     var result;
    //     connection.query('SELECT * FROM testdb WHERE id = ?', [identifier], function (error, results, fields) {
    //         if (error){
    //             res.statusCode = 400;
    //             res.setHeader('Content-Type', 'text/plain');
    //             res.end("fetching record");
    //             throw error;
    //         }
    //         result = results;
    //     });
    //
    //     return result;
    // }




}
