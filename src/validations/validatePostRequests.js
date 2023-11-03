const getPostBodyAsync = require("./../utils/getPostBodyAsync");
const response = require("./../utils/response");

const validatePostRequests = async (req, res, next) => {
    try {
      const body = await getPostBodyAsync(req);
      req.body = body;
      next(req, res);
    } catch (error) {
      console.log(error);
      response(res, { status: 400, data: { message: error.message } });
    }
  };
  
  module.exports = validatePostRequests;
