const nodemailer = require('nodemailer');

const { MAILGUN_SMTP, MAILGUN_LOGIN, MAILGUN_PASS, TESTUSER } = process.env;

const nodemailerConfig = {
  host: MAILGUN_SMTP,
  port: 587,
  auth: {
    user: MAILGUN_LOGIN,
    pass: MAILGUN_PASS,
  },
  from: 'engineerkonstantin@gmail.com',
};

// const testMessage = {
//   from: 'engineerkonstantin@gmail.com',
//   to: TESTUSER,
//   subject: 'Hello',
//   text: 'Test message by MailGun!',
//   html: '<h1>Test message by MailGun!</h1>',
// };

const nodemailerTransport = nodemailer.createTransport(nodemailerConfig);

// nodemailerTransport
//   .sendMail(testMessage)
//   .then(result => console.log(result))
//   .catch(error => console.log(error));

module.exports = nodemailerTransport;
