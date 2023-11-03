const response = require('./../utils/response');
const axios = require('axios');

const getPostBodyAsync = require("./../utils/getPostBodyAsync");
const RUEatsRepository = require('./../db/RUEatsRepository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = "1234qwerasdfzxcv";
const dbRepo = new RUEatsRepository();
const saltRounds = 10;
const https = require('https');

module.exports = class Controller {

  async getUserOrder(req, res) {
    try {
      const { orderID, userID } = req.params;
      const token = req.headers.authorization;

      jwt.verify(token, secretKey, async (err, decoded) => {
        if (err) {
          response(res, { status: 401, data: { message: 'Unauthorized' } });
        } else {
          const order = await dbRepo.getOrderByOrderIDUserID(orderID, userID);
          const data = order ? order : `Order not found for OrderID: ${orderID}, UserID: ${userID}`;
          response(res, { data });
        }
      });
    } catch (error) {
      response(res, { status: 400, data: { message: error.message } });
    }
  }


  async getUsers(req, res) {
    try {
      const users = await dbRepo.getAllUsers();

      response(res, { data: users });
    } catch (error) {
      response(res, { status: 400, data: { message: error.message } });
    }
  };

  async createUser(req, res) {
    try {
      let body = req.body;
      const users = await dbRepo.getAllUsers();

      const foundUser = users.find((user) => user.name === body.name);

      if (foundUser) {
        return response(res, {
          data: { message: `'${body.name}' already exists!` },
          status: 409,
        });
      }
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashVal = bcrypt.hashSync(body.password, salt)
      body.password = hashVal;
      await dbRepo.insertUser(body);
      response(res, { status: 201, data: { message: "success" } });
    } catch (error) {
      response(res, { status: 400, data: { message: error.message } });
    }
  };


  async loginUser(req, res) {
    try {
      const body = req.body;
      const users = await dbRepo.getAllUsers();

      const user = users.find((user) => user.name === body.name || user.email === body.email);

      if (!user) {
        return response(res, {
          data: { message: 'User not found' },
          status: 404,
        });
      }
      const result = bcrypt.compareSync(body.password, user.password);

      if (result) {
        const token = jwt.sign({ name: user.name, user_id: user.user_id }, secretKey, {
          expiresIn: '1h',
        });
        response(res, { status: 200, data: { token } });
      } else {
        response(res, { status: 401, data: { message: 'Authentication failed' } });
      }
    } catch (error) {
      response(res, { status: 400, data: { message: error.message } });
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

  async createRestaurant(req, res) {
    try {
      let body = req.body;
      const restaurants = await dbRepo.getAllRestaurants();

      const foundRestaurant = restaurants.find((restaurant) => restaurant.name === body.name);

      if (foundRestaurant) {
        return response(res, {
          data: { message: `'${body.name}' already exists as a restaurant!` },
          status: 409,
        });
      }
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashVal = bcrypt.hashSync(body.password, salt);
      body.password = hashVal;
      await dbRepo.insertRestaurant(body);
      response(res, { status: 201, data: { message: "success" } });
    } catch (error) {
      response(res, { status: 400, data: { message: error.message } });
    }
  };

  async loginRestaurant(req, res) {
    try {
      const body = req.body;
      const restaurants = await dbRepo.getAllRestaurants();

      const restaurant = restaurants.find((restaurant) => restaurant.name === body.name || restaurant.email === body.email);

      if (!restaurant) {
        return response(res, {
          data: { message: 'Restaurant not found' },
        });
      }
      const result = bcrypt.compareSync(body.password, restaurant.password);

      if (result) {
        const token = jwt.sign({ name: restaurant.name, restaurant_id: restaurant.restaurant_id }, secretKey, {
          expiresIn: '1h',
        });
        response(res, { status: 200, data: { token } });
      } else {
        response(res, { status: 401, data: { message: 'Authentication failed' } });
      }
    } catch (error) {
      response(res, { status: 400, data: { message: error.message } });
    }
  };


  async getLatitudeLongitude(req, res) {
    try {
      const requestData = req.body;
      const address = requestData.address;
      const geocodingEndpoint = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_API_KEY}`;
      const token = req.headers.authorization;
      
      jwt.verify(token, secretKey, async (err, decoded) => {
        if (err) {
          response(res, { status: 401, data: { message: 'Unauthorized' } });
        } else {
          https.get(geocodingEndpoint, (geocodingResponse) => {
            let geocodingData = '';
    
            geocodingResponse.on('data', (chunk) => {
                geocodingData += chunk;
            });
    
            geocodingResponse.on('end', () => {
                try {
                    const parsedData = JSON.parse(geocodingData);
    
                    if (parsedData.status === 'OK') {
                        const data = parsedData.results[0].geometry.location;
                        response(res, { data });
                    } else {
                      response(res, { status: 400, data: {error: "Geocoding failed"} });
                    }
                } catch (error) {
                  response(res, { status: 400, data: error.message });
                }
            });
          }).on('error', (error) => {
            response(res, { status: 400, data: error.message });
          });
        }
      });    
    } catch (error) {
      response(res, { status: 400, data: error.message });
    }
  }

  async getAssociates(req, res) {
    try {
      const users = await dbRepo.getAllAssociates();

      response(res, { data: users });
    } catch (error) {
      response(res, { status: 400, data: { message: error.message } });
    }
  };

  async createAssociate(req, res) {
    try {
      let body = req.body;
      const associate = await dbRepo.getAllAssociates();

      const foundUser = associate.find((associate) => associate.name === body.name);

      if (foundUser) {
        return response(res, {
          data: { message: `'${body.name}' already exists!` },
          status: 409,
        });
      }
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashVal = bcrypt.hashSync(body.password, salt)
      body.password = hashVal;
      await dbRepo.insertAssociate(body);
      response(res, { status: 201, data: { message: "success" } });
    } catch (error) {
      response(res, { status: 400, data: { message: error.message } });
    }
  };

  async loginAssociate(req, res) {
    try {
      const body = req.body;
      const users = await dbRepo.getAllAssociates();

      const user = users.find((user) => user.name === body.name || user.email === body.email);

      if (!user) {
        return response(res, {
          data: { message: 'Delivery Associate not found' },
          status: 404,
        });
      }
      const result = bcrypt.compareSync(body.password, user.password);

      if (result) {
        const token = jwt.sign({ name: user.name, user_id: user.user_id }, secretKey, {
          expiresIn: '1h',
        });
        response(res, { status: 200, data: { token } });
      } else {
        response(res, { status: 401, data: { message: 'Authentication failed' } });
      }
    } catch (error) {
      response(res, { status: 400, data: { message: error.message } });
    }
  }

  async getRestaurantNotifications(req, res) {
    try {
      const { restaurant_id } = req.params;
      const token = req.headers.authorization;

      jwt.verify(token, secretKey, async (err, decoded) => {
        if (err) {
          response(res, { status: 401, data: { message: 'Unauthorized' } });
        } else {
          const notifications = await dbRepo.getNotificationsByRestaurantID(restaurant_id);
          const data = notifications.length ? notifications : `No notifications found for RestaurantID: ${restaurant_id}`;
          response(res, { data });
        }
      });
    } catch (error) {
      response(res, { status: 400, data: { message: error.message } });
    }
  }



  async getOrdersForRestaurant(req, res) {
    try {
        const { restaurantID } = req.params;
        const token = req.headers.authorization;

        jwt.verify(token, secretKey, async (err, decoded) => {
            if (err) {
                response(res, { status: 401, data: { message: 'Unauthorized' } });
            } else {
                const orders = await dbRepo.getOrdersByRestaurantID(restaurantID);
                const data = orders.length ? orders : `No orders found for Restaurant ID: ${restaurantID}`;
                response(res, { data });
            }
        });
    } catch (error) {
        response(res, { status: 400, data: error.message });
    }
  }


  async respondToFeedback(req, res) {
    try {
        const { restaurantID } = req.params;
        const body = await getPostBodyAsync(req);
        const { reviewID, response: feedbackResponse } = body;
        const token = req.headers.authorization;

        jwt.verify(token, secretKey, async (err, decoded) => {
            if (err) {
                response(res, { status: 401, data: { message: 'Unauthorized' } });
            } else {
                const result = await dbRepo.respondToReview(reviewID, restaurantID, feedbackResponse);
                if (result) {
                    response(res, { data: "Response added successfully!" });
                } else {
                    throw new Error("Failed to add response.");
                }
            }
        });
    } catch (error) {
        response(res, { status: 400, data: { message: error.message } });
    }
  }

  async addMenuItem(req, res) {
    try {
        const { restaurantID } = req.params;
        const token = req.headers.authorization;
        const body = await getPostBodyAsync(req);
        jwt.verify(token, secretKey, async (err, decoded) => {
            if (err) {
                response(res, { status: 401, data: { message: 'Unauthorized' } });
            } else {
                const {
                    item_name,
                    description,
                    price,
                    spice_level,
                    is_available,
                    category,
                    image_url,
                    is_featured
                } = body;

                await dbRepo.addMenuItemToMenu({
                    restaurantID,
                    item_name,
                    description,
                    price,
                    spice_level,
                    is_available,
                    category,
                    image_url,
                    is_featured
                });

                response(res, { data: { message: 'Menu item added successfully.' } });
            }
        });
    } catch (error) {
        response(res, { status: 400, data: { message: error.message } });
    }
}


  async postRestaurantReview(req, res) {
    try {
        const { restaurantID } = req.params;
        const token = req.headers.authorization;
        const body = await getPostBodyAsync(req);
        jwt.verify(token, secretKey, async (err, decoded) => {
            if (err) {
                response(res, { status: 401, data: { message: 'Unauthorized' } });
            } else {
                const { review_title, description, stars, media } = body;
                const author_id = decoded.user_id;
                const reviewId = await dbRepo.addReview(review_title, description, stars, media, author_id, restaurantID);
                if (reviewId) {
                    response(res, { data: "Review added successfully!", reviewId });
                } else {
                    throw new Error("Failed to add review.");
                }
            }
        });
    } catch (error) {
        response(res, { status: 400, data: { message: error.message } });
    }
  }


  async getRestaurantInsights(req, res) {
    try {
      const { restaurantID } = req.params;
      const insights = await dbRepo.getInsightsByRestaurantID(restaurantID);
      response(res, { data: insights });
    } catch (error) {
      response(res, { status: 400, data: error.message });
    }
  }

  async deleteMenuItem(req, res) {
    try {
        const { restaurantID, itemID } = req.params;
        const token = req.headers.authorization;

        jwt.verify(token, secretKey, async (err, decoded) => {
            if (err) {
                response(res, { status: 401, data: { message: 'Unauthorized' } });
            } else {
                const result = await dbRepo.deleteMenuItem(restaurantID, itemID);
                if (result.affectedRows > 0) {
                    response(res, { data: "Menu item deleted successfully!" });
                } else {
                    throw new Error("Menu item not found or failed to delete.");
                }
            }
        });
    } catch (error) {
        response(res, { status: 400, data: { message: error.message } });
    }
  }

  async setLocationDeliveryAssociates(req, res) {
    try {
      const requestData = req.body;
      const latitude = requestData.latitude;
      const longitude = requestData.longitude;
      const associate_id = requestData.associate_id;

      const token = req.headers.authorization;
      
      jwt.verify(token, secretKey, async (err, decoded) => {
        if (err) {
          response(res, { status: 401, data: { message: 'Unauthorized' } });
        } else {
          await dbRepo.updateDeliveryAssociatesLocation(associate_id,latitude,longitude);
          response(res, { status: 201, data: {message: "success"} });
        }
      });
     
    } catch (error) {
      response(res, { status: 400, data: error.message });
    }
  }

   
  async getClosestAssociate(req, res) {
    try {
      const token = req.headers.authorization;

      jwt.verify(token, secretKey, async (err, decoded) => {
        if (err) {
          response(res, { status: 401, data: { message: 'Unauthorized' } });
        } else {
            const delivery_associates = await dbRepo.getFreeDeliveryAssociate();
            let destinations = [];
        
            for (let index = 0; index < delivery_associates.length; index++) {
              const row = delivery_associates[index];
              const coordinateString = `${row.latitude},${row.longitude}`;
              destinations.push(coordinateString);
            }
        
            const { originLatitude, originLongitude } = req.body;
            const origin = originLatitude + ',' + originLongitude;
        
            let closestDistance = Infinity;
            let closestPoint = null;
        
            await Promise.all(
              destinations.map(async (destination, index) => {
                try {
                  const response = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${process.env.GOOGLE_API_KEY}`);
        
                  if (response.data.status === 'OK') {
                    const distance = response.data.rows[0].elements[0].distance.value;
        
                    if (distance < closestDistance) {
                      closestDistance = distance;
                      closestPoint = destinations[index];
                    }
                  } else {
                    console.error('Google Maps API returned a non-OK status:', response.data.status);
                  }
                } catch (error) {
                  console.error('Error fetching data from the Google Maps API:', error);
                }
              })
            );
        
          if (closestPoint) {
            const indexOfClosestPoint = destinations.indexOf(closestPoint);
      
            if (indexOfClosestPoint !== -1) {
              const closestAssociate = delivery_associates[indexOfClosestPoint];
              response(res, { data: closestAssociate });
            } else {
              response(res, { data: 'No associate found for the closest point' });
            }
          } else {
            response(res, { data: 'No valid closest point found' });
          }
        }
      });
    } catch (error) {
      response(res, { status: 400, data: error.message });
    }
  }
  
};
