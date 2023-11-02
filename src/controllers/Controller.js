const response = require("./../utils/response");
const RUEatsRepository = require("./../db/RUEatsRepository");
const dbRepo = new RUEatsRepository();

module.exports = class Controller {
  async getUserOrder(req, res) {
    try {
      const { orderID, userID } = req.params;
      const order = await dbRepo.getOrderByOrderIDUserID(orderID, userID);
      const data = order
        ? order
        : `Order not found for OrderID: ${orderID}, UserID: ${userID}`;
      response(res, { data });
    } catch (error) {
      response(res, { status: 400, data: error.message });
    }
  }

  async getAllRestaurants(req, res) {
    try {
      const restaurants = await dbRepo.getAllRestaurants();
      const data =
        restaurants && restaurants.length > 0
          ? restaurants
          : "No active restaurants found";
      response(res, { data });
    } catch (error) {
      response(res, { status: 400, data: error.message });
    }
  }

  async getOrdersForRestaurant(req, res) {
    try {
        const { restaurantID } = req.params;
        const orders = await dbRepo.getOrdersByRestaurantID(restaurantID);
        const data = orders.length ? orders : `No orders found for Restaurant ID: ${restaurantID}`;
        response(res, {data});
    } catch(error) {
        response(res, {status: 400, data: error.message});
    }
  }
  async respondToFeedback(req, res) {
    try {
        const { restaurantID } = req.params;
        const { reviewID, response } = req.body; // assuming the review ID and the response text are sent in the request body

        const result = await dbRepo.respondToReview(reviewID, restaurantID, response);
        if(result) {
            response(res, {data: "Response added successfully!"});
        } else {
            throw new Error("Failed to add response.");
        }
    } catch(error) {
        response(res, {status: 400, data: error.message});
    }
  }
};
