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


    if(!/^[a-z ,.'-]+$/i.test(body.name)){
      return response(res, {
        status: 400,
        data: { message: "Name should contain only alphabetical characters" },
      });
    }

    if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(body.email)){
      return response(res, {
        status: 400,
        data: { message: "Please enter a valid email ID" },
      });
    }

    if(!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(body.password)){
      return response(res, {
        status: 400,
        data: { message: "Password should have minimum six characters, at least one letter and one number",
        },
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
