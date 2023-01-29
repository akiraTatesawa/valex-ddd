export interface CreatePoSPaymentDTO {
  cardId: string;
  cardPassword: string;
  businessId: string;
  amount: number;
}

export interface CardInfo {
  cardNumber: string;
  cardholderName: string;
  expirationDate: string;
  cvv: string;
}

export interface CreateOnlinePaymentDTO {
  cardInfo: CardInfo;
  businessId: string;
  amount: number;
}
