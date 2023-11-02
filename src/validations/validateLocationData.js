const getPostBodyAsync = require("./../utils/getPostBodyAsync");
const response = require("./../utils/response");

// Middleware function to validate address data in a POST request.
const validateLocationData = async (req, res, next) => {
  try {
    const body = await getPostBodyAsync(req);

    if (!body.address) {
      return response(res, {
        status: 400,
        data: { message: "Address is required" },
      });
    }

    req.body = body;

    next(req, res);
  } catch (error) {
    console.log(error);
    response(res, { status: 400, data: { message: error.message } });
  }
};


module.exports = validateLocationData;
