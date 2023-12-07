const getPostBodyAsync = require("./../utils/getPostBodyAsync");
const response = require("./../utils/response");

// Middleware function to validate user data in a POST request.
const validateRestaurantData = async (req, res, next) => {
  try {
    const body = await getPostBodyAsync(req);

    if (!body.name || !body.email || !body.phone_number || !body.address || !body.cuisine_type || !body.operating_hours || !body.is_active) {

      return response(res, {
        status: 400,
        data: { message: "restaurant_id, name, email, phone_number, address, cuisine_type, operating_hours, is_active are required" },
      });
    }

    req.body = body;

    next(req, res);
  } catch (error) {
    console.log(error);
    response(res, { status: 400, data: { message: error.message } });
  }
};

module.exports = validateRestaurantData;
