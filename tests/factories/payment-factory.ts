import { randUuid, randNumber } from "@ngneat/falso";

import { Factory } from "@core/app/factory";
import { CreatePaymentProps, Payment } from "@domain/payment/payment";

type PaymentGenerateProps = Partial<CreatePaymentProps>;

export class PaymentFactory extends Factory<Payment> {
  public generate({ ...props }: PaymentGenerateProps = {}): Payment {
    const paymentOrError = Payment.create({
      businessId: randUuid(),
      cardId: randUuid(),
      amount: randNumber({ min: 1 }),
      ...props,
    });

    return paymentOrError.value.getValue()!;
  }
}
