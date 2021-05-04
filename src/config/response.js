const _ = require('lodash')
exports.handleError = async (res, code = 400, message) => {

  let combinedMessage = message
  if (message.includes('validation')) {
    combinedMessage = _.trim(_.last(message.split(':')))
  }
  if (message.match(/duplicate key/)){
    combinedMessage = "Data exist"
  }

  return res.status(code).jsonp({
    message: combinedMessage,
    error: true,
  })
}
exports.handleSuccess = async (res, code = 200, data = {}, msg = '') => {
  return res.jsonp({
    response: {
      status: code,
      msg: msg,
    },
    data: data,
  })
}
