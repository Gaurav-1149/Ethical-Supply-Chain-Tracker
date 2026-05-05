import express from 'express';
import { body } from 'express-validator';
import {
  addSupplyChainStep,
  createProduct,
  getProductById,
  getProducts,
  getSupplyChain
} from '../controllers/productController.js';
import { protect, requireSeller } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

const productValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be zero or greater'),
  body('category').trim().notEmpty().withMessage('Category is required')
];

const stepValidation = [
  body('stepName').trim().notEmpty().withMessage('Step name is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('transportDistance').isFloat({ min: 0 }).withMessage('Transport distance must be zero or greater'),
  body('ethicalFlags.fairWages').optional().isBoolean().withMessage('fairWages must be true or false'),
  body('ethicalFlags.ecoFriendly').optional().isBoolean().withMessage('ecoFriendly must be true or false'),
  body('ethicalFlags.lowCarbon').optional().isBoolean().withMessage('lowCarbon must be true or false'),
  body('ethicalFlags.sustainablePractices')
    .optional()
    .isBoolean()
    .withMessage('sustainablePractices must be true or false')
];

router.get('/', getProducts);
router.post('/', protect, requireSeller, productValidation, validate, createProduct);
router.get('/:id', getProductById);
router.get('/:id/supply-chain', getSupplyChain);
router.post('/:id/supply-chain', protect, requireSeller, stepValidation, validate, addSupplyChainStep);

export default router;
