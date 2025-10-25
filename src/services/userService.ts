import { User } from "../models/users";
import { query } from "../util/dbClient";

export const getAllUsers = async (): Promise<User[]> => {
  const res = await query('SELECT pucharse_id, client_id FROM users ORDER BY pucharse_id');
  return res.rows;
};