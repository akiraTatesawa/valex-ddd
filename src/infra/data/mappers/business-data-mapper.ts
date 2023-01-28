import { Business } from "@domain/business/business";
import { BusinessPersistence } from "../persistence-model/business-persistence";

export class BusinessDataMapper {
  public static toPersistence(domain: Business): BusinessPersistence {
    return {
      id: domain._id,
      name: domain.name.value,
      type: domain.type,
    };
  }

  public static toDomain(raw: BusinessPersistence): Business {
    const businessOrError = Business.create({
      name: raw.name,
      type: raw.type,
      id: raw.id,
    });

    return businessOrError.value.getValue()!;
  }
}
