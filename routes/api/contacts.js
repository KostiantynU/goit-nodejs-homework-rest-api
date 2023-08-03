const express = require('express');
const contactsDB = require('../../models/contacts');

const router = express.Router();

router.get('/', async (req, res, next) => {
  const contactsArray = await contactsDB.listContacts();
  res.json(contactsArray);
});

router.get('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  const contactById = await contactsDB.getContactById(contactId);
  res.json(contactById);
});

router.post('/', async (req, res, next) => {
  const newContact = await contactsDB.addContact(req.query);
  res.json(newContact);
});

router.delete('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  const deletedContact = contactsDB.removeContact(contactId);
  res.json(deletedContact);
});

router.put('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  const editedObj = await contactsDB.updateContact(contactId, { ...req.query });
  res.json(editedObj);
});

module.exports = router;
