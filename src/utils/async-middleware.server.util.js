const { handleError } = require("../config/response");
module.exports = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(err => {
    // throw err
    handleError(res, 400, err.message);
  });
};
