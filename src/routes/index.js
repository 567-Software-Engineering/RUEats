const response = require('./../utils/response');
const controller = require('./../controllers/Controller');


const routes = {
    "/" : {
        GET:(_req, res) =>{
            response(res,{data : "Welcome to RUEats!" });
        }
    },
    "/users/:userID/orders/:orderID" :{
        GET : controller.getUserOrder
    },

    notFound : (_req, res) => {
        response(res, {status : 404, data : "Requested URL not found"});
    }
}
module.exports = routes

