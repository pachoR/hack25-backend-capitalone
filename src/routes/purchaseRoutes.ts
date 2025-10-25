import { Router } from 'express';
import {
  createPurchaseForAccount,
  getAccountPurchases,
} from '../controllers/purchaseController';

const router = Router();

router.post('/:id/purchases', createPurchaseForAccount);

router.get('/:id/purchases', getAccountPurchases);

export default router;
