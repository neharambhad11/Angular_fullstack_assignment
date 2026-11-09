
import { body } from 'express-validator';

export const validateProduct = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required'),

  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a non-negative number'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
];
