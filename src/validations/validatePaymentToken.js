const getPostBodyAsync = require("./../utils/getPostBodyAsync");
const response = require("./../utils/response");

const validatePaymentToken = async (req, res, next) => {
    try {
      const body = await getPostBodyAsync(req);
      
      if (!body) {
        return response(res, {
          status: 400,
          data: { message: "Payment unsuccessful." },
        });
      }

      req.body = body;

      next(req, res);
    } catch (error) {
      console.log(error);
      response(res, { status: 400, data: { message: error.message } });
    }
  };
  
  module.exports = validatePaymentToken;