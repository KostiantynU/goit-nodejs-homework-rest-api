const express = require('express');
const contactRouter = express.Router();

const ctrl = require('../../controllers/contactsDBctrl');

const { validateBody, validateFavorite, isValidId, authenticate } = require('../../middlewares');
const contactsSchema = require('../../schemas/contacts');

contactRouter.get('/', authenticate, ctrl.getAll);

contactRouter.get('/:contactId', authenticate, isValidId, ctrl.getById);

contactRouter.post('/', authenticate, validateBody(contactsSchema.addSchema), ctrl.addContact);

contactRouter.put(
  '/:contactId',
  authenticate,
  isValidId,
  validateBody(contactsSchema.addSchema),
  ctrl.updateContact
);

contactRouter.patch(
  '/:contactId/favorite',
  authenticate,
  isValidId,
  validateFavorite(contactsSchema.favoriteSchema),
  ctrl.updateContactPatch
);

contactRouter.delete('/:contactId', authenticate, isValidId, ctrl.deleteContact);

module.exports = contactRouter;
