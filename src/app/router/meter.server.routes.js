const meter = require('../controllers/meter.server.controller')
// const users = require('../controllers/user.server.controller')
module.exports = function (app) {


    app
        .route('/meter')
        .get(meter.list)
        .post(meter.create)

}
