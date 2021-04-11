const crypto = require('crypto')
const bcryptjs = require('bcryptjs')
const _ = require('lodash')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const roles = ['user', 'manager']
const helper = require('../libs/helper')
const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true
    },
    password: String,
    name:String
  },
  {
    usePushEach: true,
    timestamps: true,
  }
)


const User = mongoose.model('User', userSchema)
module.exports = User
