import { Router } from 'express';
import { deleteUserRule, getUserRules, getUsers, postUserRule, putUserRule } from '../controllers/userController';

const router = Router();

router.get('/', getUsers);
router.get('/:client_id/rules', getUserRules);
router.post('/:client_id/rules', postUserRule);
router.put('/:client_id/rules/:id', putUserRule);
router.delete('/:client_id/rules/:id', deleteUserRule);

export default router;