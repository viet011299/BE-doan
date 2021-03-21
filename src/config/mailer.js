const nodemailer = require('nodemailer')
const config = require('../config/env/all')
const sendMail = (to = null, subject = null, text = null, html = null) => {
  var transporter = nodemailer.createTransport({
    // config mail server
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'dipperpine99@gmail.com',
      pass: 'cancaiten030',
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false,
    },
  })
  var mainOptions = {
    from: 'Tài Mơ',
    to: 'dangtai380@gmail.com',
    subject: 'Test Nodemailer',
    text: 'You recieved message from Tài Mơ',
    html:
      '<p>You have got a new message</b><ul><li>Username: Tài Mơ' +
      '</li><li>Email:' +
      'Tài Mơ' +
      '</li><li>Username:' +
      'Tài Mơ' +
      '</li></ul>',
  }
  transporter.sendMail(mainOptions, function(err, info) {
    if (err) {
      console.log(err)
    } else {
      console.log('Message sent: ' + info.response)
    }
  })
}
module.exports = { sendMail }
