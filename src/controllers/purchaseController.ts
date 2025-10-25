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
      !purchaseData.purchase_date ||
      purchaseData.amount === undefined ||
      !purchaseData.status ||
      !purchaseData.description
    ) {
      const response: PurchaseResponse = {
        code: 400,
        message: 'Missing required fields',
        fields:
          'merchant_id, medium, purchase_date, amount, status, description',
      };
      return res.status(400).json(response);
    }

    const purchase = await createPurchase(id, purchaseData);

    const response: PurchaseResponse = {
      code: 201,
      message: 'Purchase created successfully',
      fields: JSON.stringify(purchase),
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating purchase:', error);
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

    res.status(200).json({
      code: 200,
      message: 'Purchases retrieved successfully',
      data: purchases,
    });
  } catch (error) {
    console.error('Error fetching purchases:', error);
    const response: PurchaseResponse = {
      code: 500,
      message: 'Internal server error',
    };
    res.status(500).json(response);
  }
};
