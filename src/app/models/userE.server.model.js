const crypto = require('crypto')
const bcryptjs = require('bcryptjs')
const _ = require('lodash')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const roles = ['user', 'manager']
const helper = require('../libs/helper')
const userESchema = new Schema(
  {
    username: {
      type: String,
      unique: true
    },
    password: String,
    role: String
  },
  {
    usePushEach: true,
    timestamps: true,
  }
)

// userSchema.path('email').set(function(email) {
//   if (!this.picture && this.picture.indexOf('https://gravatar.com') === 0) {
//     const hash = crypto
//       .createHash('md5')
//       .update(email)
//       .digest('hex')
//     this.picture = `https://gravatar.com/avatar/${hash}?d=identicon`
//   }

//   if (!this.name) {
//     this.name = email.replace(/^(.+)@.+$/, '$1')
//   }
//   return email
// })


const User = mongoose.model('UserE', userESchema)
module.exports = User
