const nodemailer = require('nodemailer');

var transport = nodemailer.createTransport({
    service : 'google',
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "30c8355d9fd2ec",
      pass: "a5c9bbd9f5a567"
    }
  });


module.exports = transport;