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

  async addMenuItem(req, res) {
    try {
        const { restaurantID } = req.params; 
        const { itemName, description, price, spiceLevel, isAvailable, category, imageUrl, isFeatured } = req.body;

        const result = await dbRepo.addMenuItem(restaurantID, itemName, description, price, spiceLevel, isAvailable, category, imageUrl, isFeatured);
        if(result) {
            response(res, {data: "Menu item added successfully!"});
        } else {
            throw new Error("Failed to add menu item.");
        }
    } catch(error) {
        response(res, {status: 400, data: error.message});
    }
  }

  async postRestaurantReview(req, res) {
    try {
        const { restaurantID } = req.params;
        const { review_title, description, stars, media, author_id } = req.body;

        // needs to be updated to check for user authentication

        const reviewId = await dbRepo.addReview(review_title, description, stars, media, author_id, restaurantID);
        
        if (reviewId) {
            response(res, { data: "Review added successfully!", reviewId });
        } else {
            throw new Error("Failed to add review.");
        }
    } catch (error) {
        response(res, { status: 400, data: error.message });
    }
  }

  async getRestaurantInsights(req, res) {
    try {
        const { restaurantID } = req.params;
        const insights = await dbRepo.getInsightsByRestaurantID(restaurantID);
        response(res, {data: insights});
    } catch(error) {
        response(res, {status: 400, data: error.message});
    }
  }

};
