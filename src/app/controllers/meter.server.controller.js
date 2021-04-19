const _ = require('lodash')
const mongoose = require('mongoose')
const Meter = mongoose.model('Meter')
const MeterData = mongoose.model('MeterData')
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
    return handleSuccess(res, 200, newDataMeter, "Success")
  } catch (error) {
    return handleError(res, 400, error.message)
  }
}
exports.list = async (req, res) => {
  try {
      const list = await MeterData.find();
      return handleSuccess(res, 200, list, "Get list")
  } catch (error) {
      return handleError(res, 400, error.message)
  }
}

