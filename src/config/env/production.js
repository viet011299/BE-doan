require("dotenv").config();
module.exports = {
  DB: process.env.MONGO_URL || "mongodb://localhost:27017/goro-app"
};
