const passport = require('passport')
const passportJWT = require('passport-jwt')
const passportFB = require('passport-facebook')
const passportGG = require('passport-google-oauth')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const helper = require('../../app/libs/helper')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy
const FacebookStrategy = passportFB.Strategy
const GoogleStrategy = passportGG.OAuth2Strategy
const User = require('../../app/models/users.server.model')
const config = require('../env/all')
const jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('JWT')
jwtOptions.secretOrKey = config.SECRETKEY

// Passpost with JWT
passport.use(
  new JwtStrategy(jwtOptions, function(jwt_payload, next) {
    User.findOne({ _id: helper.getObjectId(jwt_payload) })
      .exec()
      .then(user => {
        if (user) {
          next(null, user)
        } else {
          next(null, false)
        }
      })
  })
)

// Passpost with GG Auth2
passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_APP_ID,
      clientSecret: config.GOOGLE_APP_SECRET,
      callbackURL: '/auth/google/callback',
    },
    function(accessToken, refreshToken, profile, done) {
      const { id, displayName, emails, photos, name } = profile
      User.findOne({ $or: [{ 'services.google': id }] }, function(err, user) {
        if (err) {
          return done(err)
        }
        if (user) {
          return done(null, user)
        }
        const newUser = new User({
          displayName,
          firstName: _.get(name, 'givenName', ''),
          lastName: _.get(name, 'familyName', ''),
          email: _.head(emails).value,
          picture: _.head(photos).value,
        })
        newUser.services.google = id
        newUser.save(function(err) {
          if (err) throw err
          return done(null, newUser)
        })
      })
    }
  )
)

// Passpost with FB
passport.use(
  new FacebookStrategy(
    {
      clientID: config.FACEBOOK_APP_ID,
      clientSecret: config.FACEBOOK_APP_SECRET,
      callbackURL: `${config.HOST}/auth/facebook/callback`,
    },
    function(accessToken, refreshToken, profile, done) {
      const { id, displayName } = profile
      User.findOne({ $or: [{ 'services.facebook': id }] }, function(err, user) {
        if (err) {
          return done(err)
        }
        if (user) {
          return done(null, user)
        }
        const newUser = new User({ displayName })
        newUser.services.facebook = id
        newUser.save(function(err) {
          if (err) throw err
          return done(null, newUser)
        })
      })
    }
  )
)
function createToken(payload) {
  const token = jwt.sign(payload, jwtOptions.secretOrKey)
  return token
}

passport.serializeUser(function(user, done) {
  done(null, user.id)
})
passport.deserializeUser(function(id, done) {
  User.findById(id, done)
})

module.exports = { passport, createToken }
