import { Request, Response } from 'express';
import {
  createPurchase,
  getPurchasesByAccount,
} from '../services/purchaseService';
import { CreatePurchaseRequest, PurchaseResponse } from '../models/purchase';

export const createPurchaseForAccount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const purchaseData: CreatePurchaseRequest = req.body;

    if (
      !purchaseData.merchant_id ||
      !purchaseData.medium ||
      purchaseData.amount === undefined ||
      !purchaseData.description
    ) {
      const response: PurchaseResponse = {
        code: 400,
        message: 'Missing required fields'
      };
      return res.status(400).json(response);
    }

    const purchase = await createPurchase(id, purchaseData);

    const response: PurchaseResponse = {
      code: 201,
      message: 'Purchase created successfully',
      objectCreated: purchase.objectCreated,
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating purchase:', error);

    if (error instanceof Error) {
      if (error.message.includes('not found') || error.message.includes('does not exist')) {
        const response: PurchaseResponse = {
          code: 404,
          message: 'Account not found',
        };
        return res.status(404).json(response);
      }

      if (error.message.includes('validation') || error.message.includes('invalid')) {
        const response: PurchaseResponse = {
          code: 400,
          message: 'Invalid data provided'
        };
        return res.status(400).json(response);
      }
    }

    const response: PurchaseResponse = {
      code: 500,
      message: 'Internal server error',
    };
    res.status(500).json(response);
  }
};

export const getAccountPurchases = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const purchases = await getPurchasesByAccount(id);

    if (!purchases || purchases.length === 0) {
      return res.status(200).json({
        code: 200,
        message: 'No purchases found for this account',
        data: [],
      });
    }

    res.status(200).json({
      code: 200,
      message: 'Purchases retrieved successfully',
      data: purchases,
    });
  } catch (error) {
    console.error('Error fetching purchases:', error);

    if (error instanceof Error) {
      if (error.message.includes('not found') || error.message.includes('does not exist')) {
        const response: PurchaseResponse = {
          code: 404,
          message: 'Account not found',
        };
        return res.status(404).json(response);
      }

      if (error.message.includes('connection') || error.message.includes('database')) {
        const response: PurchaseResponse = {
          code: 503,
          message: 'Service temporarily unavailable',
        };
        return res.status(503).json(response);
      }
    }

    const response: PurchaseResponse = {
      code: 500,
      message: 'Internal server error',
    };
    res.status(500).json(response);
  }
};
