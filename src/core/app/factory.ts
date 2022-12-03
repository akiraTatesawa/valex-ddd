import { Entity } from "../domain/entity";

export abstract class Factory<Model extends Entity<any>> {
  public abstract generate(createModelProps: any): Model;
}
