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


  getAllAssociates() {
    return new Promise((resolve, reject) => {
      try {
        // Select all users from the users table
        const query = 'SELECT * FROM delivery_associates';
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

  insertAssociate(newUser) {
    return new Promise((resolve, reject) => {
      try {
        const query = 'INSERT INTO delivery_associates (name, email, home_address, zip_code, city, state, latitude, longitude, delivery_in_progress, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [
          newUser.name,
          newUser.email,
          newUser.home_address || null,
          newUser.zip_code || null,
          newUser.city || null,
          newUser.state || null,
          newUser.latitude || null,
          newUser.longitude || null,
          newUser.delivery_in_progress || 0, // Assuming it's a boolean or integer field
          newUser.password,
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

  updateOrderStatus(orderID, restaurantID, status) {
    return new Promise((resolve, reject) => {
        this.connection.query(
            'UPDATE orders SET status = ? WHERE order_id = ? AND restaurant_id = ?',
            [status, orderID, restaurantID],
            function(error, results) {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            }
        );
    });
}

}