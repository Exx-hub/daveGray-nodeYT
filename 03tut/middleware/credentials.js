const allowedOrigins = require("../config/allowedOrigins");

const credentials = (req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Allow-Control-Allow-Credenetials", true);
  }

  next();
};

module.exports = credentials;
