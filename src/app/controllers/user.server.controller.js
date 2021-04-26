const _ = require('lodash')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const helper = require('../libs/helper')
const { handleError, handleSuccess } = require('../../config/response')


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
exports.list = async (req, res) => {
  let user = await User.find()
  handleSuccess(res, 201, user, 'Cập nhật thành công')
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
    const { confirmPassword, email, password, name } = req.body
    if (!email) {
      return handleError(res, 400, 'Email null')
    }
    if (!password) {
      return handleError(res, 400, 'Password null')
    }
    if (!name) {
      return handleError(res, 400, 'name null')
    }
    const user = new User({
      ...req.body,
    })
    const hasExistUser = await User.findOne({ email: user.email })
    if (hasExistUser) {
      return handleError(res, 400, 'Email exist')
    }
    if (user.password !== confirmPassword) {
      return handleError(res, 400, "Password don't compare")
    }
    await user.hashPassword()
    await user.save()
    return handleSuccess(res, 200, null, "Create User Success")
  } catch (error) {
    handleError(res, 400, error.message)
  }
}


exports.login = async (req, res) => {
  const { email, password } = req.body
  if (!email) {
    return handleError(res, 400, 'Email null')
  }
  const user = await User.findOne({ email })
  if (!user) {
    return handleError(res, 400, "Email don't exits")
  }
  if (!password) {
    return handleError(res, 400, 'Password null')
  }
  const comparePassword = user.authenticate(password)
  if (!comparePassword) {
    return handleError(res, 400, "Password don't exits")
  }
  return handleSuccess(res, 200, { name: user.name, id: user._id }, "Success")
}

exports.changePassword = async (req, res) => {
  try {
    const reqUser = req.user
    const { oldPassword, newPassword } = req.body
    const user = await User.findOne({
      email: reqUser.email,
    })
    if (!user) {
      throw new Error(
        'Không tìm thấy tài khoản hoặc token hết hạn. Vui lòng đăng nhập lại'
      )
    }
    if (!user.authenticate(oldPassword)) {
      throw new Error('Mật khẩu cũ không chính xác')
    }
    user.password = newPassword
    await user.hashPassword()
    await user.save()
    handleSuccess(res, 201, { message: 'Thay đổi mật khẩu thành công' })
  } catch (error) {
    handleError(res, 401, error.message)
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
// _.assignIn(module.exports, require('./authenticate.server.controller'))
