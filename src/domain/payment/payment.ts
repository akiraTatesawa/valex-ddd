import { Entity } from "@core/domain/entity";
import { Either, left, right } from "@core/logic/either";
import { Guard, GuardResult } from "@core/logic/guard";
import { Result } from "@core/logic/result";
import { DomainErrors } from "@domain/errors/domain-error";
import { Amount } from "@shared/domain/amount";

interface PaymentProps {
  businessId: string;
  cardId: string;
  amount: Amount;
  createdAt: Date;
}

export interface CreatePaymentProps {
  id?: string;
  businessId: string;
  cardId: string;
  amount: number;
  createdAt?: Date;
}

type CreatePaymentResult = Either<DomainErrors.InvalidPropsError, Result<Payment, null>>;

export class Payment extends Entity<PaymentProps> {
  private constructor(props: PaymentProps, id?: string) {
    super(props, id);
  }

  public get cardId(): string {
    return this.props.cardId;
  }

  public get businessId(): string {
    return this.props.businessId;
  }

  public get amount(): Amount {
    return this.props.amount;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public static create(props: CreatePaymentProps): CreatePaymentResult {
    const { amount, businessId, cardId, id, createdAt } = props;

    const guardResults: GuardResult[] = [
      Guard.againstNonUUID(cardId, "Card ID"),
      Guard.againstNonUUID(businessId, "Business ID"),
    ];

    if (id !== undefined) {
      guardResults.push(Guard.againstNonUUID(id, "Payment ID"));
    }

    if (createdAt !== undefined) {
      guardResults.push(Guard.againstNonDate(createdAt, "Payment CreatedAt"));
    }

    const combinedResult: GuardResult = Guard.combineResults(guardResults);

    if (!combinedResult.succeeded) {
      return left(DomainErrors.InvalidPropsError.create(combinedResult.message));
    }

    const paymentAmountOrError = Amount.create(amount);

    if (paymentAmountOrError.isLeft()) {
      const paymentAmountError = paymentAmountOrError.value;

      return left(paymentAmountError);
    }

    const paymentEntity = new Payment(
      {
        amount: paymentAmountOrError.value.getValue(),
        businessId,
        cardId,
        createdAt: createdAt ?? new Date(),
      },
      id
    );

    return right(Result.ok<Payment>(paymentEntity));
  }
}
