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

}
module.exports = uiRoutes