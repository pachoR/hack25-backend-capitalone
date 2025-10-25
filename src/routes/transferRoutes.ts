import { Router } from "express";
import { createTransferForAccount } from "../controllers/transferController";

const router = Router();

router.post('/:id/transfer', createTransferForAccount);

export default router;