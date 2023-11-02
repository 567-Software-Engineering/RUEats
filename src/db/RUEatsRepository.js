const DatabaseConfig = require("./../../config/DatabaseConfig");
module.exports = class RUEatsRepository {
  constructor() {
    this.connection = new DatabaseConfig().connection;
  }

  getOrderByOrderIDUserID(orderID, userID) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        "SELECT * FROM orders WHERE order_id = ? AND user_id = ?",
        [orderID, userID],
        function (error, results, fields) {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
    });
  }

  getAllRestaurants() {
    return new Promise((resolve, reject) => {
      this.connection.query(
        "SELECT * FROM restaurants WHERE is_active = 1",
        function (error, results, fields) {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
    });
  }

  getOrdersByRestaurantID(restaurantID) {
    return new Promise((resolve, reject) => {
        this.connection.query('SELECT * FROM orders WHERE restaurant_id = ?', [restaurantID], function (error, results, fields) {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
  }
  respondToReview(reviewID, restaurantID, response) {
    return new Promise((resolve, reject) => {
        this.connection.query(
            'UPDATE reviews SET response = ? WHERE review_id = ? AND restaurant_id = ?',
            [response, reviewID, restaurantID],
            function (error, results, fields) {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.affectedRows > 0);  // if any rows were updated, it returns true
                }
            }
        );
    });
}
};
