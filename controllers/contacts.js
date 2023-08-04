const contactsDB = require('../models/contacts');
const { HttpError, ctrlWrapper } = require('../helpers');

const getAll = async (req, res) => {
  const contactsArray = await contactsDB.listContacts();
  res.json({ status: 'success', code: 200, data: { contactsArray } });
};

const getById = async (req, res) => {
  const { contactId } = req.params;
  const contactById = await contactsDB.getContactById(contactId);
  if (!contactById) {
    throw HttpError(404, 'Not found');
  }
  res.json({ status: 'success', code: 200, data: { contactById } });
};

const addContactPost = async (req, res) => {
  const newContact = await contactsDB.addContact(req.body);
  res.json({ status: 'success', code: 201, data: { newContact } });
};

const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const deletedContact = await contactsDB.removeContact(contactId);
  if (!deletedContact) {
    throw HttpError(404, 'Not found');
  }
  res.json({ status: 'success', code: 200, data: { deletedContact } });
};

const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const editedObj = await contactsDB.updateContact(contactId, req.body);
  console.log(editedObj);
  if (!editedObj) {
    throw HttpError(404, 'Not found');
  }
  res.json({ status: 'success', code: 201, data: { editedObj } });
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  addContactPost: ctrlWrapper(addContactPost),
  deleteContact: ctrlWrapper(deleteContact),
  updateContact: ctrlWrapper(updateContact),
};
