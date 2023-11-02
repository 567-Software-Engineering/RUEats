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
};
