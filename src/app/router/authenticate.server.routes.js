const authenticate = require('../controllers/authenticate.server.controller')
module.exports = function (app) {
  app.route('/auth').post(authenticate.login)
  app.route('/auth/facebook').post(authenticate.fbLoginWithId)
  app.route('/password/forgot').post(
    authenticate.forgot
  )
  app.route('/password/reset/:token')
    .get(authenticate.getResetPassword)
    .post(authenticate.resetPassword)
  app.param('token', authenticate.checkTokenReset)
  // app.route('/auth/facebook/callback').get(authenticate.fbCallback)
  // app.route('/auth/google').get(authenticate.ggLogin)
  // app.route('/auth/google/callback').get(authenticate.ggCallback)
  // app.route('/google').get((req, res) => {
  //   res.send("<a href='/auth/google'>Sign In with Google</a>")
  // })
  // app.route('/facebook').get((req, res) => {
  //   res.send("<a href='/auth/facebook'>Sign In with Facebook</a>")
  // })
}
