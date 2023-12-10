const getPostBodyAsync = require("./../utils/getPostBodyAsync");
const response = require("./../utils/response");

// Middleware function to validate location data in a POST request.
const validateSetLocationData = async (req, res, next) => {

    
    try {
      const body = await getPostBodyAsync(req);
      console.log(body)
      if (!body.latitude || !body.longitude) {
        return response(res, {
          status: 400,
          data: { message: "Latitude and Longitude are required" },
        });
      }

      if (
        !isFinite(body.latitude) ||
        !isFinite(body.longitude) ||
        Math.abs(body.latitude) > 90 ||
        Math.abs(body.longitude) > 180
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


module.exports = validateSetLocationData;
