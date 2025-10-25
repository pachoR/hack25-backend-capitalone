export interface Purchase {
  purchase_id?: string;
  merchant_id: string;
  medium: string;
  purchase_date: string;
  amount: number;
  status: string;
  description: string;
  account_id?: string;
  created_at?: Date;
}

export interface CreatePurchaseRequest {
  merchant_id: string;
  medium: string;
  amount: number;
  description: string;
}

export interface PurchaseResponse {
  message: string;
  code: number;
  objectCreated?: {
    merchant_id: string;
    medium: string;
    purchase_date: string;
    amount: number;
    status: string;
    type: string;
    payer_id: string;
    _id: string;
  };
}

export const ExecInvestmentStatus = {
  ON_GOING: 0,
  EXEC: 1,
  KILLED: 2
}