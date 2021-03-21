const express = require('express')
const _ = require('lodash')
const config = require('../config')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const logger = require('../logger')
const { passport } = require('./passport')
const { handleError } = require('../response')
const root = require('../root')
module.exports = function(db) {
  const server = express()
  // Load all model
  const modelFiles = config.loadModels()
  _.forEach(modelFiles, file => {
    const combinedFilePath = file.replace('src', '../..')
    require(combinedFilePath)
  })
  server.use(cors())
  server.use(helmet())
  server.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
  server.use(
    bodyParser.json({
      json: { limit: '50mb', extended: true },
    })
  )
  // Sesion
  // server.use(
  //   session({
  //     secret: config.all.SECRETKEY,
  //     resave: true,
  //     saveUninitialized: true
  //   })
  // );
  // Middleware morgan
  if (process.env.NODE_ENV !== 'test') {
    server.use(morgan('dev'))
  }

  // Passport
  server.use(passport.initialize())
  server.use('/upload', express.static(root('upload')))
  // Load all router
  const routerFiles = config.loadRouters()
  _.forEach(routerFiles, file => {
    const combinedFilePath = file.replace('src', '../..')
    require(combinedFilePath)(server)
  })

  server.use(function(err, req, res, next) {
    if (err) {
      logger('error', err.message)
      return handleError(res, 400, err.message)
    }
    next()
  })
  return server
}
