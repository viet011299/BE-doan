const _ = require('lodash')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const helper = require('../libs/helper')
const meterDataSchema = new Schema(
  {
    meterId: { type: String },
    time: Date,
    v:Number,
    a:Number,
    kWh:Number,
    w:Number
  },
  {
    usePushEach: true,
    timestamps: true,
  }
)
const MeterData = mongoose.model('MeterData', meterDataSchema)
module.exports = MeterData
