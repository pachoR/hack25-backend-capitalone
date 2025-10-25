import {
  CreatePurchaseRequest,
  Purchase,
  PurchaseResponse,
} from '../models/purchase';

const API_KEY = process.env.API_KEY;
const API_BASE_URL = process.env.API_BASE_URL || 'http://api.nessieisreal.com';

export const createPurchase = async (
  accountId: string,
  purchaseData: CreatePurchaseRequest,
): Promise<PurchaseResponse> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/accounts/${accountId}/purchases?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(purchaseData),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create purchase');
    }

    const data: PurchaseResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error calling external API:', error);
    throw error;
  }
};

export const getPurchasesByAccount = async (
  accountId: string,
): Promise<Purchase[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/accounts/${accountId}/purchases?key=${API_KEY}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch purchases');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error calling external API:', error);
    throw error;
  }
};
