const serverInstance = require("./../app");

const DBConfig = require("./../config/DatabaseConfig");
const RUEatsRepository = require('./../src/db/RUEatsRepository');
const dbRepo = new RUEatsRepository();

const connection = new DBConfig().connection;

const http = require('http');

describe('Controller Tests', function () {

    describe('Valid GET /restaurants', function () {
        it('responds with 200 and returns all restaurants',   function () {

            const restaurants =  dbRepo.getAllRestaurants();

            const options = {
                hostname: 'localhost',
                port: 3000,
                path: '/restaurants',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            };

            const req = http.request(options, function (res) {
                let responseData = '';
                res.on('data', (chunk) => {
                    responseData += chunk;
                });
                res.on('end', () => {
                    expect(res.statusCode).toEqual(200);
                    expect(responseData).toEqual(JSON.stringify(restaurants));
                });
            });

            req.end();
        });


    });

    describe('Valid POST /users/register', function () {
        it('responds with 200 and user is successfully registered',  function () {

            const user = JSON.stringify({
                "name": "Kamble Anurag",
                "email": "anurag.kamble99@gmail.com",
                "password": "password1",
                "home_address": "1 Richmond Street",
                "zip_code": "08901",
                "city": "New Brunswick",
                "state": "NJ",
                "contact": "8484332447"
            });


            const options = {
                hostname: 'localhost',
                port: 3000,
                path: '/users/register',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': user.length
                }
            };

            const req = http.request(options, function (res) {
                let responseData = '';
                res.on('data', (chunk) => {
                    responseData += chunk;
                });
                res.on('end', async () => {
                    expect(res.statusCode).toEqual(200);
                    expect(responseData).toEqual("{\"message\":\"success\"}");
                    await dbRepo.deleteUserByEmail("anurag.kamble99@gmail.com")
                });
            });

            req.write(user);
            req.end();

        });
    });

    describe('Invalid POST /users/register missing data', function () {
        it('Missing Name responds with 400',  function () {

            const user = JSON.stringify({
                "email": "anurag.kamble99@gmail.com",
                "password": "password1",
                "home_address": "1 Richmond Street",
                "zip_code": "08901",
                "city": "New Brunswick",
                "state": "NJ"
            });


            const options = {
                hostname: 'localhost',
                port: 3000,
                path: '/users/register',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': user.length
                }
            };

            const req = http.request(options, function (res) {
                let responseData = '';
                res.on('data', (chunk) => {
                    responseData += chunk;
                });
                res.on('end', async () => {
                    expect(res.statusCode).toEqual(400);
                    expect(responseData).toEqual("{\"message\":\"Name, email and password are required\"}");
                });
            });

            req.write(user);
            req.end();

        });

        it('Missing Email responds with 400',  function () {

            const user = JSON.stringify({
                "name": "Kamble Anurag",
                "password": "password1",
                "home_address": "1 Richmond Street",
                "zip_code": "08901",
                "city": "New Brunswick",
                "state": "NJ"
            });


            const options = {
                hostname: 'localhost',
                port: 3000,
                path: '/users/register',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': user.length
                }
            };

            const req = http.request(options, function (res) {
                let responseData = '';
                res.on('data', (chunk) => {
                    responseData += chunk;
                });
                res.on('end', async () => {
                    expect(res.statusCode).toEqual(400);
                    expect(responseData).toEqual("{\"message\":\"success\"}");
                    await dbRepo.deleteUserByEmail("anurag.kamble99@gmail.com")
                });
            });

            req.write(user);
            req.end();

        });

        it('Missing Password responds with 400',  function () {

            const user = JSON.stringify({
                "name": "Kamble Anurag",
                "email": "anurag.kamble99@gmail.com",
                "home_address": "1 Richmond Street",
                "zip_code": "08901",
                "city": "New Brunswick",
                "state": "NJ"
            });


            const options = {
                hostname: 'localhost',
                port: 3000,
                path: '/users/register',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': user.length
                }
            };

            const req = http.request(options, function (res) {
                let responseData = '';
                res.on('data', (chunk) => {
                    responseData += chunk;
                });
                res.on('end', async () => {
                    expect(res.statusCode).toEqual(400);
                    expect(responseData).toEqual("{\"message\":\"Name, email and password are required\"}");
                });
            });

            req.write(user);
            req.end();

        });

        it('Invalid Name with Non Alphabetic characters responds with 400',  function () {

            const user = JSON.stringify({
                "name": "Kamble Anurag1",
                "email": "anurag.kamble99@gmail.com",
                "password": "password1",
                "home_address": "1 Richmond Street",
                "zip_code": "08901",
                "city": "New Brunswick",
                "state": "NJ"
            });


            const options = {
                hostname: 'localhost',
                port: 3000,
                path: '/users/register',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': user.length
                }
            };

            const req = http.request(options, function (res) {
                let responseData = '';
                res.on('data', (chunk) => {
                    responseData += chunk;
                });
                res.on('end', async () => {
                    expect(res.statusCode).toEqual(400);
                    expect(responseData).toEqual("{\"message\":\"Name should contain only alphabetical characters\"}");
                });
            });

            req.write(user);
            req.end();

        });

        it('Invalid Email ID responds with 400',  function () {

            const user = JSON.stringify({
                "name": "Kamble Anurag",
                "email": "anurag.kamble99gmail.com",
                "password": "password1",
                "home_address": "1 Richmond Street",
                "zip_code": "08901",
                "city": "New Brunswick",
                "state": "NJ"
            });


            const options = {
                hostname: 'localhost',
                port: 3000,
                path: '/users/register',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': user.length
                }
            };

            const req = http.request(options, function (res) {
                let responseData = '';
                res.on('data', (chunk) => {
                    responseData += chunk;
                });
                res.on('end', async () => {
                    expect(res.statusCode).toEqual(400);
                    expect(responseData).toEqual("{\"message\":\"Please enter a valid email ID\"}");
                });
            });

            req.write(user);
            req.end();

        });

        it('Invalid Password responds with 400',  function () {

            const user = JSON.stringify({
                "name": "Kamble Anurag",
                "email": "anurag.kamble99@gmail.com",
                "password": "passwo",
                "home_address": "1 Richmond Street",
                "zip_code": "08901",
                "city": "New Brunswick",
                "state": "NJ"
            });


            const options = {
                hostname: 'localhost',
                port: 3000,
                path: '/users/register',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': user.length
                }
            };

            const req = http.request(options, function (res) {
                let responseData = '';
                res.on('data', (chunk) => {
                    responseData += chunk;
                });
                res.on('end', async () => {
                    expect(res.statusCode).toEqual(400);
                    expect(responseData).toEqual("{\"message\":\"Password should have minimum six characters, at least one letter and one number\"}");
                });
            });

            req.write(user);
            req.end();

        });
    });

    describe('Valid POST /delivery_associates/register', function () {
        it('responds with 200 and user is successfully registered',  function () {

            const user = JSON.stringify({
                "name": "Saurabh K",
                "email": "sk@gmail.com",
                "home_address": "Street",
                "zip_code": "12345",
                "city": "NB",
                "state": "NJ",
                "latitude": 37.7749,
                "longitude": -122.4194,
                "delivery_in_progress": false,
                "password": "securePassword123",
                "contact": "8484332447"
            });


            const options = {
                hostname: 'localhost',
                port: 3000,
                path: '/users/register',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': user.length
                }
            };

            const req = http.request(options, function (res) {
                let responseData = '';
                res.on('data', (chunk) => {
                    responseData += chunk;
                });
                res.on('end', async () => {
                    expect(res.statusCode).toEqual(200);
                    expect(responseData).toEqual("{\"message\":\"success\"}");
                    await dbRepo.deleteAssociateByEmail("sk@gmail.com")
                });
            });

            req.write(user);
            req.end();

        });
    });

    describe('Invalid POST /delivery_associates/register missing data', function () {
        it('Missing Name responds with 400',  function () {

            const user = JSON.stringify({
                "email": "sk@gmail.com",
                "home_address": "Street",
                "zip_code": "12345",
                "city": "NB",
                "state": "NJ",
                "latitude": 37.7749,
                "longitude": -122.4194,
                "delivery_in_progress": false,
                "password": "securePassword123"
            });


            const options = {
                hostname: 'localhost',
                port: 3000,
                path: '/users/register',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': user.length
                }
            };

            const req = http.request(options, function (res) {
                let responseData = '';
                res.on('data', (chunk) => {
                    responseData += chunk;
                });
                res.on('end', async () => {
                    expect(res.statusCode).toEqual(400);
                    expect(responseData).toEqual("{\"message\":\"Name, email and password are required\"}");
                });
            });

            req.write(user);
            req.end();

        });

        it('Missing Email responds with 400',  function () {

            const user = JSON.stringify({
                "name": "Saurab K",
                "home_address": "Street",
                "zip_code": "12345",
                "city": "NB",
                "state": "NJ",
                "latitude": 37.7749,
                "longitude": -122.4194,
                "delivery_in_progress": false,
                "password": "securePassword123"
            });


            const options = {
                hostname: 'localhost',
                port: 3000,
                path: '/users/register',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': user.length
                }
            };

            const req = http.request(options, function (res) {
                let responseData = '';
                res.on('data', (chunk) => {
                    responseData += chunk;
                });
                res.on('end', async () => {
                    expect(res.statusCode).toEqual(400);
                    expect(responseData).toEqual("{\"message\":\"success\"}");
                    await dbRepo.deleteAssociateByEmail("sk@gmail.com")
                });
            });

            req.write(user);
            req.end();

        });

        it('Missing Password responds with 400',  function () {

            const user = JSON.stringify({
                "name": "Saurabh K",
                "email": "sk@gmail.com",
                "home_address": "Street",
                "zip_code": "12345",
                "city": "NB",
                "state": "NJ",
                "latitude": 37.7749,
                "longitude": -122.4194,
                "delivery_in_progress": false,
            });


            const options = {
                hostname: 'localhost',
                port: 3000,
                path: '/users/register',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': user.length
                }
            };

            const req = http.request(options, function (res) {
                let responseData = '';
                res.on('data', (chunk) => {
                    responseData += chunk;
                });
                res.on('end', async () => {
                    expect(res.statusCode).toEqual(400);
                    expect(responseData).toEqual("{\"message\":\"Name, email and password are required\"}");
                });
            });

            req.write(user);
            req.end();

        });

        it('Invalid Name with Non Alphabetic characters responds with 400',  function () {

            const user = JSON.stringify({
                "name": "Saurabh K123",
                "email": "sk@gmail.com",
                "home_address": "Street",
                "zip_code": "12345",
                "city": "NB",
                "state": "NJ",
                "latitude": 37.7749,
                "longitude": -122.4194,
                "delivery_in_progress": false,
                "password": "securePassword123"
            });


            const options = {
                hostname: 'localhost',
                port: 3000,
                path: '/users/register',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': user.length
                }
            };

            const req = http.request(options, function (res) {
                let responseData = '';
                res.on('data', (chunk) => {
                    responseData += chunk;
                });
                res.on('end', async () => {
                    expect(res.statusCode).toEqual(400);
                    expect(responseData).toEqual("{\"message\":\"Name should contain only alphabetical characters\"}");
                });
            });

            req.write(user);
            req.end();

        });

        it('Invalid Email ID responds with 400',  function () {

            const user = JSON.stringify({
                "name": "Saurabh K",
                "email": "sk123gmail.com",
                "home_address": "Street",
                "zip_code": "12345",
                "city": "NB",
                "state": "NJ",
                "latitude": 37.7749,
                "longitude": -122.4194,
                "delivery_in_progress": false,
                "password": "securePassword123"
            });


            const options = {
                hostname: 'localhost',
                port: 3000,
                path: '/users/register',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': user.length
                }
            };

            const req = http.request(options, function (res) {
                let responseData = '';
                res.on('data', (chunk) => {
                    responseData += chunk;
                });
                res.on('end', async () => {
                    expect(res.statusCode).toEqual(400);
                    expect(responseData).toEqual("{\"message\":\"Please enter a valid email ID\"}");
                });
            });

            req.write(user);
            req.end();

        });

        it('Invalid Password responds with 400',  function () {

            const user = JSON.stringify({
                "name": "Saurabh K",
                "email": "sk@gmail.com",
                "home_address": "Street",
                "zip_code": "12345",
                "city": "NB",
                "state": "NJ",
                "latitude": 37.7749,
                "longitude": -122.4194,
                "delivery_in_progress": false,
                "password": "sec"
            });


            const options = {
                hostname: 'localhost',
                port: 3000,
                path: '/users/register',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': user.length
                }
            };

            const req = http.request(options, function (res) {
                let responseData = '';
                res.on('data', (chunk) => {
                    responseData += chunk;
                });
                res.on('end', async () => {
                    expect(res.statusCode).toEqual(400);
                    expect(responseData).toEqual("{\"message\":\"Password should have minimum six characters, at least one letter and one number\"}");
                });
            });

            req.write(user);
            req.end();

        });
    });

    



});