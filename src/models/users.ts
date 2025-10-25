export interface User {
    purchase_id: string;
    client_id: string;
    userRules: userRules[];
}

export interface userRules {
    id: string;
    client_id: string;
    description: string;
    min_threshold: number;
    max_threshold: number;
    percentage: number;
}