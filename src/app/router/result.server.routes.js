const result = require('../controllers/result.server.controller')
module.exports = function (app) {
    app.
        route('/result/create')
        .post(result.create)

    app.route('/result/:idR')
        .get(result.read)
    app.route('/rusult/show').post(result.show)
    app.param('idR', result.resultById)
}