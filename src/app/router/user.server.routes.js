const user = require('../controllers/user.server.controller')
module.exports = app => {
  // app.route('/users/me').get(user.requireLogin, user.profile)
  app
    .route('/users')
    .get( user.list)
    .post(user.createUser)
  app
    .route('/users/change-password')
    .post( user.changePassword)
    app
    .route('/users/login')
    .post( user.login)
  // app
  //   .route('/users/:userId')
  //   .get(user.requireLogin, user.read)
  //   .put(user.requireLogin, user.update)
  //   .delete(user.requireLogin, user.remove)
  app.param('userId', user.userById)
}
