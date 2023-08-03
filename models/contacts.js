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
  if (!contactById) return null;
  return contactById;
};

const removeContact = async contactId => {
  const contactsArray = await listContacts();
  const contactById = contactsArray.find(el => el.id === contactId);
  if (!contactById) return null;
  const indx = contactsArray.findIndex(el => el.id === contactId);
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
  const contactById = contactsArray.find(el => el.id === contactId);
  if (!contactById) return null;
  console.log(body);
  const updatedContact = { ...contactById, ...body };
  // console.log(updatedContact);
  const indx = contactsArray.findIndex(el => el.id === contactId);
  contactsArray.splice(indx, 1, updatedContact);
  await fs.writeFile(contactsPath, JSON.stringify(contactsArray, null, 2));
  return updatedContact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
