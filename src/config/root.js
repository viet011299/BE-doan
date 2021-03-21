var path = require('path')

module.exports = function(filename) {
  return path.resolve(process.cwd(), filename)
}
