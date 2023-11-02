const response = require('./../utils/response');
const controllerClass = require('./../controllers/Controller');
const validateUserData = require('./../validations/validateUserData');
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

    notFound : (_req, res) => {
        response(res, {status : 404, data : "Requested URL not found"});
    }
}
module.exports = routes

