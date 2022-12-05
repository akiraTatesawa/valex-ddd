import { Card } from "../domain/card";
import { CardDTO } from "../dtos/card.dto";
import { CardPersistence } from "../infra/database/card-persistence";

export class CardMapper {
  public static toPersistence(domain: Card): CardPersistence {
    return {
      id: domain._id,
      cardholderName: domain.cardholderName.value,
      number: domain.number.value,
      securityCode: domain.securityCode.value,
      type: domain.type,
      employeeId: domain.employeeId,
      isVirtual: domain.isVirtual,
      isBlocked: domain.isBlocked,
      expirationDate: domain.expirationDate.getDate(),
      originalCardId: domain.originalCardId,
      password: domain.password?.value,
    };
  }

  public static toDomain(persistence: CardPersistence): Card {
    const cardOrError = Card.create({
      id: persistence.id,
      cardholderName: persistence.cardholderName,
      employeeId: persistence.employeeId,
      type: persistence.type,
      expirationDate: persistence.expirationDate,
      isBlocked: persistence.isBlocked,
      isVirtual: persistence.isVirtual,
      number: persistence.number,
      originalCardId: persistence.originalCardId,
      securityCode: persistence.securityCode,
      password: persistence.password,
    });

    return cardOrError.value.getValue()!;
  }

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
