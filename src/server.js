const { DB, PORT, ENV } = require('./config/env/all')
const moment = require('moment')
const chalk = require('chalk')
const logger = require('./config/logger')
const socket = require("socket.io");
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


const server = app.listen(PORT, () => {
  console.log(`%s Server listen on port ${PORT} in ${ENV}`, chalk.green('✓'))
  logger('info', 'Sever Running')
})

const io = socket(server, {
  cors: {
    origin: '*',
  }
});
global.io = io;
let interval;
const mongoose = require('mongoose')
const Meter = mongoose.model('Meter')
const MeterData = mongoose.model('MeterData')

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("disconnect", () => {2
    console.log("Client disconnected");
  });
});




module.exports = app
