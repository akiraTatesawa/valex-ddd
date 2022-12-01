import { ValueObject } from "@core/domain/value-object";

interface EncryptedProps {
  value: string;
}

export abstract class Encrypted extends ValueObject<EncryptedProps> {
  public abstract compare(value: string): boolean;
}
