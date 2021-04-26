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
      match: /^\S+@\S+\.\S+$/,
      unique: true,
      required: [true,"Email null"]
    },
    password: {
      type: String,
      required: [true,"Password null"],
    },
    name:{
      type:String,
      required: [true,"Name null"]
    },
    salt:String
  },
  {
    usePushEach: true,
    timestamps: true,
  }
)
userSchema.methods.hashPassword = async function () {
  if (!this.password) {
    throw new Error('Password null')
  } else if (this.password.length < 6 || this.password.length > 20) {
    throw new Error('Password have length 6 - 20 character')
  } else {
    this.salt = bcryptjs.genSaltSync(10)
    this.password = bcryptjs.hashSync(this.password, this.salt)
  }
}
userSchema.methods.authenticate = function (password) {
  return this.password === bcryptjs.hashSync(password, this.salt)
}
const User = mongoose.model('User', userSchema)
module.exports = User
