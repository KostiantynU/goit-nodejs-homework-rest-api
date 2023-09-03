const ctrlContacts = require('./contactsDBctrl');
const ctrlAuth = require('./ctrlAuth');
const { refreshToken } = require('./refreshToken');
module.exports = { ctrlAuth, ctrlContacts, refreshToken };
