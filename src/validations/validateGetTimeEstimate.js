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

    if (
      !isFinite(body.source_latitude) ||
      !isFinite(body.source_longitude) ||
      Math.abs(body.source_latitude) > 90 ||
      Math.abs(body.source_longitude) > 180 ||
      !isFinite(body.destination_latitude) ||
      !isFinite(body.destination_longitude) ||
      Math.abs(body.destination_latitude) > 90 ||
      Math.abs(body.destination_longitude) > 180
    ) {
      return response(res, {
        status: 400,
        data: { message: "Invalid latitude or longitude values" },
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
