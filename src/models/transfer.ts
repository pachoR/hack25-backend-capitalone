export interface TransferResponse {
    message: string;
    code: number;
    objectCreated?: {
        medium: string;
        payee_id: string;
        amount: number;
        status: string;
        type: string;
        payer_id: string;
        _id: string;
    }
}


export interface CreateTransferRequest {
    payee_id: string;
    medium: string;
    amount: number;
}