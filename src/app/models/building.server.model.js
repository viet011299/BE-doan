
const _ = require('lodash')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const helper = require('../libs/helper')
const buildingSchema = new Schema(
  {
    buildingName: {
      type: String,
      required: [true, "Building Name is null"],
      unique: true,
    },
    buildingInfo: {
      type: String
    },
    numberFloor: {
      type: Number,
      required: [true, "Number Floor is null"]
    }
  },
  {
    usePushEach: true,
    timestamps: true,
  }
)


buildingSchema.post('remove', async function (doc, next) {
  const _id = helper.getObjectId(doc)
  const Room = mongoose.model('Room')
  await Room.deleteMany({ buildingId: _id })
  const Meter = mongoose.model('Meter')
  await Meter.update({ buildingId: _id }, {
    $set: {
      roomId: null,
      roomName: "",
      buildingId: null,
      buildingName: "",
      floor: ""
    }
  }, { multi: true })
  next()
})

buildingSchema.post('save', async function (doc, next) {
  const _id = helper.getObjectId(doc)
  const Meter = mongoose.model('Meter')
  const buildingNumberFloor = doc.numberFloor
  try {
    await Meter.update({ buildingId: _id, floor: { $gt: buildingNumberFloor } }, {
      $set: {
        roomId: null,
        roomName: "",
        buildingId: null,
        buildingName: "",
        floor: ""
      }
    },
      { multi: true })

    await Meter.update({ buildingId: _id, floor: { $lte: buildingNumberFloor } }, {
      $set: {
        buildingName: doc.buildingName,
      }
    }, { multi: true })

  } catch (error) {
    console.log(error);
  }

  next()
})

const Building = mongoose.model('Building', buildingSchema)
module.exports = Building
