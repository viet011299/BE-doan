const _ = require('lodash')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const helper = require('../libs/helper')
const roomSchema = new Schema(
  {
    roomName: {
      type: String,
      required: [true, "Room name null"]
    },
    roomInfo: {
      type: String,
    },
    buildingId: {
      type: Schema.Types.ObjectId,
      required: [true, "Please choice building Id"]
    },
    floor: {
      type: Number,
      required: [true, "Please choice fool in building"]
    }
  },
  {
    usePushEach: true,
    timestamps: true,
  }
)
roomSchema.post('remove', async function (doc, next) {
  const _id = helper.getObjectId(doc)
  const Meter = mongoose.model('Meter')
  try {
    await Meter.update({ roomId: _id }, {
      $set: {
        roomId: null,
        roomName: "",
      }
    }, { multi: true })
  }
  catch (error) {
    console.log(error)
  }
  next()
})

roomSchema.post('save', async function (doc, next) {
  try {
    const _id = helper.getObjectId(doc)
    const Meter = mongoose.model('Meter')
    await Meter.update({ roomId: _id }, {
      $set: {
        roomName: doc.roomName,
      }
    }, { multi: true })
  } catch (error) {
    console.log(error)
  }

  next()
})



const Room = mongoose.model('Room', roomSchema)
module.exports = Room
