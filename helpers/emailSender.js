const formData = require('form-data');
const Mailgun = require('mailgun.js');

const { MAILGUN_DOMAIN, MAILGUN_USERNAME, MAILGUN_API_KEY } = process.env;

const mailgun = new Mailgun(formData);
const mgClient = mailgun.client({ username: 'api', key: MAILGUN_API_KEY });

const testMessage = {
  from: 'Kostiantyn engineerkonstantin@gmail.com',
  to: 'umaneck@gmail.com',
  subject: 'Hello',
  text: 'Test message by MailGun!',
};

console.log('first');

mgClient.messages
  .create(MAILGUN_DOMAIN, testMessage)
  .then(response => console.log(response))
  .catch(err => console.log(err));

module.exports = mgClient;
