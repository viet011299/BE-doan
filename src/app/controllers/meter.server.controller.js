const _ = require('lodash')
const mongoose = require('mongoose')
const Meter = mongoose.model('Meter')
const MeterData = mongoose.model('MeterData')
const Room = mongoose.model('Room')
const Building = mongoose.model('Building')
const ObjectId = require('mongoose').Types.ObjectId;
const helper = require('../libs/helper')
const { handleError, handleSuccess } = require('../../config/response')
const moment = require('moment')


exports.create = async (req, res) => {
  try {
    const body = req.body
    const findMeter = await Meter.findOne({ meterId: body.meterId })
    if (!findMeter) {
      const newMeter = new Meter({ meterId: body.meterId })
      await newMeter.save()
    }
    const newDataMeter = new MeterData(body)
    await newDataMeter.save()
    global.io.emit('new-data', newDataMeter)
    global.io.emit(`new-data-${body.meterId}`, newDataMeter)
    return handleSuccess(res, 200, newDataMeter, "Success")
  } catch (error) {
    return handleError(res, 400, error.message)
  }
}
exports.test = async (req, res) => {
  try {
    global.io.emit('new-data', {
      "time": new Date(),
      "meterId": "2002351090",
      "v": 227.19,
      "a": 80,
      "kWh": 4.2,
      "w": 45.69,
    })
    global.io.emit('new-data', {
      "time": new Date(),
      "meterId": "2002351076",
      "v": 227.19,
      "a": 80,
      "kWh": 4.2,
      "w": 45.69,
    })
 
    global.io.emit('new-data-2002351076', {
      "time": new Date(),
      "meterId": "2002351076",
      "v": 100.19,
      "a": 81,
      "kWh": 4.1,
      "w": 45.69,
    })
    return handleSuccess(res, 200, "", "Success")
  } catch (error) {
    return handleError(res, 400, error.message)
  }
}

exports.update = async (req, res) => {
  try {
    const item = req.item
    const body = req.body
    delete body.meterId
    if (body.roomId || body.buildingId) {
      if (!body.roomId || !body.buildingId) {
        return handleError(res, 400, "Need both room id and building id")
      }
      const checkBuildingId = await Building.findOne({ _id: body.buildingId })
      if (!checkBuildingId) {
        return handleError(res, 400, "Building don't exist")
      }
      const checkRoom = await Room.findOne({ _id: body.roomId, buildingId: body.buildingId })
      if (!checkRoom) {
        return handleError(res, 400, "Room don't exist")
      }
      body["buildingName"] = checkBuildingId.buildingName
      body["roomName"] = checkRoom.roomName
      body["floor"] = checkRoom.floor
    }
    _.assignIn(item, body)
    await item.save()
    handleSuccess(res, 200, item, 'Update  success')
  } catch (error) {
    return handleError(res, 400, error.message)
  }
}

exports.list = async (req, res) => {
  try {
    const list = await Meter.find();
    return handleSuccess(res, 200, list, "Get list")
  } catch (error) {
    return handleError(res, 400, error.message)
  }
}

exports.getAll = async (req, res) => {
  try {
    const listMeter = await Meter.find();
    const listData = await MeterData.find()
    return handleSuccess(res, 200, { listMeter, listData }, "Get All")
  } catch (error) {
    return handleError(res, 400, error.message)
  }
}

exports.read = async (req, res) => {
  try {
    let startDate = moment(new Date(req.query.startDate)).startOf("day")
    console.log(startDate);
    let endDate = moment(new Date(req.query.endDate)).endOf("day")
    console.log(endDate);
    const item = req.item
    const listData = await MeterData.find({ meterId: item.meterId, time: { $gt: startDate, $lt: endDate } })
    const lastItem = await MeterData.find({ meterId: item.meterId}).sort({ time: -1 }).limit(1)
    handleSuccess(res, 200, { item, listData, lastItem: lastItem[0] }, 'Success')
  } catch (error) {
    handleError(res, 400, error.message)
  }
}
exports.readByMeterId = async (req, res) => {
  try {
    const item = req.item
    const listData = await MeterData.find({ meterId: item.meterId })
    handleSuccess(res, 200, { item, listData }, 'Success')
  } catch (error) {
    handleError(res, 400, error.message)
  }
}


exports.itemById = async (req, res, next, meterId) => {
  try {
    const item = await Meter.findOne({ meterId: meterId })
    if (!item) {
      return next(new Error('Not found Meter id ' + meterId))
    } else {
      req.item = item
      next()
    }
  } catch (error) {
    next(new Error(error.message))
  }
}

