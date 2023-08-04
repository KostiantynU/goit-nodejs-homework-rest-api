const fs = require('fs/promises');
const path = require('path');
const { nanoid } = require('nanoid');
const contactsPath = path.join(__dirname, 'contacts.json');

const listContacts = async () => {
  const resultArray = await fs.readFile(contactsPath);
  return JSON.parse(resultArray);
};

const getContactById = async contactId => {
  const contactsArray = await listContacts();
  const contactById = contactsArray.find(el => el.id === contactId);
  return contactById || null;
};

const removeContact = async contactId => {
  const contactsArray = await listContacts();
  const indx = contactsArray.findIndex(el => el.id === contactId);
  if (indx === -1) return null;
  const [deletedContact] = contactsArray.splice(indx, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contactsArray, null, 2));
  return deletedContact;
};

const addContact = async body => {
  const contactsArray = await listContacts();
  const newContact = { id: nanoid(), ...body };
  contactsArray.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contactsArray, null, 2));
  return newContact;
};

const updateContact = async (contactId, body) => {
  const contactsArray = await listContacts();
  const indx = contactsArray.findIndex(el => el.id === contactId);
  if (indx === -1) return null;
  contactsArray[indx] = { id: contactId, ...body };
  await fs.writeFile(contactsPath, JSON.stringify(contactsArray, null, 2));
  const updatedContact = contactsArray[indx];
  return updatedContact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
