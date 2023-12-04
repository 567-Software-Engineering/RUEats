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

}
module.exports = uiRoutes