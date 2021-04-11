const _ = require('lodash')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const helper = require('../libs/helper')
const meterSchema = new Schema(
  {
    meterId: {
      type: String,
      unique: true
    },
  },
  {
    usePushEach: true,
    timestamps: true,
  }
)




const Meter = mongoose.model('Meter', meterSchema)
module.exports = Meter
