import { Request, Response } from 'express';
import { getAllUsers } from '../services/userService';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
