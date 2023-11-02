const response = require('./../utils/response');
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

  async getLatitudeLongitude(req, res) {
    try {
      const requestData = req.body;
      const address = requestData.address;
      const geocodingEndpoint = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.API_KEY}`;
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

          if (![1, 2, 3].includes(status)) {
            response(res, { status: 400, data: "Invalid status value." });
            return;
          }

          const result = await dbRepo.updateOrderStatus(order_id, restaurant_id, status);
          if (result.affectedRows > 0) {
            const message = status === 1 ? "Order Accepted" : status === 2 ? "Order Rejected" : "Order Completed";
            response(res, { status: 200, data: { status: String(status), message } });
          } else {
            response(res, { status: 400, data: "Order not updated." });
          }
        }
      });
    } catch (error) {
      response(res, { status: 500, data: error.message });
    }
  }
};
