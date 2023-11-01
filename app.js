// change as Required... following code is just for starters

const http = require('http');
const url = require('url');
require('dotenv').config();

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write("Welcome to RUEats!");
    res.end();
});

const dbConfig = require('./config/DatabaseConfig');
const connection = new dbConfig().connection
const serverInstance = server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
