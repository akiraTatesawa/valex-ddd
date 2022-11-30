import { Entity } from "@core/domain/entity";

export interface Repository<Model extends Entity<any>> {
  save(data: Model): Promise<void>;
}
