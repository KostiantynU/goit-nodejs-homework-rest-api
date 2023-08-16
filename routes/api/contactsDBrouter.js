const express = require('express');
const contactRouter = express.Router();

const { ctrlContacts } = require('../../controllers/');

const { validateBody, validateFavorite, isValidId, authenticate } = require('../../middlewares');
const contactsSchema = require('../../schemas/contacts');

contactRouter.get('/', authenticate, ctrlContacts.getAll);

contactRouter.get('/:contactId', authenticate, isValidId, ctrlContacts.getById);

contactRouter.post(
  '/',
  authenticate,
  validateBody(contactsSchema.addSchema),
  ctrlContacts.addContact
);

contactRouter.put(
  '/:contactId',
  authenticate,
  isValidId,
  validateBody(contactsSchema.addSchema),
  ctrlContacts.updateContact
);

contactRouter.patch(
  '/:contactId/favorite',
  authenticate,
  isValidId,
  validateFavorite(contactsSchema.favoriteSchema),
  ctrlContacts.updateContactPatch
);

contactRouter.delete('/:contactId', authenticate, isValidId, ctrlContacts.deleteContact);

module.exports = contactRouter;
