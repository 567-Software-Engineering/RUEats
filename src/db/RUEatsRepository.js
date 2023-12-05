const DatabaseConfig = require("./../../config/DatabaseConfig");
module.exports = class RUEatsRepository {
  constructor() {
    this.connection = new DatabaseConfig().connection;
  }
  // Function to insert a new user into the users database
  insertUser(newUser) {
    return new Promise((resolve, reject) => {
      try {
        const query = 'INSERT INTO users (name, email, password, home_address, zip_code, city, state, verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [
          newUser.name,
          newUser.email,
          newUser.password,
          newUser.home_address || null,
          newUser.zip_code || null,
          newUser.city || null,
          newUser.state || null,
          'false'
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

  insertRestaurant(newRestaurant) {
    return new Promise((resolve, reject) => {
      try {
        const query = 'INSERT INTO restaurants (name, email, phone_number, address, cuisine_type, rating, operating_hours, is_active, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [
          newRestaurant.name,
          newRestaurant.email,
          newRestaurant.phone_number,
          newRestaurant.address,
          newRestaurant.cuisine_type,
          newRestaurant.rating || null, // Assuming it can be null
          newRestaurant.operating_hours || null, // Assuming it can be null
          newRestaurant.is_active || true, // Assuming default is active 
          newRestaurant.password
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
        const query = 'INSERT INTO delivery_associates (name, email, home_address, zip_code, city, state, latitude, longitude, delivery_in_progress, password, verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
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
          "false",
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

  updateAssociateVerifiedStatus(associate_id) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE delivery_associates SET verified = 'true' WHERE associate_id = ?`;
      this.connection.query(query, [associate_id], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.affectedRows > 0);
        }
      });
    });
  }

  getNotificationsByRestaurantID(restaurantID) {
    return new Promise((resolve, reject) => {
      this.connection.query('SELECT * FROM orders WHERE restaurant_id = ? AND status = 0', [restaurantID], function (error, results, fields) {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }
  
  getActiveOrdersByRestaurantID(restaurantID) {
    return new Promise((resolve, reject) => {
      this.connection.query('SELECT * FROM orders WHERE restaurant_id = ? AND status IN (0,1)', [restaurantID], function (error, results, fields) {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
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

  addMenuItemToMenu({ restaurantID, item_name, description, price, spice_level, is_available, category, image_url, is_featured }) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO menu (item_name, restaurant_id, description, price, spice_level, is_available, category, image_url, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        this.connection.query(query, [item_name, restaurantID, description, price, spice_level, is_available, category, image_url, is_featured], function (error, results, fields) {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
  }

  updateMenuItem(restaurantID, itemData) {
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE menu
            SET item_name = ?, description = ?, price = ?, spice_level = ?, 
                is_available = ?, category = ?, image_url = ?, is_featured = ?
            WHERE item_id = ? AND restaurant_id = ?
        `;

        this.connection.query(query, [
            itemData.item_name,
            itemData.description,
            itemData.price,
            itemData.spice_level,
            itemData.is_available,
            itemData.category,
            itemData.image_url,
            itemData.is_featured,
            itemData.item_id,
            restaurantID
        ], function (error, results, fields) {
            if (error) {
                reject(error);
            } else {
                resolve(results.affectedRows > 0);
            }
        });
    });
  }

  toggleItemAvailability(restaurantID, itemID, isAvailable) {
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE menu
            SET is_available = ?
            WHERE item_id = ? AND restaurant_id = ?
        `;

        this.connection.query(query, [
            isAvailable,
            itemID,
            restaurantID
        ], function (error, results, fields) {
            if (error) {
                reject(error);
            } else {
                resolve(results.affectedRows > 0);
            }
        });
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

  hasUserOrderedFromRestaurant(author_id, restaurant_id) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT EXISTS(SELECT 1 FROM orders WHERE user_id = ? AND restaurant_id = ? LIMIT 1) as hasOrdered';
        this.connection.query(query, [author_id, restaurant_id], function (error, results) {
            if (error) {
                reject(error);
            } else {
                resolve(results[0].hasOrdered);
            }
        });
    });
  }


  deleteMenuItem(restaurantID, itemID) {
    return new Promise((resolve, reject) => {
        this.connection.query('DELETE FROM menu WHERE item_id = ? AND restaurant_id = ?', [itemID, restaurantID], function (error, results) {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
  }

  getInsightsByRestaurantID(restaurantID) {
    return new Promise(async (resolve, reject) => {
        try {
            const orderCount = await this._getOrderCount(restaurantID);
            const averageRating = await this._getAverageRating(restaurantID);
            const totalEarnings = await this._getTotalEarnings(restaurantID);
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

  addMenuItemToMenu({ restaurantID, item_name, description, price, spice_level, is_available, category, image_url, is_featured }) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO menu (item_name, restaurant_id, description, price, spice_level, is_available, category, image_url, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        this.connection.query(query, [item_name, restaurantID, description, price, spice_level, is_available, category, image_url, is_featured], function (error, results, fields) {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
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

  hasUserOrderedFromRestaurant(author_id, restaurant_id) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT EXISTS(SELECT 1 FROM orders WHERE user_id = ? AND restaurant_id = ? LIMIT 1) as hasOrdered';
        this.connection.query(query, [author_id, restaurant_id], function (error, results) {
            if (error) {
                reject(error);
            } else {
                resolve(results[0].hasOrdered);
            }
        });
    });
  }


  deleteMenuItem(restaurantID, itemID) {
    return new Promise((resolve, reject) => {
        this.connection.query('DELETE FROM menu WHERE item_id = ? AND restaurant_id = ?', [itemID, restaurantID], function (error, results) {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
  }

  deactivateRestaurant(restaurantID) {
    return new Promise((resolve, reject) => {
        this.connection.query('UPDATE restaurants SET is_active = 0 WHERE restaurant_id = ?', [restaurantID], function (error, results) {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}



  getInsightsByRestaurantID(restaurantID) {
    return new Promise(async (resolve, reject) => {
        try {
            const orderCount = await this._getOrderCount(restaurantID);
            const averageRating = await this._getAverageRating(restaurantID);
            const totalEarnings = await this._getTotalEarnings(restaurantID);
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

  updateDeliveryAssociatesLocation(associate_id, latitude, longitude) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        "UPDATE delivery_associates SET latitude = ? , longitude = ? WHERE associate_id = ?",
        [latitude, longitude, associate_id],
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
  getFreeDeliveryAssociate() {
    return new Promise((resolve, reject) => {
      this.connection.query(
        "SELECT * FROM delivery_associates WHERE delivery_in_progress = 0",
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

  updateRestaurantDetails(restaurantID, updatedDetails) {
    return new Promise((resolve, reject) => {
        // Check if there's anything to update
        if (Object.keys(updatedDetails).length === 0) {
            resolve(false);
            return;
        }

        let queryString = 'UPDATE restaurants SET ';
        const queryParams = [];
        const updateFields = [];

        // Build the dynamic query
        for (const [key, value] of Object.entries(updatedDetails)) {
            if (["name", "email", "phone_number", "address", "cuisine_type", "rating", "operating_hours", "is_active"].includes(key)) {
                updateFields.push(`${key} = ?`);
                queryParams.push(value);
            }
        }

        queryString += updateFields.join(', ');
        queryString += ' WHERE restaurant_id = ?';
        queryParams.push(restaurantID);

        this.connection.query(queryString, queryParams, function (error, results, fields) {
            if (error) {
                reject(error);
            } else {
                resolve(results.affectedRows > 0);
            }
        });
    });
}

  getFreeDeliveryAssociate() {
    return new Promise((resolve, reject) => {
      this.connection.query(
        "SELECT * FROM delivery_associates WHERE delivery_in_progress = 0",
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

  updateOrderStatus(orderID, restaurantID, status) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        'UPDATE orders SET status = ? WHERE order_id = ? AND restaurant_id = ?',
        [status, orderID, restaurantID],
        function (error, results) {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
    });
  }

  getUserByIdDB(user_id) {
    return new Promise((resolve, reject) => {
      try {
        const query = 'SELECT * FROM users WHERE user_id = ?';
        this.connection.query(query, [user_id], (error, results) => {
          if (error) {
            console.error('Database error:', error);
            reject(error);
          } else {
            if (results.length > 0) {
              resolve(results[0]);
            } else {
              resolve(null);
            }
          }
        });
      } catch (error) {
        console.error('Error in getUserByIdDB:', error);
        reject(error);
      }
    });
  }

  async deleteUserById(user_id) {
    return new Promise((resolve, reject) => {
      try {
        const query = 'DELETE FROM users WHERE user_id = ?';
        this.connection.query(query, [user_id], (error, results) => {
          if (error) {
            console.error('Database error:', error);
            reject(error);
          } else {
            if (results.affectedRows > 0) {
              resolve({ message: 'User deleted successfully', status: 200 });
            } else {
              resolve({ message: 'User not found', status: 404 });
            }
          }
        });
      } catch (error) {
        console.error('Error in deleteUserById:', error);
        reject(error);
      }
    });
  }


    async getRestaurantMenu(restaurant_id) {
        return new Promise((resolve, reject) => {
            try {
                const query = 'SELECT * FROM menu m WHERE restaurant_id = ?';
                this.connection.query(query, [restaurant_id], (error, results) => {
                    if (error) {
                        console.error('Database error:', error);
                        reject(error);
                    } else {
                        if (results.length > 0) {
                            resolve(results);
                        } else {
                            resolve(null);
                        }
                    }
                });
            } catch (error) {
                console.error('Error in deleteUserById:', error);
                reject(error);
            }
        });
    }

    async deleteUserByEmail(email) {
        return new Promise((resolve, reject) => {
            try {
                const query = 'DELETE FROM users WHERE email = ?';
                this.connection.query(query, [email], (error, results) => {
                    if (error) {
                        console.error('Database error:', error);
                        reject(error);
                    } else {
                        if (results.affectedRows > 0) {
                            resolve({ message: 'User deleted successfully', status: 200 });
                        } else {
                            resolve({ message: 'User not found', status: 404 });
                        }
                    }
                });
            } catch (error) {
                console.error('Error in deleteUserByEmail:', error);
                reject(error);
            }
        });
    }
  
  async updateUserProfileInDB(user_id, updates) {
    return new Promise((resolve, reject) => {
      const updateFields = [];
      const updateValues = [];
  
      // Create a dynamic SQL query with placeholders for updates
      const placeholders = [];
      for (const field in updates) {
        if (field !== 'email' && updates[field] !== undefined) {
          updateFields.push(`${field} = ?`);
          updateValues.push(updates[field]);
          placeholders.push('?');
        }
      }
  
      if (updateFields.length === 0) {
        resolve(false); // No valid updates provided
        return;
      }
  
      const query = `UPDATE users SET ${updateFields.join(', ')} WHERE user_id = ?`;
      this.connection.query(query, [...updateValues, user_id], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.affectedRows > 0);
        }
      });
    });
  }
  

  async getAssocaiteByIdDB(associate_id) {
    return new Promise((resolve, reject) => {
      try {
        const query = 'SELECT * FROM delivery_associates WHERE associate_id = ?';
        this.connection.query(query, [associate_id], (error, results) => {
          if (error) {
            console.error('Database error:', error);
            reject(error);
          } else {
            if (results.length > 0) {
              resolve(results[0]);
            } else {
              resolve(null);
            }
          }
        });
      } catch (error) {
        console.error('Error in getAssociateByIdDB:', error);
        reject(error);
      }
    });
  }

  async deleteAssociateByIdDB(associate_id) {
    return new Promise((resolve, reject) => {
      try {
        const query = 'DELETE FROM delivery_associates WHERE associate_id = ?';
        this.connection.query(query, [associate_id], (error, results) => {
          if (error) {
            console.error('Database error:', error);
            reject(error);
          } else {
            if (results.affectedRows > 0) {
              resolve({ message: 'Associate deleted successfully', status: 200 });
            } else {
              resolve({ message: 'Associate not found', status: 404 });
            }
          }
        });
      } catch (error) {
        console.error('Error in deleteAssociateByIdDB:', error);
        reject(error);
      }
    });
  }

  async updateAssociateProfileInDB(associate_id, updates) {
    return new Promise((resolve, reject) => {
      const updateFields = [];
      const updateValues = [];
  
      // Create a dynamic SQL query with placeholders for updates
      const placeholders = [];
      for (const field in updates) {
        if (field !== 'email' || updates[field] !== null) {
          updateFields.push(`${field} = ?`);
          updateValues.push(updates[field]);
          placeholders.push('?');
        }
      }
  
      if (updateFields.length === 0) {
        resolve(false); // No valid updates provided
        return;
      }
  
      const query = `UPDATE delivery_associates SET ${updateFields.join(', ')} WHERE associate_id = ?`;
      this.connection.query(query, [...updateValues, associate_id], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.affectedRows > 0);
        }
      });
    });
  }
  
  
  async updateUserVerifiedStatus(user_id) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE users SET verified = ? WHERE user_id = ?`;
      this.connection.query(query, [true, user_id], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.affectedRows > 0);
        }
      });
    });
  }

  async deleteAssociateByEmail(email) {
    return new Promise((resolve, reject) => {
        try {
            const query = 'DELETE FROM delivery_associates WHERE email = ?';
            this.connection.query(query, [email], (error, results) => {
                if (error) {
                    console.error('Database error:', error);
                    reject(error);
                } else {
                    if (results.affectedRows > 0) {
                        resolve({ message: 'Delivery Associate deleted successfully', status: 200 });
                    } else {
                        resolve({ message: 'User not found', status: 404 });
                    }
                }
            });
        } catch (error) {
            console.error('Error in deleteAssociateByEmail:', error);
            reject(error);
        }
    });
}
  

  async getDeliveryAssociateOrder(associateID) {
    return new Promise((resolve, reject) => {
      try {
        const query = 'SELECT * FROM orders WHERE associate_id = ?';
        this.connection.query(query, [associateID], (error, results) => {
          if (error) {
            console.error('Database error:', error);
            reject(error);
          } else {
            if (results.length > 0) {
              resolve(results[0]);
            } else {
              resolve(null);
              // console.log("No orders found");
            }
          }
        });
      } catch (error) {
        console.error('Error in getDeliveryAssociateOrder:', error);
        reject(error);
      }
    });
  }

  async updateDeliveryStatus(associate_id, status) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE orders SET status = ? WHERE associate_id = ?`;
      this.connection.query(query, [status, associate_id], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.affectedRows > 0);
        }
      });
    });
  }

  async updateLocation(associate_id, latitude, longitude) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE delivery_associates SET latitude = ?, longitude = ? WHERE associate_id = ?`;
      this.connection.query(query, [latitude, longitude, associate_id], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.affectedRows > 0);
        }
      });
    });
  }
  
  async imageURLtoDB(orderID, imageURL) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE orders SET img_src = ? WHERE order_id = ?`;
      this.connection.query(query, [imageURL, orderID], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.affectedRows > 0);
        }
      });
    });
  }



}