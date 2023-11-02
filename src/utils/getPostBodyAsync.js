// Returns a promise that resolves with the parsed JSON data of the request body.
const getPostBodyAsync = (req) => {
    return new Promise((resolve, reject) => {
      let body = "";
  
      req.on("data", (chunk) => {
        body += chunk;
      });
  
      req.on("end", () => {
        try {
          body = body ? JSON.parse(body) : {};
  
          resolve(body);
        } catch (error) {
          reject(error);
        }
      });
    });
  };
  
  module.exports = getPostBodyAsync;