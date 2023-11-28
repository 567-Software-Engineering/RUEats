const serverInstance = require("./../app");

const DBConfig = require("./../config/DatabaseConfig");

const connection = new DBConfig().connection;

const http = require('http');

describe('Controller Tests', function () {

    describe('Valid GET /restaurants', function () {
        it('responds with 200 and returns all restaurants', function (done) {

            const restaurants = [
                {
                    "restaurant_id": 1,
                    "name": "SMASHVILLE",
                    "email": "chickensammy@smashville.com",
                    "phone_number": "+1-202-555-0111",
                    "address": "377a George St, New Brunswick",
                    "cuisine_type": "American",
                    "rating": "5",
                    "operating_hours": "12pm-10pm",
                    "is_active": 1,
                    "password": null
                },
                {
                    "restaurant_id": 2,
                    "name": "Bella Italia",
                    "email": "contact@bellaitalia.com",
                    "phone_number": "+1-202-555-0101",
                    "address": "12 Main St, Rome",
                    "cuisine_type": "Italian",
                    "rating": "5",
                    "operating_hours": "8am-10pm",
                    "is_active": 1,
                    "password": null
                },
                {
                    "restaurant_id": 3,
                    "name": "Changs Kitchen",
                    "email": "info@changskitchen.com",
                    "phone_number": "+1-202-555-0102",
                    "address": "27 Wall St, Beijing",
                    "cuisine_type": "Chinese",
                    "rating": "4",
                    "operating_hours": "9am-9pm",
                    "is_active": 1,
                    "password": null
                },
                {
                    "restaurant_id": 5,
                    "name": "Curry Palace",
                    "email": "reservations@currypalace.com",
                    "phone_number": "+1-202-555-0104",
                    "address": "67 Park Ave, Mumbai",
                    "cuisine_type": "Indian",
                    "rating": "3",
                    "operating_hours": "11am-10pm",
                    "is_active": 1,
                    "password": null
                },
                {
                    "restaurant_id": 6,
                    "name": "Le Parisienne",
                    "email": "booking@leparisienne.com",
                    "phone_number": "+1-202-555-0105",
                    "address": "81 Broadway St, Paris",
                    "cuisine_type": "French",
                    "rating": "5",
                    "operating_hours": "7am-9pm",
                    "is_active": 1,
                    "password": null
                },
                {
                    "restaurant_id": 8,
                    "name": "Sushi World",
                    "email": "dine@sushiworld.com",
                    "phone_number": "+1-202-555-0107",
                    "address": "112 Elm St, Tokyo",
                    "cuisine_type": "Japanese",
                    "rating": "4",
                    "operating_hours": "10am-9pm",
                    "is_active": 1,
                    "password": null
                },
                {
                    "restaurant_id": 9,
                    "name": "Thai Delight",
                    "email": "inquiry@thaidelight.com",
                    "phone_number": "+1-202-555-0108",
                    "address": "130 Cedar Rd, Bangkok",
                    "cuisine_type": "Thai",
                    "rating": "3",
                    "operating_hours": "9am-10pm",
                    "is_active": 1,
                    "password": null
                },
                {
                    "restaurant_id": 10,
                    "name": "Tapas Bar",
                    "email": "feedback@tapasbar.com",
                    "phone_number": "+1-202-555-0109",
                    "address": "147 Oak St, Madrid",
                    "cuisine_type": "Spanish",
                    "rating": "4",
                    "operating_hours": "8am-11pm",
                    "is_active": 1,
                    "password": null
                },
                {
                    "restaurant_id": 11,
                    "name": "Greek Taverna",
                    "email": "eat@greektaverna.com",
                    "phone_number": "+1-202-555-0110",
                    "address": "165 Maple Ln, Athens",
                    "cuisine_type": "Greek",
                    "rating": "5",
                    "operating_hours": "9am-10pm",
                    "is_active": 1,
                    "password": null
                },
                {
                    "restaurant_id": 13,
                    "name": "testRestaurant1",
                    "email": "test@rueats.com",
                    "phone_number": "9435465734",
                    "address": "West ave 1",
                    "cuisine_type": "italian",
                    "rating": null,
                    "operating_hours": null,
                    "is_active": 1,
                    "password": "$2b$10$tL0qjuincgQhF2L5dBkmjOgGZ97lpKFsLdcE9/DciVNjiCyhIj2WC"
                },
                {
                    "restaurant_id": 15,
                    "name": "testRestaurant",
                    "email": "test@rueat.com",
                    "phone_number": "9435465735",
                    "address": "West ave 1",
                    "cuisine_type": "italian",
                    "rating": null,
                    "operating_hours": null,
                    "is_active": 1,
                    "password": "$2b$10$GKUTYu3zrDZYzc6tNOZa2OG9hn65kc0djPQLxNzvneIp6aQJCq.H2"
                },
                {
                    "restaurant_id": 17,
                    "name": "testRestaurant3",
                    "email": "test@rueats3.com",
                    "phone_number": "9435465738",
                    "address": "West ave 1",
                    "cuisine_type": "italian",
                    "rating": null,
                    "operating_hours": null,
                    "is_active": 1,
                    "password": "$2b$10$y6urY1KzZAhRhU85z0jJz.8Fm6ojS0WUAq3o.zYfkf3cTqrmqX9ci"
                },
                {
                    "restaurant_id": 18,
                    "name": "testRestaurant4",
                    "email": "test@rueats4.com",
                    "phone_number": "9435465739",
                    "address": "West ave 1",
                    "cuisine_type": "italian",
                    "rating": null,
                    "operating_hours": null,
                    "is_active": 1,
                    "password": "$2b$10$Iih0ri/Oq2YhkM509e4J8.w6fuNsO/BTexHeKAsCW0g1Sov/oiFRO"
                },
                {
                    "restaurant_id": 19,
                    "name": "testRestaurant5",
                    "email": "test@rueats5.com",
                    "phone_number": "9435334576",
                    "address": "West ave 1",
                    "cuisine_type": "italian",
                    "rating": null,
                    "operating_hours": null,
                    "is_active": 1,
                    "password": "$2b$10$A7s7//3VI.rk39svmEcLFO0lPmQ7clk3WAqYsO2D0XuwjbM6qUgLq"
                },
                {
                    "restaurant_id": 20,
                    "name": "testRestaurant6",
                    "email": "test@rueats6.com",
                    "phone_number": "9435334577",
                    "address": "West ave 1",
                    "cuisine_type": "italian",
                    "rating": null,
                    "operating_hours": null,
                    "is_active": 1,
                    "password": "$2b$10$ht1VVnLvYC.gIe6Kl44pfe77bxowGmkCmyHtoXt1K2FFQtY38joE2"
                },
                {
                    "restaurant_id": 21,
                    "name": "testrestaurant",
                    "email": "test@rueats.edu",
                    "phone_number": "9435334500",
                    "address": "West ave 1",
                    "cuisine_type": "italian",
                    "rating": null,
                    "operating_hours": null,
                    "is_active": 1,
                    "password": "$2b$10$8j7c1xSCbuP5EZxCCdfmOOCjFOZIHkMWaHLGMfm4K9hTqcq6O/k36"
                }
            ];

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
                    done();
                });
            });

            req.end();
        });
    });


});