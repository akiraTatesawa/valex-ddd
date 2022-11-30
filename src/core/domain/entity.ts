import { randomUUID } from "crypto";

export abstract class Entity<Props> {
  protected readonly props: Props;

  public readonly _id: string;

  constructor(props: Props, id?: string) {
    this.props = props;
    this._id = id ?? randomUUID();
  }
}
