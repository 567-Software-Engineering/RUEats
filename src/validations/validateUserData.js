const getPostBodyAsync = require("./../utils/getPostBodyAsync");
const response = require("./../utils/response");

// Middleware function to validate user data in a POST request.
const validateUserData = async (req, res, next) => {
  try {
    const body = await getPostBodyAsync(req);

    if (!body.name || !body.email || !body.password) {
      return response(res, {
        status: 400,
        data: { message: "Name, email and password are required" },
      });
    }

    req.body = body;

    next(req, res);
  } catch (error) {
    console.log(error);
    response(res, { status: 400, data: { message: error.message } });
  }
};

module.exports = validateUserData;
