const response = require('./../utils/response');
const controllerClass = require('./../controllers/Controller');
const validateUserData = require('./../validations/validateUserData');
const validateLocationData = require('./../validations/validateLocationData');
const validateSetLocationData = require('./../validations/validateSetLocationData');
const validatePostRequests = require('./../validations/validatePostRequests');
const validateGetTimeEstimate = require('./../validations/validateGetTimeEstimate');
const validateRestaurantData = require('./../validations/validateRestaurantData');
const validatePaymentToken = require('./../validations/validatePaymentToken');
const validateDeliveryAssociate = require('../validations/validateDeliveryAssociate');

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

    "/users/:user_id": {
      GET: controller.getUserById,
      DELETE: controller.deleteUserById,
      PUT: (req, res) => {
        validateUserData(req, res, controller.updateUserProfile);
      },
    },

    "/users/:userID/orders/:orderID" :{
      GET : controller.getUserOrder
    },

    "/users/:userID/orders": {
      GET: controller.getUserOrderHistory
    },

    "/restaurants": {
      GET: controller.getAllRestaurants,
    },

    "/restaurants/:restaurant_id": {
      GET: controller.getRestaurant,
      PUT: (req, res) => {
        validateRestaurantData(req, res, controller.updateRestaurantProfile);
      },
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

    "/get-active-orders/:restaurant_id/orders": {
        GET: controller.getActiveRestaurantOrders
      },

    "/set-location":{
      POST: (req, res) => {
        validateSetLocationData(req, res, controller.setLocationDeliveryAssociates);
      },
    },
    
    "/findRider": {
      POST: (req, res) => {
        validateDeliveryAssociate(req, res, controller.getClosestAssociate);
      },
    },     
    
    "/order-history/:restaurantID/orders" : {
      GET : controller.getOrdersForRestaurant
    },

    "/respond-feedback/:restaurantID" : {
      PUT : (req, res) => {
          validatePostRequests(req, res, controller.respondToFeedback);
        },
    },

    "/add-menu/:restaurantID": {
      POST : (req, res) => {
          validatePostRequests(req, res, controller.addMenuItem);
        },
    },

    "/modify-menu/:restaurantID": {
      PUT : (req, res) => {
          validatePostRequests(req, res, controller.updateMenuItem);
        }, 
    },

    "/delete-item/:restaurantID/:itemID": {
      DELETE : controller.deleteMenuItem
    },

    "/get-menu/:restaurantID": {
        GET : controller.getRestaurantMenu
    },

    "/update-item-availability/:restaurantID": {
      PUT: (req, res) => {
          validatePostRequests(req, res, controller.toggleItemAvailability);
        },
    },

    "/restaurants/:restaurantID/reviews" : {
      POST : (req, res) => {
          validatePostRequests(req, res, controller.postRestaurantReview);
        },

    },

    "/restaurants-reviews/:restaurantID" : {

        GET : (req, res) => {controller.getRestaurantReviews(req,res)},

    },

    "/view-insights/:restaurantID/insights": {
        GET : controller.getRestaurantInsights
    },

    "/respond-feedback/:restaurantID" : {
        PUT : (req, res) => {
          validatePostRequests(req, res, controller.respondToFeedback);
        },
    },

    "/add-menu/:restaurantID/menu": {
        POST : (req, res) => {
          validatePostRequests(req, res, controller.addMenuItem);
        },
    },

    "/restaurants/:restaurantID/reviews" : {
        POST : (req, res) => {
          validatePostRequests(req, res, controller.postRestaurantReview);
        },
    },

    "/view-insights/:restaurantID/insights": {
        GET : controller.getRestaurantInsights
    },

    "/delete-item/:restaurantID/:itemID": {
        DELETE : controller.deleteMenuItem
    },

    "/deactivate-restaurant/:restaurantID": {
      PATCH : controller.deactivateRestaurant
    },

    "/update-restaurant/:restaurantID" : {
      PUT : (req, res) => {
          validatePostRequests(req, res, controller.updateRestaurantDetails);
      },
  },

    "/payment-form": {
      GET: controller.servePaymentForm,
    },
  
    "/payment-client-token": {
      GET: controller.getClientPaymentToken,
    },
  
    "/submit-token": {
      POST: (req, res) => {
        validatePaymentToken(req, res, controller.submitPayment);
      },
    },

    "/get-delivery-assignment/:associateID": {
      GET: controller.getDeliveryAssignment,
    },
    
    "/get-previous-delivery-assignments/:associateID": {
      GET: controller.getPreviousDeliveryAssignments,
    },

    "/update-delivery-status/:associateID": {
      PATCH : (req, res) => {
        validatePostRequests(req, res, controller.updateDeliveryStatus);
      },
    },

    "/update-location/:associateID": {
      PATCH : (req, res) => {
        validatePostRequests(req, res, controller.updateLocation);
      },
    },

    "/validate-delivery/:orderID": {
      PATCH: (req, res) => {
        validatePostRequests(req, res, controller.validateDelivery);
      },
    },

    "/update-cart": {
      PATCH: (req, res) => {
        validatePostRequests(req, res, controller.updateCart);
      },
    },

    "/clear-cart/:userID": {
      DELETE: controller.clearCart,
    },

    "/get-cart/:userID": {
      GET: controller.getCart,
    },

    "/add-order": {
      POST: (req, res) => {
        validatePostRequests(req, res, controller.addOrder);
      },
    },

    "/accept-decline-order/:restaurant_id/:order_id": {
        PATCH: (req, res) => {
            validatePostRequests(req, res, controller.acceptOrDeclineOrder);
        } 
    },
    "/delivery-associate/:associate_id": {
      GET: controller.getAssociateById,
      DELETE: controller.deleteAssociateById,
      PUT: (req, res) => {
        validateUserData(req, res, controller.updateDeliveryAssociateProfile);
      },
    },

    "/get-time-estimate":{
      POST: (req, res) => {
        validateGetTimeEstimate(req, res, controller.getTimeEstimate);
      },
    },

    "/get-route":{
      POST: (req, res) => {
        validateGetTimeEstimate(req, res, controller.getRoute);
      },
    },
    "/verify/:user_id": {
      GET: controller.updateUserVerification,
    },
    
    "/verifyAssociate/:associate_id": {
      GET: controller.updateDeliveryAssociateVerification,
    },

    "/get-active-orders/:restaurant_id/orders/:order_id": {
      GET: controller.getOrderDetailsById,
    },

    "/verifyRestaurant/:restaurant_id": {
      GET: controller.updateRestaurantVerification,
    },

    "/users/updatePassword": {
      PUT: (req, res) => {
        validatePostRequests(req, res, controller.changePassword);
      },
    },

    notFound: (_req, res) => {
        response(res, { status: 404, data: "Requested URL not found" });

    }
}
module.exports = routes

