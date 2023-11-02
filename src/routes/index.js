const response = require("./../utils/response");
const controllerClass = require("./../controllers/Controller");
const controller = new controllerClass();

const routes = {
  "/": {
    GET: (_req, res) => {
      response(res, { data: "Welcome to RUEats!" });
    },
  },
  "/users/:userID/orders/:orderID": {
    GET: controller.getUserOrder,
  },
  "/restaurants": {
    GET: controller.getAllRestaurants,
  },

  notFound: (_req, res) => {
    response(res, { status: 404, data: "Requested URL not found" });
  },
  "/order-history/:restaurantID/orders" : {
      GET: controller.getOrdersForRestaurant
  },
  notFound : (_req, res) => {
      response(res, {status : 404, data : "Requested URL not found"});
  },
  "/respond-feedback/:restaurantID" : {
      POST : controller.respondToFeedback
  },
  notFound : (_req, res) => {
      response(res, {status : 404, data : "Requested URL not found"});
  }    
};
module.exports = routes;
