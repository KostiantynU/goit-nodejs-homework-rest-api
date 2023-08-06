const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/contacts');

const { validateBody } = require('../../middlewares');
const contactsSchema = require('../../schemas/contacts');

router.get('/', ctrl.getAll);

router.get('/:contactId', ctrl.getById);

router.post('/', validateBody(contactsSchema.addSchema), ctrl.addContactPost);

router.delete('/:contactId', ctrl.deleteContact);

router.put('/:contactId', validateBody(contactsSchema.addSchema), ctrl.updateContactPost);

module.exports = router;
