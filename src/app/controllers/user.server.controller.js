const _ = require('lodash')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const helper = require('../libs/helper')
const { handleError, handleSuccess } = require('../../config/response')
const { createToken } = require('../../config/strategies/passport')
var nodemailer = require('nodemailer')
const email = require('./email.server.controller')
exports.create = async (req, res) => {
  const { confirmPassword } = req.body
  const user = new User({
    ...req.body,
    displayName: `${req.body.firstName} ${req.body.lastName}`,
  })
  const hasExistUser = await User.findOne({ email: user.email })
  if (hasExistUser) {
    return handleError(res, 400, 'Email đã được đăng ký!')
  }
  if (user.password === confirmPassword) {
    return handleError(res, 400, 'Mật khẩu không trùng khớp')
  }
  await user.hashPassword()
  try {
    user.role = 'user'
    await user.save()
    user.salt = undefined
    user.password = undefined
    return handleSuccess(res, 201, null, 'Đăng ký thành công')
  } catch (error) {
    return handleError(res, 400, _.last(error.message.split(':')).trim())
  }
}
exports.profile = (req, res) => {
  res.jsonp(req.user)
}
exports.list = (req, res) => {
  res.jsonp('Ok')
}
exports.update = async (req, res) => {
  const reqUser = req.user
  let user = await User.findOne({ email: reqUser.email })
  if (!user) {
    throw new Error(
      'Không tìm thấy tài khoản hoặc token hết hạn. Vui lòng đăng nhập lại'
    )
  }
  user = _.assignIn(user, req.body)
  await user.save()
  handleSuccess(res, 201, null, 'Cập nhật thành công')
}
exports.remove = (req, res) => { }

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
exports.userById = (req, res, next, id) => {
  User.findById({ _id: id }).exec(function (err, user) {
    if (err) return next(err)
    if (!user) return next(new Error('Failed to load user ' + id))
    req.theUser = user
    next()
  })
}
_.assignIn(module.exports, require('./authenticate.server.controller'))
