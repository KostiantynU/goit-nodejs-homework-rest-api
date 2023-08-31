const formData = require('form-data');
const Mailgun = require('mailgun.js');

const { MAILGUN_DOMAIN, MAILGUN_API_KEY, TESTUSER } = process.env; //test.user.for.emails2023@gmail.com

const mailgun = new Mailgun(formData);
const mgClient = mailgun.client({ username: 'api', key: MAILGUN_API_KEY });

const testMessage = {
  from: 'Kostiantyn engineerkonstantin@gmail.com',
  to: TESTUSER,
  subject: 'Hello',
  text: 'Test message by MailGun!',
  html: '<h1>Test message by MailGun!</h1>',
};

const sendEmail = async data => {
  const newEmail = { ...data, from: 'Kostiantyn engineerkonstantin@gmail.com' };
  const result = await mgClient.messages.create(MAILGUN_DOMAIN, newEmail);
  console.log(result);
  return console.log('message send');
};
// mgClient.messages
//   .create(MAILGUN_DOMAIN, testMessage)
//   .then(response => console.log(response))
//   .catch(err => console.log(err));

module.exports = sendEmail;
