const _ = require('lodash')
const mongoose = require('mongoose')
const Meter = mongoose.model('Meter')
const MeterData = mongoose.model('MeterData')
const Room = mongoose.model('Room')
const Building = mongoose.model('Building')
const ObjectId = require('mongoose').Types.ObjectId;
const helper = require('../libs/helper')
const { handleError, handleSuccess } = require('../../config/response')

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
    global.io.emit('new-data', body)
    global.io.emit(`new-data-${body.meterId}`, body)
    return handleSuccess(res, 200, newDataMeter, "Success")
  } catch (error) {
    return handleError(res, 400, error.message)
  }
}
exports.test = async (req, res) => {
  try {
    global.io.emit('new-data-2002351090', 
    { time: "2021-05-09T03:43:29.000Z",
      meterId: "2002351090",
      v: 220.1,
      a: 0.103,
      kWh: 3.01,
      w: 14.72 }
    )
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
    const item = req.item
    const count = await MeterData.countDocuments({ meterId: item.meterId })
    const listData = await MeterData.find({ meterId: item.meterId }).skip(count-600)
    handleSuccess(res, 200, { item, listData }, 'Success')
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
    const item = await Meter.findOne({ meterId : meterId })
    if (!item) {
      return next(new Error('Failed to load Meter id ' + meterId))
    } else {
      req.item = item
      next()
    }
  } catch (error) {
    next(new Error(error.message))
  }
}

