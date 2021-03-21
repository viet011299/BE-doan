require("dotenv").config();
module.exports = {
  DB: process.env.MONGO_URL || "mongodb://mongo/goro-app-test"
};
