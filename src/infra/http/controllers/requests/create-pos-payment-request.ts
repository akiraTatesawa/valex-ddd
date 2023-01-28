export interface CreatePosPaymentRequest {
  cardId: string;
  cardPassword: string;
  businessId: string;
  amount: number;
}
