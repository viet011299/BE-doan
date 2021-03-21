const schedule = require('node-schedule')
const tk = require('timekeeper')
const moment = require('moment')
exports.scheduleJobs = async function () {
    if (process.env.NODE_ENV !== 'production') return
    console.log('Cron Started')
    // schedule.scheduleJob("*/5 * * * * *", () => console.log(moment().format("HH:mm:ss")))
    // Fake time for testing schedule
    // const tk = require('timekeeper')
    // const date = new Date('2019-12-18T11:33:59+07:00')
    // tk.travel(date)
    // setInterval(function () { }, 1000)
}