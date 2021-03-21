require('dotenv').config()
const _ = require('lodash')
module.exports = _.assignIn(
  {
    ENV: process.env.NODE_ENV,
    PORT: process.env.PORT || 3000,
    SECRETKEY: process.env.SECRETKEY,
    FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID,
    FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET,
    GOOGLE_APP_ID: process.env.GOOGLE_APP_ID,
    GOOGLE_APP_SECRET: process.env.GOOGLE_APP_SECRET,
    HOST: process.env.HOST || `http://localhost:${process.env.PORT}`,
    FRONT_HOST : process.env.FRONT_HOST
  },
  require('./' + process.env.NODE_ENV) || {}
)
