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

    "/app/restaurants/:restaurant_id" : {
        GET:(_req, res) =>{
            fs.readFile('./public/restaurant-profile.html', 'utf8', function (error, data) {
                if (error) {
                    response(res, {data: "Page not Found!", status : 404})
                } else {
                    const { restaurant_id } = _req.params;
                    data = data.replace(/{{restaurant_id}}/g, restaurant_id);
                    console.log(restaurant_id);
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


    "/home" : {
        GET:(_req, res) =>{
            fs.readFile('./public/home.html', 'utf8', function (error, data) {
                if (error) {
                    response(res, {data: "Page not Found!", status : 404})
                } else {
                    response(res,{data : data, contentType:'text/html'});
                }
            });
        }
    },
    "/app/cart/:userID" : {
        GET:(_req, res) =>{
            fs.readFile('./public/cart.html', 'utf8', function (error, data) {
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

    "/app/users/:userID/orders" : {
        GET: (_req, res) => {
            fs.readFile('./public/order-history.html', 'utf8', function (error, data) {
                if (error) {
                    response(res, {data: "Page not Found!", status: 404})
                } else {
                    const { userID } = _req.params;
                    data = data.replace(/{{userID}}/g, userID);
                    response(res, {data: data, contentType: 'text/html'});
                }
            });
        }
    },    
    
    "/app/payment-form" : {
        GET:(_req, res) =>{
            fs.readFile('./public/payment-form.html', 'utf8', function (error, data) {
                if (error) {
                    response(res, {data: "Page not Found!", status : 404})
                } else {
                    // const { userID } = _req.params;
                    // data = data.replace(/{{userID}}/g, userID);
                    response(res,{data : data, contentType:'text/html'});
                }
            });
        }
    },

    "/app/restaurants-orders/:restaurant_id" : {
        GET:(_req, res) =>{
            fs.readFile('./public/restaurant-orders.html', 'utf8', function (error, data) {
                if (error) {
                    response(res, {data: "Page not Found!", status : 404})
                } else {
                    const { restaurant_id } = _req.params;
                    data = data.replace(/{{restaurant_id}}/g, restaurant_id);
                    console.log(restaurant_id);
                    response(res,{data : data, contentType:'text/html'});
                }
            });
        }
    },

}
module.exports = uiRoutes
