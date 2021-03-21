const user = require('../controllers/user.server.controller')
module.exports = app => {
  app.route('/users/me').get(user.requireLogin, user.profile)
  app
    .route('/users')
    .get(user.requireLogin, user.list)
    .post(user.create)
    .put(user.requireLogin, user.update)
  app
    .route('/users/change-password')
    .post(user.requireLogin, user.changePassword)
  // app
  //   .route('/users/:userId')
  //   .get(user.requireLogin, user.read)
  //   .put(user.requireLogin, user.update)
  //   .delete(user.requireLogin, user.remove)
  app.param('userId', user.userById)
}
