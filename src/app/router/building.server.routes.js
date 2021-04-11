const building = require('../controllers/building.server.controller')
// const users = require('../controllers/user.server.controller')
module.exports = function (app) {


  app
    .route('/building')
    .get(building.list)
    .post(building.create)
  app
    .route('/building/:buildingId')
    .get(building.read)
    .put(building.update)
    .delete(building.delete)


  app.param('buildingId', building.itemById)

}
