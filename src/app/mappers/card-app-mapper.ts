import { CardDTO } from "@app/dtos/card.dto";
import { Card } from "@domain/card/card";

export class CardAppMapper {
  public static toDTO(domain: Card): CardDTO {
    return {
      id: domain._id,
      cardholderName: domain.cardholderName.value,
      number: domain.number.value,
      securityCode: domain.securityCode.decrypt(),
      expirationDate: domain.expirationDate.getStringExpirationDate(),
      type: domain.type,
    };
  }
}
