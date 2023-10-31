// change as Required... following code is just for starters

const http = require('http');
const url = require('url');
var mysql = require('mysql');

const port = process.env.PORT || 3000;

var connection = mysql.createConnection({
    //TO DO
//     host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
});


//TO uncommnent after DB parameters provided
// connection.connect(function(err) {
//     if (err) {
//         console.error('Database connection failed: ' + err.stack);
//         throw error;
//     }
//
//     console.log('Connected to database.');
// });
//
// connection.end();

const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write("Welcome to RUEats!");
    res.end();
});

const serverInstance = server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = { connection };
