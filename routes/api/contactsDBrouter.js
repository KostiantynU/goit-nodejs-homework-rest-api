const express = require('express');
const contactRouter = express.Router();

const ctrl = require('../../controllers/contactsDBctrl');

const { validateBody, validateFavorite } = require('../../middlewares');
const contactsSchema = require('../../schemas/contacts');

contactRouter.get('/', ctrl.getAll);

contactRouter.get('/:contactId', ctrl.getById);

contactRouter.post('/', validateBody(contactsSchema.addSchema), ctrl.addContact);

contactRouter.put('/:contactId', validateBody(contactsSchema.addSchema), ctrl.updateContact);

contactRouter.patch(
  '/:contactId/favorite',
  validateFavorite(contactsSchema.favoriteSchema),
  ctrl.updateContactPatch
);

contactRouter.delete('/:contactId', ctrl.deleteContact);

module.exports = contactRouter;
