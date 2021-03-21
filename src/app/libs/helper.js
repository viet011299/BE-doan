const _ = require('lodash')
const ObjectId = require('mongoose').Types.ObjectId
const moment = require('moment');
function getObjectId(obj) {
  const id = _.get(obj, '_id') || obj
  if (_.isString(id) && ObjectId.isValid(id)) return new ObjectId(id)
  return id
}
exports.isEqualsDate = function (date1, date2) {
  if (moment(date1).isSame(date2, "date") && moment(date1).isSame(date2, "month") && moment(date1).isSame(date2, "year")) {
    return true
  }
  return false
}
exports.isEqualsTime = function (time1, time2) {
  const h1 = moment(time1).get("hour")
  const h2 = moment(time2).get("hour")
  const m1 = moment(time1).get("minute")
  const m2 = moment(time2).get("minute")
  if (h1 == h2 && m1 == m2) {
    return true
  }
  return false
}
exports.isEquals = function (objA, objB) {
  return _.isEqual(getObjectId(objA), getObjectId(objB))
}
exports.checkVaidTime = function (times) {
  times = _.filter(times, { 'value': "" })
  if (times.length == 0) {
    return true
  }
  return false
}
exports.getObjectId = getObjectId

