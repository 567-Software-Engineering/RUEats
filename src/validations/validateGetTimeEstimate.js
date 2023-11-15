const getPostBodyAsync = require("./../utils/getPostBodyAsync");
const response = require("./../utils/response");

// Middleware function to validate location data in a POST request.
const validateGetTimeEstimate = async (req, res, next) => {
  try {
    const body = await getPostBodyAsync(req);

    if (!body.source_latitude || !body.source_longitude || !body.destination_latitude || !body.destination_longitude) {
      return response(res, {
        status: 400,
        data: { message: "Latitude and Longitude for Source and Destination is required" },
      });
    }

    req.body = body;

    next(req, res);
  } catch (error) {
    console.log(error);
    response(res, { status: 400, data: { message: error.message } });
  }
};


module.exports = validateGetTimeEstimate;
