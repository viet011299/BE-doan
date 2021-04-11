const { DB, PORT, ENV } = require('./config/env/all')
const moment = require('moment')
const chalk = require('chalk')
const logger = require('./config/logger')
function runBasicStaff() {
  const schedule = require('./config/schedule')
  const mongoose = require('mongoose')
  mongoose.Promise = global.Promise
  mongoose.set('useUnifiedTopology', true)
  mongoose.set('useNewUrlParser', true)
  mongoose.set('useFindAndModify', false)
  mongoose.set('useCreateIndex', true)
  const db = mongoose
    .connect(DB)
    .then(() => {
      console.log('%s MongoDB Connected', chalk.green('✓'))
      schedule.scheduleJobs()
    })
    .catch(err => {
      console.log('%s Connect MongoDB Fail'), chalk.red('X')
    })
  return db
}
const db = runBasicStaff()
const app = require('./config/strategies/express')(db)
app.listen(PORT, () => {
  console.log(`%s Server listen on port ${PORT} in ${ENV}`, chalk.green('✓'))
  logger('info', 'Sever Running')
})
module.exports = app
