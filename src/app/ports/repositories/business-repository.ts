import { Repository } from "@core/app/repository";
import { Business } from "@domain/business/business";

export interface BusinessRepository extends Repository<Business> {
  findById(id: string): Promise<Business | null>;
}
