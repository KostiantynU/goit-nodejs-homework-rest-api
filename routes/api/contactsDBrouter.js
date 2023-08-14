const express = require('express');
const contactRouter = express.Router();

const ctrl = require('../../controllers/contactsDBctrl');

const { validateBody, validateFavorite, isValidId } = require('../../middlewares');
const contactsSchema = require('../../schemas/contacts');

contactRouter.get('/', ctrl.getAll);

contactRouter.get('/:contactId', isValidId, ctrl.getById);

contactRouter.post('/', validateBody(contactsSchema.addSchema), ctrl.addContact);

contactRouter.put(
  '/:contactId',
  isValidId,
  validateBody(contactsSchema.addSchema),
  ctrl.updateContact
);

contactRouter.patch(
  '/:contactId/favorite',
  isValidId,
  validateFavorite(contactsSchema.favoriteSchema),
  ctrl.updateContactPatch
);

contactRouter.delete('/:contactId', isValidId, ctrl.deleteContact);

module.exports = contactRouter;
