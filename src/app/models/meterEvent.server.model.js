const _ = require('lodash')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const helper = require('../libs/helper')
const meterEventSchema = new Schema(
  {
    meterId: { type: String },
    type: String,
    start: Date,
    end: Date,
    value: Number
  },
  {
    usePushEach: true,
    timestamps: true,
  }
)
const MeterEvent = mongoose.model('MeterEvent', meterEventSchema)
module.exports = MeterEvent
