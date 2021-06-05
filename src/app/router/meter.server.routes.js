const meter = require('../controllers/meter.server.controller')
const building = require('../controllers/building.server.controller')
// const users = require('../controllers/user.server.controller')
module.exports = function (app) {


  app
    .route('/meter')
    .get(meter.list)
    .post(meter.create)
  app
    .route('/get-all/meter')
    .get(meter.getAll)
  app
    .route('/test')
    .get(meter.test)
  app
    .route('/meter/:id')
    .get(meter.read)
    .put(meter.update)
  app.route('/meter/analytics/:id').get(meter.analytics)
  app.param('id', meter.itemById)
  app.route('/buildings/meter').get(building.getAll)
}
