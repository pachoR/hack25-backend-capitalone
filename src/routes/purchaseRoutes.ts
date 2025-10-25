import { Router } from 'express';
import {
  createPurchaseForAccount,
  getAccountPurchases,
} from '../controllers/purchaseController';

const router = Router();

router.post('/accounts/:id/purchases', createPurchaseForAccount);

router.get('/accounts/:id/purchases', getAccountPurchases);

export default router;
