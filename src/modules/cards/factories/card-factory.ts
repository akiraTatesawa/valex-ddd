import { randUuid, randWord } from "@ngneat/falso";
import { Factory } from "@core/app/factory";
import { Card, CreateCardProps } from "../domain/card";

type GenerateCardFactoryProps = Partial<CreateCardProps>;

export class CardFactory extends Factory<Card> {
  public generate({ ...props }: GenerateCardFactoryProps = {}): Card {
    const cardOrError = Card.create({
      employeeId: randUuid(),
      cardholderName: randWord(),
      type: "education",
      ...props,
    });

    return cardOrError.value!;
  }
}
