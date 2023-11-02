const DatabaseConfig = require("./../../config/DatabaseConfig");
module.exports = class RUEatsRepository {
  constructor() {
    this.connection = new DatabaseConfig().connection;
  }
    // Function to insert a new user into the users database
    insertUser(newUser) {
    return new Promise((resolve, reject) => {
      try {
        const query = 'INSERT INTO users (name, email, password, home_address, zip_code, city, state) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const values = [
          newUser.name,
          newUser.email,
          newUser.password,
          newUser.home_address || null,
          newUser.zip_code || null,
          newUser.city || null,
          newUser.state || null,
        ];
  
        this.connection.query(query, values, (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  
  // Function to retrieve all users from the users database
    getAllUsers() {
    return new Promise((resolve, reject) => {
      try {
        // Select all users from the users table
        const query = 'SELECT * FROM users';
        this.connection.query(query, (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
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
                    resolve(results.affectedRows > 0);
                }
            }
        );
    });
  }

  addMenuItem(restaurantID, itemName, description, price, spiceLevel, isAvailable, category, imageUrl, isFeatured) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO menu (item_name, restaurant_id, description, price, spice_level, is_available, category, image_url, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        this.connection.query(
            query,
            [itemName, restaurantID, description, price, spiceLevel, isAvailable, category, imageUrl, isFeatured],
            function (error, results, fields) {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.insertId);
                }
            }
        );
    });
  }

  addReview(review_title, description, stars, media, author_id, restaurant_id) {
    return new Promise((resolve, reject) => {
        const date_created = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const query = 'INSERT INTO reviews (review_title, description, stars, media, author_id, restaurant_id, date_created) VALUES (?, ?, ?, ?, ?, ?, ?)';
        this.connection.query(query, [review_title, description, stars, media, author_id, restaurant_id, date_created], function (error, results) {
            if (error) {
                reject(error);
            } else {
                resolve(results.insertId);
            }
        });
    });
  }

  getInsightsByRestaurantID(restaurantID) {
    return new Promise(async (resolve, reject) => {
        try {
            // Get number of times ordered from the restaurant
            const orderCount = await this._getOrderCount(restaurantID);

            // Get average rating for the restaurant
            const averageRating = await this._getAverageRating(restaurantID);

            // Get total earnings for the restaurant
            const totalEarnings = await this._getTotalEarnings(restaurantID);

            // Get number of orders in each status
            const orderStatusCounts = await this._getOrderStatusCounts(restaurantID);

            resolve({
                orderCount,
                averageRating,
                totalEarnings,
                orderStatusCounts
            });
        } catch (error) {
            reject(error);
        }
    });
}

_getOrderCount(restaurantID) {
    return new Promise((resolve, reject) => {
        this.connection.query('SELECT COUNT(*) as count FROM orders WHERE restaurant_id = ?', [restaurantID], function (error, results) {
            if (error) {
                reject(error);
            } else {
                resolve(results[0].count);
            }
        });
    });
}

_getAverageRating(restaurantID) {
    return new Promise((resolve, reject) => {
        this.connection.query('SELECT AVG(stars) as averageRating FROM reviews WHERE restaurant_id = ?', [restaurantID], function (error, results) {
            if (error) {
                reject(error);
            } else {
                resolve(results[0].averageRating);
            }
        });
    });
}

_getTotalEarnings(restaurantID) {
    return new Promise((resolve, reject) => {
        this.connection.query('SELECT SUM(total_amount) as totalEarnings FROM orders WHERE restaurant_id = ?', [restaurantID], function (error, results) {
            if (error) {
                reject(error);
            } else {
                resolve(results[0].totalEarnings);
            }
        });
    });
}

_getOrderStatusCounts(restaurantID) {
    return new Promise((resolve, reject) => {
        this.connection.query('SELECT status, COUNT(*) as count FROM orders WHERE restaurant_id = ? GROUP BY status', [restaurantID], function (error, results) {
            if (error) {
                reject(error);
            } else {
                let counts = {0: 0, 1: 0, 2: 0, 3: 0};
                results.forEach(result => {
                    counts[result.status] = result.count;
                });
                resolve(counts);
            }
        });
    });
  }
  
}
