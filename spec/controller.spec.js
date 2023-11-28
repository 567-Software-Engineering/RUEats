const serverInstance = require("./../app");

const DBConfig = require("./../config/DatabaseConfig");
const RUEatsRepository = require('./../src/db/RUEatsRepository');
const dbRepo = new RUEatsRepository();

const connection = new DBConfig().connection;

const http = require('http');

describe('Controller Tests', function () {

    describe('Valid GET /restaurants', function () {
        it('responds with 200 and returns all restaurants', async function () {

            const restaurants = await dbRepo.getAllRestaurants();

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
        it('responds with 200 and returns all restaurants', function () {

            const user = JSON.stringify({
                "name": "Kamble Anurag",
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
                    expect(res.statusCode).toEqual(200);
                    expect(responseData).toEqual("{\"message\":\"success\"}");
                    await dbRepo.deleteUserByEmail("anurag.kamble99@gmail.com")
                });
            });

            req.write(user);
            req.end();

        });
    });


});