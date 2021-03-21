const _ = require('lodash')
const mongoose = require('mongoose')
const User = mongoose.model('UserE')
const helper = require('../libs/helper')
const { handleError, handleSuccess } = require('../../config/response')
exports.createUser = async (req, res) => {
    try {
      const newUser = new User(req.body)
      newUser.save()
      return handleSuccess(res, 200, newUser, "Succes")
    } catch (error) {
      handleError(res, 400, error.message)
    }
  
  }
  exports.login = async (req, res) => {
    const body = req.body
    console.log(body)
    const user = await User.findOne({ username: body.username })
    if (!user) {
      return handleError(res, 400, "Không tồn tại tài khoản")
    }
    if (body.password == user.password) {
      return handleSuccess(res, 200, user, "Thành công")
    } else {
      return handleError(res, 400, "Sai mật khẩu")
    }
  
  
  }