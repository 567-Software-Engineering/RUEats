const nodemailer = require('nodemailer');

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
const fs = require('fs');

const stripe = require('stripe')(
  process.env.PAYMENT_SECRET_KEY
);


module.exports = class Controller {

  constructor() {
    this.createUser = this.createUser.bind(this);
  }


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
  };


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

      // await sendVerificationEmail(body.email, user);
  
      // // Save the verification code and status in the user's record
      // await dbRepo.insertUser({ ...body, verified: false });

      await dbRepo.insertUser(body);

      // await dbRepo.insertUser({ ...body, verified: false });
      

      const updatedUsers = await dbRepo.getAllUsers();
      const newFoundUser = updatedUsers.find((user) => user.email === body.email);
      const userIDNew = newFoundUser.user_id


      this.sendEmail(body.email, userIDNew);
  
      // // Save the verification code and status in the user's record
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

      if (user.verified === 'false') {
        return response(res, {
          data: { message: 'Email not verified. Please check your email for a verification link.' },
          status: 401,
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
                  response(res, { status: 400, data: { error: "Geocoding failed" } });
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

          if (decoded.restaurant_id !== parseInt(restaurantID)) {
            response(res, { status: 403, data: { message: 'Forbidden: Cannot view notifications for other restaurants.' } });
            return;
          }
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
      const { reviewID, response: feedbackResponse } = req.body;
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
      jwt.verify(token, secretKey, async (err, decoded) => {
        if (err) {
          response(res, { status: 401, data: { message: 'Unauthorized' } });
        } else {
          if (decoded.restaurant_id === parseInt(restaurantID)) {
            const {
              item_name,
              description,
              price,
              spice_level,
              is_available,
              category,
              image_url,
              is_featured
            } = req.body;

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
          else {
            response(res, { status: 403, data: { message: 'Forbidden' } });
          }
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
      jwt.verify(token, secretKey, async (err, decoded) => {
        if (err) {
          response(res, { status: 401, data: { message: 'Unauthorized' } });
        } else {
          const author_id = decoded.user_id;
          const hasOrdered = await dbRepo.hasUserOrderedFromRestaurant(author_id, restaurantID);
          if (!hasOrdered) {
            response(res, { status: 403, data: { message: 'You have not ordered from this restaurant!' } });
            return;
          }
          const { review_title, description, stars, media } = req.body;
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
          if (decoded.restaurant_id === parseInt(restaurantID)) {
            const result = await dbRepo.deleteMenuItem(restaurantID, itemID);
            if (result.affectedRows > 0) {
              response(res, { data: "Menu item deleted successfully!" });
            } else {
              throw new Error("Menu item not found or failed to delete.");
            }
          } else {
            response(res, { status: 403, data: { message: 'Forbidden' } });
          }
        }
      });
    } catch (error) {
      response(res, { status: 400, data: { message: error.message } });
    }
  }

  async updateMenuItem(req, res) {
    try {
      const { restaurantID } = req.params;
      const itemData = req.body;
      const token = req.headers.authorization;

      jwt.verify(token, secretKey, async (err, decoded) => {
        if (err) {
          response(res, { status: 401, data: { message: 'Unauthorized' } });
        } else {
          if (decoded.restaurant_id === parseInt(restaurantID)) {
            const result = await dbRepo.updateMenuItem(restaurantID, itemData);
            if (result) {
              response(res, { data: "Menu item updated successfully!" });
            } else {
              throw new Error("Failed to update menu item.");
            }
          } else {
            response(res, { status: 403, data: { message: 'Forbidden' } });
          }
        }
      });
    } catch (error) {
      response(res, { status: 400, data: error.message });
    }
  }

  async toggleItemAvailability(req, res) {
    try {
      const { restaurantID } = req.params;
      const { itemID, isAvailable } = req.body;
      const token = req.headers.authorization;
      jwt.verify(token, secretKey, async (err, decoded) => {
        if (err) {
          response(res, { status: 401, data: { message: 'Unauthorized' } });
        } else {
          if (decoded.restaurant_id === parseInt(restaurantID)) {
            const result = await dbRepo.toggleItemAvailability(restaurantID, itemID, isAvailable);
            if (result) {
              response(res, { data: "Item availability updated successfully!" });
            } else {
              throw new Error("Failed to update item availability.");
            }
          } else {
            response(res, { status: 403, data: { message: 'Forbidden' } });
          }
        }
      });
    } catch (error) {
      response(res, { status: 400, data: error.message });
    }
  }

  async updateRestaurantDetails(req, res) {
    try {
      const { restaurantID } = req.params;
      const token = req.headers.authorization;
      const updatedDetails = req.body;

      jwt.verify(token, secretKey, async (err, decoded) => {
        if (err) {
          response(res, { status: 401, data: { message: 'Unauthorized' } });
        } else {

          if (decoded.restaurant_id !== parseInt(restaurantID)) {
            return response(res, { status: 403, data: { message: 'Permission denied. You can only update your own restaurant details.' } });
          }

          const result = await dbRepo.updateRestaurantDetails(restaurantID, updatedDetails);

          if (result) {
            response(res, { data: "Restaurant details updated successfully!" });
          } else {
            throw new Error("Failed to update restaurant details.");
          }
        }
      });
    } catch (error) {
      response(res, { status: 400, data: { message: error.message } });
    }
  }


  async deactivateRestaurant(req, res) {
    try {
      const { restaurantID } = req.params;
      const token = req.headers.authorization;

      jwt.verify(token, secretKey, async (err, decoded) => {
        if (err) {
          response(res, { status: 401, data: { message: 'Unauthorized' } });
        } else if (decoded.restaurant_id !== parseInt(restaurantID)) {
          response(res, { status: 403, data: { message: 'Forbidden: You do not have permission to deactivate this restaurant.' } });
        } else {
          const result = await dbRepo.deactivateRestaurant(restaurantID);
          if (result.affectedRows > 0) {
            response(res, { data: "Restaurant deactivated successfully!" });
          } else {
            throw new Error("Failed to deactivate the restaurant.");
          }
        }
      });
    } catch (error) {
      response(res, { status: 400, data: { message: error.message } });
    }
  }

  async getActiveRestaurantOrders(req, res) {
    try {
      const { restaurant_id } = req.params;
      const token = req.headers.authorization;

      jwt.verify(token, secretKey, async (err, decoded) => {
        if (err) {
          response(res, { status: 401, data: { message: 'Unauthorized' } });
        } else {
          const orders = await dbRepo.getActiveOrdersByRestaurantID(restaurant_id);
          const data = orders.length ? orders : `No orders found for RestaurantID: ${restaurant_id}`;
          response(res, { data });
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
          await dbRepo.updateDeliveryAssociatesLocation(associate_id, latitude, longitude);
          response(res, { status: 201, data: { message: "success" } });
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



  async servePaymentForm(req, res) {
    try {
      const filePath = './public/payment-form.html';
      fs.readFile(filePath, (err, data) => {
        if (err) {
          response(res, { status: 400, data: error.message });
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(data);
        }
      });
    } catch (error) {
      response(res, { status: 400, data: error.message });
    }
  }

  async getClientPaymentToken(req, res) {
    try {
      const filePath = './public/scripts/get-client-token.js';
      fs.readFile(filePath, (err, data) => {
        if (err) {
          response(res, { status: 400, data: error.message });
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(data);
        }
      });
    } catch (error) {
      response(res, { status: 400, data: error.message });
    }
  }

  async submitPayment(req, res) {
    try {

      const requestBody = req.body;

      await stripe.charges
        .create({
          amount: 10000, // Amount in cents
          currency: 'usd',
          description: 'Example Charge',
          source: requestBody.token,
        })
        .then((charge) => {
          response(res, { status: 200, data: { message: 'Payment successful' } });
        })
        .catch((error) => {
          response(res, { status: 400, data: { message: error.message } });
        });
    } catch (error) {
      response(res, { status: 400, data: { message: error.message } });
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


  async acceptOrDeclineOrder(req, res) {
    try {
      const { restaurant_id, order_id } = req.params;
      const { status } = req.body;
      const token = req.headers.authorization;

      jwt.verify(token, secretKey, async (err, decoded) => {
        if (err) {
          response(res, { status: 401, data: { message: 'Unauthorized' } });
        } else {
          // Check if the restaurant_id in the token matches the restaurant_id in the route params
          if (decoded.restaurant_id !== parseInt(restaurant_id)) {
            response(res, { status: 403, data: { message: 'Forbidden' } });
            return;
          }

          const orders = await dbRepo.getOrdersByRestaurantID(restaurant_id);
          const order = orders.find(o => o.order_id == order_id);

          if (!order) {
            response(res, { status: 404, data: { message: "Order not found for the given restaurant." } });
            return;
          }

          if (![1, 2, 3].includes(status)) {
            response(res, { status: 400, data: { message: "Invalid status value." } });
            return;
          }

          const result = await dbRepo.updateOrderStatus(order_id, restaurant_id, status);
          if (result.affectedRows > 0) {
            const message = status === 1 ? "Order Accepted" : status === 2 ? "Order Rejected" : "Order Completed";
            response(res, { status: 200, data: { status: String(status), message } });
          } else {
            response(res, { status: 400, data: { message: "Order not updated." } });
          }
        }
      });
    } catch (error) {
      response(res, { status: 500, data: error.message });
    }
  }

  async getTimeEstimate(req, res) {
    try {
      const requestData = req.body;
      const sourceLat = requestData.source_latitude;
      const sourceLng = requestData.source_longitude;
      const destinationLat = requestData.destination_latitude;
      const destinationLng = requestData.destination_longitude;

      const source = `${sourceLat},${sourceLng}`;
      const destination = `${destinationLat},${destinationLng}`;


      const directionsEndpoint = `https://maps.googleapis.com/maps/api/directions/json?origin=${source}&destination=${destination}&mode=driving&departure_time=now&traffic_model=best_guess&key=${process.env.GOOGLE_API_KEY}`;
      const token = req.headers.authorization;

      jwt.verify(token, secretKey, async (err, decoded) => {
        if (err) {
          response(res, { status: 401, data: { message: 'Unauthorized' } });
        } else {


          https.get(directionsEndpoint, (directionsResponse) => {
            let directionsData = '';

            directionsResponse.on('data', (chunk) => {
              directionsData += chunk;
            });

            directionsResponse.on('end', () => {
              try {
                const parsedData = JSON.parse(directionsData);

                if (parsedData.status === 'OK') {
                  const route = parsedData.routes[0];
                  const totalDurationInSeconds = route.legs[0].duration_in_traffic.value;
                  const totalDurationInMinutes = Math.round(totalDurationInSeconds / 60);
                  response(res, { data: { estimatedTime: totalDurationInMinutes } });
                } else {
                  response(res, { status: 400, data: { error: "Failed to obtain traffic details and ETA" } });
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

  async getRoute(req, res) {
    try {
      const requestData = req.body;
      const sourceLat = requestData.source_latitude;
      const sourceLng = requestData.source_longitude;
      const destinationLat = requestData.destination_latitude;
      const destinationLng = requestData.destination_longitude;

      const source = `${sourceLat},${sourceLng}`;
      const destination = `${destinationLat},${destinationLng}`;


      const directionsEndpoint = `https://maps.googleapis.com/maps/api/directions/json?origin=${source}&destination=${destination}&mode=driving&departure_time=now&traffic_model=best_guess&key=${process.env.GOOGLE_API_KEY}`;
      const token = req.headers.authorization;

      jwt.verify(token, secretKey, async (err, decoded) => {
        if (err) {
          response(res, { status: 401, data: { message: 'Unauthorized' } });
        } else {
          https.get(directionsEndpoint, (directionsResponse) => {
            let directionsData = '';

            directionsResponse.on('data', (chunk) => {
              directionsData += chunk;
            });

            directionsResponse.on('end', () => {
              try {
                const parsedData = JSON.parse(directionsData);

                if (parsedData.status === 'OK') {
                  const data = parsedData.routes[0];
                  response(res, { data });
                } else {
                  response(res, { status: 400, data: { error: "Failed to obtain traffic details and ETA" } });
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


  async getUserById(req, res) {
    try {
      const token = req.headers.authorization;

      jwt.verify(token, secretKey, async (err, decoded) => {
        if (err) {
          response(res, { status: 401, data: { message: 'Unauthorized' } });
        } else {
          const { user_id } = req.params;
          // console.log(user_id)
          const user = await dbRepo.getUserByIdDB(user_id);

          if (user) {
            response(res, { data: user });
          } else {
            response(res, { status: 404, data: { message: "User not found" } });
          }
        }
      });
    } catch (error) {
      response(res, { status: 500, data: { message: "Internal Server Error" } });
    }
  }

  async deleteUserById(req, res) {
    try {
      const token = req.headers.authorization;
      jwt.verify(token, secretKey, async (err, decoded) => {
        if (err) {
          response(res, { status: 401, data: { message: 'Unauthorized' } });
        } else {

          const { user_id } = req.params;
          const user = await dbRepo.deleteUserById(user_id);

          if (user) {
            response(res, { data: user });
          } else {
            response(res, { status: 404, data: { message: "User not found" } });
          }
        }
      });
    } catch (error) {
      response(res, { status: 500, data: { message: "Internal Server Error" } });
    }
  }

  async updateUserProfile(req, res) {
    try {
      const token = req.headers.authorization;
      jwt.verify(token, secretKey, async (err, decoded) => {
        if (err) {
          response(res, { status: 401, data: { message: "Unauthorized" } });
        } else {
          const { user_id } = req.params;
          const { name, password, home_address, zip_code, city, state } = req.body;

          // Check if the email field is provided in the request

          const updatedProfile = {
            name,
            home_address,
            zip_code,
            city,
            state,
          };

          // Hash the password using bcrypt
          if (password) {
            const saltRounds = 10; // You can adjust this according to your needs
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            updatedProfile.password = hashedPassword;
          }

          const updated = await dbRepo.updateUserProfileInDB(user_id, updatedProfile);

          if (updated) {
            response(res, { data: { message: "User profile updated successfully" } });
          } else {
            response(res, { status: 400, data: { message: "No valid updates provided" } });
          }
        }
      });
    } catch (error) {
      response(res, { status: 500, data: { message: "Internal Server Error" } });
    }
  }


  async getAssociateById(req, res) {
    try {
      const token = req.headers.authorization;
      jwt.verify(token, secretKey, async (err, decoded) => {
        if (err) {
          response(res, { status: 401, data: { message: 'Unauthorized' } });
        } else {
          const { associate_id } = req.params;
          const user = await dbRepo.getAssocaiteByIdDB(associate_id);

          if (user) {
            response(res, { data: user });
          } else {
            response(res, { status: 404, data: { message: "User not found" } });
          }
        }
      });
    } catch (error) {
      response(res, { status: 500, data: { message: "Internal Server Error" } });
    }
  }

  async deleteAssociateById(req, res) {
    try {
      const token = req.headers.authorization;
      jwt.verify(token, secretKey, async (err, decoded) => {
        if (err) {
          response(res, { status: 401, data: { message: 'Unauthorized' } });
        } else {
          const { associate_id } = req.params;
          // console.log(associate_id)
          const user = await dbRepo.deleteAssociateByIdDB(associate_id);

          if (user) {
            response(res, { data: user });
          } else {
            response(res, { status: 404, data: { message: "User not found" } });
          }
        }
      });
    } catch (error) {
      response(res, { status: 500, data: { message: "Internal Server Error" } });
    }
  }

  async updateDeliveryAssociateProfile(req, res) {
    try {
      const token = req.headers.authorization;
      jwt.verify(token, secretKey, async (err, decoded) => {
        if (err) {
          response(res, { status: 401, data: { message: "Unauthorized" } });
        } else {
          const { associate_id } = req.params;
          const {
            name,
            home_address,
            zip_code,
            city,
            state,
            latitude,
            longitude,
            delivery_in_progress,
            password,
          } = req.body;

          // Check if the email field is provided in the request

          const updatedProfile = {
            name,
            home_address,
            zip_code,
            city,
            state,
            latitude,
            longitude,
            delivery_in_progress,
          };

          // Hash the password using bcrypt
          if (password) {
            const saltRounds = 10; // You can adjust this according to your needs
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            updatedProfile.password = hashedPassword;
          }

          const updated = await dbRepo.updateAssociateProfileInDB(associate_id, updatedProfile);

          if (updated) {
            response(res, { data: { message: "Associate profile updated successfully" } });
          } else {
            response(res, { status: 400, data: { message: "No valid updates provided" } });
          }
        }
      });
    } catch (error) {
      response(res, { status: 500, data: { message: "Internal Server Error" } });
    }
  }


  

  async sendEmail(email, userId) {
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  
    const mailOptions = {
      from: 'rueats@yahoo.com',
      to: email,
      subject: 'Email Verification for RUEats',
      html: `<p>Click the following link to verify your email:</p>
             <a href="http://localhost:3000/verify/${userId}">Verify Email</a>`,
    };
  
    return transporter.sendMail(mailOptions);
  }
  

  async updateUserVerification(req, res) {
    try {
      const { user_id } = req.params;
  
      const user = await dbRepo.getUserByIdDB(user_id);
  
      if (!user) {
        return response(res, { status: 401, data: { message: 'Unauthorized' } });
      }
  
      // Assuming you have a field for verification status in your user model
      // Update verification status to mark the email as verified
      await dbRepo.updateUserVerifiedStatus(user_id);
  
      const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Email Verification Success</title>
      </head>
      <body>
        <h1>Email Verification Successful</h1>
        <p>Your email has been successfully verified for RUEats.</p>
        <p>You can now return to the RUEats application.</p>
      </body>
      </html>
    `;

    // Set the Content-Type header to specify HTML content
    res.setHeader('Content-Type', 'text/html');
    
    // Send the HTML content as the response
    res.write(htmlContent);
    res.end();
    } catch (error) {
      return response(res, { status: 400, data: { message: error.message } });
    }
  }

 
  

}