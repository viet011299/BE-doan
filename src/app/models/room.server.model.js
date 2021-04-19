const _ = require('lodash')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const helper = require('../libs/helper')
const roomSchema = new Schema(
  {
    roomName:{
        type:String,
        required:[true,"Room name null"]
    },
    roomInfo:{
        type:String,
    },
    buildingId:{
        type:Schema.Types.ObjectId,
        required:[true,"Please choice building Id"]
    },
    floor:{
        type:Number,
        required:[true,"Please choice fool in building"]
    }
  },
  {
    usePushEach: true,
    timestamps: true,
  }
)




const Room = mongoose.model('Room', roomSchema)
module.exports = Room
