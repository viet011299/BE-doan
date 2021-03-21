const { passport, createToken } = require('../../config/strategies/passport')
const _ = require('lodash')
const { setWishTrips } = require('../libs/common')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const { handleError, handleSuccess } = require('../../config/response')
const helper = require('../libs/helper')
const uuid = require('uuid')
const {
  sendMailResetPass,
  sendMailSuccessResetPass,
} = require('./email.server.controller')
/**
 * Check authenticate
 */
exports.login = async function(req, res) {
  const { email, password } = req.body
  const user = await User.findOne({ email }).exec()
  if (!user) {
    return handleError(res, 400, 'Tài khoản không tồn tại!')
  }
  if (!password) {
    return handleError(res, 400, 'Chưa nhập mật khẩu!')
  }
  const comparePassword = user.authenticate(password)
  if (!comparePassword) {
    return handleError(res, 400, 'Mật khẩu không chính xác!')
  }
  const token = createToken({ _id: user._id })
  user.token = token
  await user.save()
  handleSuccess(res, 200, { token, userInfo: user }, 'Đăng nhập thành công')
}

exports.fbLoginWithId = async function(req, res) {
  const data = req.body
  console.log(data)
  let user = await User.findOne({ 'services.facebook': data.id })
  if (!user) {
    user = new User({
      gender: data.gender,
      'services.facebook': data.id,
      displayName: data.displayName,
      lastName: data.last_name,
      firstName: data.first_name,
      picture: data.picture.data.url,
    })
  }
  const token = createToken({ _id: user._id })
  user.token = token
  await user.save()
  handleSuccess(res, 200, user, 'OK')
}

exports.fbLogin = async function(req, res) {
  passport.authenticate('facebook')(req, res, next)
}

exports.ggLogin = async function(req, res, next) {
  passport.authenticate('google', { scope: ['profile', 'email'] })(
    req,
    res,
    next
  )
}

exports.fbCallback = async function(req, res, next) {
  passport.authenticate(
    'facebook',
    { failureRedirect: 'api/login' },
    async (err, user) => {
      if (err) {
        return responseError(res, err.message)
      }
      const token = createToken({ _id: user._id })
      user.token = token
      user.password = undefined
      user.salt = undefined
      await User.updateOne(
        { _id: helper.getObjectId(user) },
        { $set: { token } }
      )
      handleSuccess(res, 200, { token, userInfo: user })
    }
  )(req, res, next)
}

exports.ggCallback = async (req, res, next) => {
  passport.authenticate(
    'google',
    { failureRedirect: 'api/login' },
    (err, user) => {
      if (err) {
        return handleError(res, { message: 'Có lỗi xảy ra' })
      }
      const token = createToken({ _id: user._id })
      user.token = token
      User.updateOne({ _id: helper.getObjectId(user) }, { $set: { token } })
      handleSuccess(res, 200, { token, userInfo: user })
    }
  )(req, res, next)
}
exports.requireLogin = async function(req, res, next) {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return handleError(res, 400, 'Có lỗi xảy ra!')
    }
    if (!user) {
      return handleError(res, 401, 'Bạn không có quyền!')
    }
    user.salt = undefined
    user.password = undefined
    user.token = undefined
    req.user = user
    next()
  })(req, res, next)
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
exports.forgot = async (req, res) => {
  try {
    const { email } = req.body
    if (!email) {
      return handleError(res, 401, 'Chưa nhập vào email')
    }
    const user = await User.findOne({
      email: email,
    })
    if (!user) {
      return handleError(res, 401, 'Không tồn tại tài khoản')
    }
    const tokenReset = uuid.v1()
    user.resetPasswordToken = tokenReset
    user.resetPasswordExpires = Date.now() + 3600000 // trong 1h
    await sendMailResetPass(user.email, tokenReset)
    user.save()
    return handleSuccess(
      res,
      200,
      '',
      'Vui lòng kiểm tra email để thay đổi mật khẩu'
    )
  } catch (error) {
    handleError(res, 401, error.message)
  }
}
exports.resetPassword = async (req, res) => {
  try {
    const user = req.user
    const { password } = req.body
    if (!password) {
      return handleError(res, 401, 'Chưa nhập mập khẩu cần đổi')
    }
    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.hashPassword()
    await user.save()
    user.salt = undefined
    user.password = undefined
    await sendMailSuccessResetPass(user.email)
    handleSuccess(res, 200, '', 'Đặt lại mật khẩu thành công')
  } catch (error) {
    handleError(res, 401, error.message)
  }
}
exports.getResetPassword = async (req, res) => {
  try {
    const token = req.user.resetPasswordToken
    handleSuccess(res, 200, { tokenReset: token }, 'thành công')
  } catch (error) {
    handleError(res, 401, error.message)
  }
}
exports.checkTokenReset = async (req, res, next, token) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    })
    if (!user) {
      return next(
        new Error(
          'Link của bạn không hợp lệ hoặc đã hết hạn thay đổi mật khẩu '
        )
      )
    }
    req.user = user
    next()
  } catch (error) {
    next(new Error(error.message))
  }
}

exports.loadWishList = async function(req, res, next) {
  passport.authenticate('jwt', { session: false }, async (err, user, info) => {
    if (err) {
      return handleError(res, 400, 'Có lỗi xảy ra!')
    }
    if (!user) {
      return next()
    }
    const WishList = mongoose.model('WishList')
    const trips = await WishList.aggregate()
      .match({
        user: helper.getObjectId(user),
      })
      .limit(1)
      .unwind('$trips')
    if (trips.length) {
      const wishTrips = _.reduce(
        trips,
        (result, trip) => {
          result[helper.getObjectId(trip.trips)] = true
          return result
        },
        {}
      )
      req.wishTrips = wishTrips
    }
    next()
  })(req, res, next)
}

/**
 * Check user has roles to access route to get data
 * @param roles roles of user like: admin, user...
 */
exports.hasAuthorization = function(role) {
  const _this = this

  return function(req, res, next) {
    _this.requireLogin(req, res, function() {
      if (req.user.role === role) {
        return next()
      }
      return handleError(res, 400, 'Bạn không có quyền!')
    })
  }
}
