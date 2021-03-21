const englishTest = require('../controllers/english-test.server.model')
module.exports = function (app) {
    app.
        route('/english')
        .get(englishTest.list)
        .post(englishTest.create)
    app.route('/english/:idE')
    .get(englishTest.read)
    .put(englishTest.update)
    app.param('idE',englishTest.englishTestById)
}