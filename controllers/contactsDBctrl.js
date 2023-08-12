const Contact = require('../models/contactsDBmodel');
const { HttpError, ctrlWrapper } = require('../helpers');

const getAll = async (req, res) => {
  const contactsArray = await Contact.find();

  return res.status(200).json(contactsArray);
};

const getById = async (req, res) => {
  const { contactId } = req.params;
  const contactById = await Contact.findById(contactId);

  if (!contactById) {
    throw HttpError(404, 'Not found');
  }

  return res.status(200).json(contactById);
};

const addContact = async (req, res) => {
  const result = await Contact.create(req.body);
  return res.status(201).json(result);
};

const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const deletedContact = await Contact.findByIdAndDelete(contactId);

  if (!deletedContact) {
    throw HttpError(404, 'Not found');
  }

  return res.status(200).json(deletedContact);
};

const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const editedObj = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });

  if (!editedObj) {
    throw HttpError(404, 'Not found');
  }

  return res.status(200).json(editedObj);
};

const updateContactPatch = async (req, res, next) => {
  const { contactId } = req.params;
  const editedObj = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });

  if (!editedObj) {
    throw HttpError(404, 'Not found');
  }

  return res.status(200).json(editedObj);
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  addContact: ctrlWrapper(addContact),
  deleteContact: ctrlWrapper(deleteContact),
  updateContact: ctrlWrapper(updateContact),
  updateContactPatch: ctrlWrapper(updateContactPatch),
};
