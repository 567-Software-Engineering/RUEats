const response = require("../utils/response");
let fs = require('fs');


const uiRoutes = {
    "/app/restaurants" : {
        GET:(_req, res) =>{
            fs.readFile('./public/restaurants.html', null, function (error, data) {
                if (error) {
                    response(res, {data: "Page not Found!", status : 404})
                } else {
                    response(res,{data : data, contentType:'text/html'});
                }
            });
        }
    },

    "/app/restaurant-menu/:restaurantID" : {
        GET:(_req, res) =>{
            fs.readFile('./public/restaurant-menu.html', 'utf8', function (error, data) {
                if (error) {
                    response(res, {data: "Page not Found!", status : 404})
                } else {
                    const { restaurantID } = _req.params;
                    data = data.replace(/{{restaurantID}}/g, restaurantID);
                    response(res,{data : data, contentType:'text/html'});
                }
            });
        }
    },

    "/app/users/:userID" : {
        GET:(_req, res) =>{
            fs.readFile('./public/user-profile.html', 'utf8', function (error, data) {
                if (error) {
                    response(res, {data: "Page not Found!", status : 404})
                } else {
                    const { userID } = _req.params;
                    data = data.replace(/{{userID}}/g, userID);
                    response(res,{data : data, contentType:'text/html'});
                }
            });
        }
    },

    "/app/delivery-associate-home/:associateID" : {
        GET:(_req, res) =>{
            fs.readFile('./public/delivery-associate-home.html', 'utf8', function (error, data) {
                if (error) {
                    response(res, {data: "Page not Found!", status : 404})
                } else {
                    const { associateID } = _req.params;
                    data = data.replace(/{{associateID}}/g, associateID);
                    response(res,{data : data, contentType:'text/html'});
                }
            });
        }
    },

}
module.exports = uiRoutes