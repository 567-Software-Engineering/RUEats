const getPostBodyAsync = require("./../utils/getPostBodyAsync");
const response = require("./../utils/response");

const validateDeliveryAssociate = async (req, res, next) => {
    try {
      const body = await getPostBodyAsync(req);
      if (!body.originLatitude || !body.originLongitude) {
        return response(res, {
          status: 400,
          data: { message: "originLatitude and originLongitude are required" },
        });
      }

      if (
        !isFinite(body.originLatitude) ||
        !isFinite(body.originLongitude) ||
        Math.abs(body.originLatitude) > 90 ||
        Math.abs(body.originLongitude) > 180
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
  
  module.exports = validateDeliveryAssociate;