import { Router } from 'express';
import { deleteUserRule, getUserRules, getUsers, postUserRole } from '../controllers/userController';

const router = Router();

router.get('/', getUsers);
router.get('/:client_id/rules', getUserRules);
router.post('/:client_id/rules', postUserRole);
router.delete('/:client_id/rules/:id', deleteUserRule);

export default router;