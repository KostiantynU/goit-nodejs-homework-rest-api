const express = require('express');
const contactRouter = express.Router();

const ctrl = require('../../controllers/contacts');
const { HttpError, ctrlWrapper } = require('../../helpers');

const { validateBody } = require('../../middlewares');
const contactsSchema = require('../../schemas/contacts');

const Contact = require('../../models/contactsDB.js');

contactRouter.get('/', async (req, res, next) => {
  try {
    const result = await Contact.find();
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

contactRouter.get('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findById(contactId);

    if (!result) {
      throw HttpError(404, 'Not found!');
    }

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

contactRouter.post('/', async (req, res, next) => {
  try {
    const { error } = contactsSchema.addSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const result = await Contact.create(req.body);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

contactRouter.put('/:contactId', async (req, res, next) => {
  try {
    const { error } = contactsSchema.addSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });

    if (!result) {
      throw HttpError(404, 'Not found!');
    }

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

contactRouter.patch('/:contactId/favorite', async (req, res, next) => {
  try {
    const { error } = contactsSchema.favoriteSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });

    if (!result) {
      throw HttpError(404, 'Not found!');
    }

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

contactRouter.delete('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndDelete(contactId);

    if (!result) {
      throw HttpError(404, 'Not found');
    }

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = contactRouter;
