
import { Router } from 'express';
import { ProductController } from '../controller/product.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { validateProduct } from '../validators/product.validator';
import { validateRequest } from '../middleware/validate.middleware';

const router = Router();

//router.post('/', ProductController.create);
router.get('/', ProductController.getAll);
router.get('/:id', ProductController.getById);
router.put('/:id', ProductController.update);
router.delete('/:id', ProductController.delete);
router.post(
  '/',
  authenticateToken,
  validateProduct,
  validateRequest,
  ProductController.create
);
export default router;
