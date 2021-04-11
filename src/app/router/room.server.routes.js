const building = require('../controllers/room.server.controller')
// const users = require('../controllers/user.server.controller')
module.exports = function (app) {


  app
    .route('/room')
    .get(building.list)
    .post(building.create)

  app
    .route('/room/:roomId')
    .get(building.read)
    .put(building.update)
    .delete(building.delete)


  app.param('roomId', building.itemById)

}
