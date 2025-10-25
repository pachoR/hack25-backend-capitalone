import { User, userRules } from "../models/users";
import { query } from "../util/dbClient";

export const getAllUsers = async (): Promise<User[]> => {
    const res = await query('SELECT purchase_id, client_id FROM users ORDER BY purchase_id');
    return res.rows;
};

export const getAllUserRules = async (client_id: string): Promise<userRules[]> => {
    const res = await query('SELECT * FROM user_rules WHERE client_id = $1 ORDER BY id', [client_id]);
    return res.rows;
}

export const getSingleUserById = async (id: string): Promise<User | null> => {
    const res = await query('SELECT purchase_id, client_id FROM users WHERE purchase_id = $1', [id]);
    if (res.rows.length === 0) {
        return null;
    }
    return res.rows[0];
};

export const createSingleUserRule = async (rule: userRules): Promise<userRules> => {
    const res = await query(
        'INSERT INTO user_rules (client_id, description, min_threshold, max_threshold, percentage) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [rule.client_id, rule.description, rule.min_threshold, rule.max_threshold, rule.percentage]
    );
    return res.rows[0];
};

export const deleteSingleUserRule = async (id: string): Promise<void> => {
    await query('DELETE FROM user_rules WHERE id = $1', [id]);
};