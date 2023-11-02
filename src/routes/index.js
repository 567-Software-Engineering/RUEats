const response = require('./../utils/response');
const controllerClass = require('./../controllers/Controller');
const validateUserData = require('./../validations/validateUserData');
const validateLocationData = require('./../validations/validateLocationData');

const controller = new controllerClass();

const routes = {
    "/" : {
        GET:(_req, res) =>{
            response(res,{data : "Welcome to RUEats!" });
        }
    },
    "/users/login":{
        POST: (req, res) => {
            validateUserData(req, res, controller.loginUser);
          },
    },
    "/users/register": {
        POST: (req, res) => {
          validateUserData(req, res, controller.createUser);
        },
      },
    //   "/users/:id": {
    //     GET: controller.getUserById,
    //     DELETE: controller.deleteUserById,
    //     PUT: (req, res) => {
    //       validateUserData(req, res, userController.updateUser);
    //     },
    //   },
    "/users/:userID/orders/:orderID" :{
        GET : controller.getUserOrder
    },
    "/restaurants": {
        GET: controller.getAllRestaurants,
      },
      
    "/get-location":{
      POST: (req, res) => {
        validateLocationData(req, res, controller.getLatitudeLongitude);
      },
    },

    "/delivery-associate/login":{
      POST: (req, res) => {
          validateUserData(req, res, controller.loginAssociate);
        },
    },
    "/delivery-associate/register": {
        POST: (req, res) => {
          validateUserData(req, res, controller.createAssociate);
        },
      },
      "/restaurants/login": {
        POST: (req, res) => {
            validateUserData(req, res, controller.loginRestaurant);
        },
    },
    "/restaurants/register": {
        POST: (req, res) => {
            validateUserData(req, res, controller.createRestaurant);
        },
    },
  "/get-notifications/:restaurant_id/notifications": {
    GET: controller.getRestaurantNotifications
  },


    notFound : (_req, res) => {
        response(res, {status : 404, data : "Requested URL not found"});
    }
}
module.exports = routes

