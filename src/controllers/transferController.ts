import { Request, Response } from "express";
import { CreateTransferRequest, TransferResponse } from "../models/transfer";
import { createTransfer } from "../services/transferService";


export const createTransferForAccount = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const transferData: CreateTransferRequest = req.body;
        if (
            !transferData.payee_id ||
            !transferData.medium ||
            transferData.amount === undefined
        ) {
            const response: TransferResponse = {
                code: 400,
                message: 'Missing required fields'
            };
            return res.status(400).json(response);
        }

        const transfer = await createTransfer(id, transferData);

        const response: TransferResponse = {
            code: transfer.code,
            message: transfer.message,
            objectCreated: transfer.objectCreated,
        };

        res.status(transfer.code).json(response);
    } catch (error) {
        console.error('Error creating purchase:', error);

        if (error instanceof Error) {
            if (error.message.includes('not found') || error.message.includes('does not exist')) {
                const response: TransferResponse = {
                    code: 404,
                    message: 'Account not found',
                };
                return res.status(404).json(response);
            }

            if (error.message.includes('validation') || error.message.includes('invalid')) {
                const response: TransferResponse = {
                    code: 400,
                    message: 'Invalid data provided'
                };
                return res.status(400).json(response);
            }
        }

        const response: TransferResponse = {
            code: 500,
            message: 'Internal server error',
        };
        res.status(500).json(response);
    }
}