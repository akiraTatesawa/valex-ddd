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
}
