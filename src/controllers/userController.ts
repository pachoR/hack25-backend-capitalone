import e, { Request, Response } from 'express';
import { createSingleUserRule, deleteSingleUserRule, getAllUserRules, getAllUsers, getSingleUserById, modifySingleUserRule } from '../services/userService';
import { userRules } from '../models/users';

export const getUsers = async (_: Request, res: Response) => {
    try {
        const users = await getAllUsers();
        res.json({ success: true, data: users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

export const getUserRules = async (req: Request, res: Response) => {
    const { client_id } = req.params;
    console.log(client_id);
    try {
        const rules = await getAllUserRules(client_id);
        res.json({ success: true, data: rules });
    } catch (error) {
        console.error(`Error fetching rules for client_id ${client_id}:`, error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const user = await getSingleUserById(id);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        res.json({ success: true, data: user });
    } catch (error) {
        console.error(`Error fetching user with id ${id}:`, error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
export const postUserRule = async (req: Request, res: Response) => {
    // support either /:clientId or /:client_id param names
    const client_id = (req.params.clientId ?? req.params.client_id) as string;
    const { description, min_threshold, max_threshold, percentage } = req.body;

    try {
        const newRule = await createSingleUserRule({
            client_id,
            description,
            min_threshold,
            max_threshold,
            percentage,
        } as userRules);
        res.status(201).json({ success: true, data: newRule });
    } catch (error) {
        console.error(`Error creating user rule for client_id ${client_id}:`, error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

export const putUserRule = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { client_id, description, min_threshold, max_threshold, percentage } = req.body;
    try {
        const updatedRule = await modifySingleUserRule({ id, client_id, description, min_threshold, max_threshold, percentage } as userRules);
        res.json({ success: true, data: updatedRule });
    } catch (error) {
        console.error(`Error updating user rule with id ${id}:`, error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

export const deleteUserRule = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await deleteSingleUserRule(id);
        res.json({ success: true });
    } catch (error) {
        console.error(`Error deleting user rule with id ${id}:`, error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
