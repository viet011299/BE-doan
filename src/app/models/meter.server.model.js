const _ = require('lodash')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const helper = require('../libs/helper')
const meterSchema = new Schema(
  {
    meterId: {
      type: String,
      required: [true, "Meter id is not null"]
    },
    roomId: {
      type: Schema.ObjectId,
    },
    roomName: {
      type: String
    },
    buildingName: {
      type: String
    },
    floor: {
      type: Number
    },
    buildingId: {
      type: Schema.ObjectId,
    },
  },
  {
    usePushEach: true,
    timestamps: true,
  }
)




const Meter = mongoose.model('Meter', meterSchema)
module.exports = Meter
