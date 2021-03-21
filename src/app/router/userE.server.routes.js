const userE = require('../controllers/userE.server.controller')
module.exports = app => {
  app.route('/create').post(userE.createUser)
  app.route('/logi').post(userE.login)
}