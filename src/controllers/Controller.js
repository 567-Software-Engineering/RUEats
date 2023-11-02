const response = require('./../utils/response');
const RUEatsRepository = require('./../db/RUEatsRepository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = "1234qwerasdfzxcv";
const dbRepo = new RUEatsRepository();
const saltRounds = 10;

module.exports = class Controller{

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
      
    
    async getUsers (req, res){
        try {
          const users = await dbRepo.getAllUsers();
      
          response(res, { data: users });
        } catch (error) {
          response(res, { status: 400, data: { message: error.message } });
        }
      };

    async createUser (req, res) {
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
        response(res, { status: 201, data: {message: "success"} });
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

    console.log('isPasswordValid:', result);
    console.log('Hashed password from the database:', user.password);
    
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

  async getRestaurantNotifications(req, res) {
    try {
        const { restaurant_id } = req.params;
        const notifications = await dbRepo.getNotificationsByRestaurantID(restaurant_id);
        const data = notifications.length ? notifications : `No notifications found for RestaurantID: ${restaurant_id}`;
        response(res, { data });
    } catch (error) {
        response(res, { status: 400, data: error.message });
    }
}

};
