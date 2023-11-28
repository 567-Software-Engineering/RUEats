const getPostBodyAsync = require("./../utils/getPostBodyAsync");
const response = require("./../utils/response");

// Middleware function to validate location data in a POST request.
const validateSetLocationData = async (req, res, next) => {
  try {
    const body = await getPostBodyAsync(req);

    if (!body.latitude || !body.longitude || !body.associate_id) {
      return response(res, {
        status: 400,
        data: { message: "Latitude, Longitude and Associate Id is required" },
      });
    }

    if (
      !isFinite(body.originLatitude) ||
      !isFinite(body.originLongitude) ||
      Math.abs(body.originLatitude) > 90 ||
      Math.abs(body.originLongitude) > 180 ||
      isNaN(body.associate_id) || 
      !Number.isInteger(body.associate_id)
    ) {
      return response(res, {
        status: 400,
        data: { message: "Invalid latitude, longitude, or associate_id values" },
      });
    }
    
    req.body = body;

    next(req, res);
  } catch (error) {
    console.log(error);
    response(res, { status: 400, data: { message: error.message } });
  }
};


module.exports = validateSetLocationData;
