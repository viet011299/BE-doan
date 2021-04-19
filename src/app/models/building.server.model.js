const _ = require('lodash')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const helper = require('../libs/helper')
const buildingSchema = new Schema(
  {
    buildingName: {
      type: String,
      required:[true,"Building Name is null"]
    },
    buildingInfo:{
        type:String
    },
    numberFloor:{
        type:Number,
        required:[true,"Number Floor is null"]
    }
  },
  {
    usePushEach: true,
    timestamps: true,
  }
)


buildingSchema.post('remove', async function(doc, next) {
  const _id = helper.getObjectId(doc)
  const Room = mongoose.model('Room')
  await Room.deleteMany({buildingId:_id})
  next()
})

const Building = mongoose.model('Building', buildingSchema)
module.exports = Building
