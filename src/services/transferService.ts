import { TransferResponse, CreateTransferRequest } from "../models/transfer";
import {
    TransactionTypes,
    ExecInvestmentStatus
} from '../models/const';
import { query } from "../util/dbClient";

const API_KEY = process.env.API_KEY;
const API_BASE_URL = process.env.API_BASE_URL || 'http://api.nessieisreal.com';

export const createTransfer = async (
    accountId: string,
    transferData: CreateTransferRequest,
): Promise<TransferResponse> => {
    try {
        console.log('Creating transfer with data:', transferData);
        const response = await fetch(
            `${API_BASE_URL}/accounts/${accountId}/transfers?key=${API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transferData),
            },
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create transfer');
        }

        const data: TransferResponse = await response.json();
        const dbSaving = await query('INSERT INTO users (client_id, purchase_id, invest_id, exec_status, transaction_type) VALUES ($1, $2, $3, $4, $5)',
            [
                accountId,
                data.objectCreated?._id || '',
                '',
                ExecInvestmentStatus.ON_GOING,
                TransactionTypes.TRANSFER
            ]
        );
        return data;
    } catch (error) {
        console.error('Error calling external API:', error);
        throw error;
    }

}

export const createTransferNoDatabase = async (
    accountId: string,
    transferData: CreateTransferRequest,
): Promise<TransferResponse> => {
    try {
        console.log('Creating transfer with data:', transferData);
        const response = await fetch(
            `${API_BASE_URL}/accounts/${accountId}/transfers?key=${API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transferData),
            },
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create transfer');
        }

        const data: TransferResponse = await response.json();
        return data;
    } catch (error) {
        console.error('Error calling external API:', error);
        throw error;
    }

}