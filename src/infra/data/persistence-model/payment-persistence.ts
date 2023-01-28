export interface PaymentPersistence {
  id: string;
  cardId: string;
  businessId: string;
  amount: number;
  createdAt: Date;
}
