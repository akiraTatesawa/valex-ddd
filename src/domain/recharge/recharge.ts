import { Entity } from "@core/domain/entity";
import { Either, left, right } from "@core/logic/either";
import { Guard, GuardResult } from "@core/logic/guard";
import { Result } from "@core/logic/result";
import { DomainErrors } from "@domain/errors/domain-error";
import { RechargeAmount } from "./recharge-amount";

interface RechargeProps {
  amount: RechargeAmount;
  cardId: string;
  createdAt: Date;
}

export interface CreateRechargeProps {
  id?: string;
  amount: number;
  cardId: string;
  createdAt?: Date;
}

type CreateRechargeResult = Either<DomainErrors.InvalidPropsError, Result<Recharge, null>>;

type GuardRechargeResult = Either<DomainErrors.InvalidPropsError, Result<null, null>>;

export class Recharge extends Entity<RechargeProps> {
  private constructor(props: RechargeProps, id?: string) {
    super(props, id);
  }

  public get amount(): RechargeAmount {
    return this.props.amount;
  }

  public get cardId(): string {
    return this.props.cardId;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  private static guard(rechargeProps: CreateRechargeProps): GuardRechargeResult {
    const { id, cardId, createdAt } = rechargeProps;

    const guardResults: GuardResult[] = [Guard.againstNonUUID(cardId, "Card ID")];

    if (id !== undefined) {
      guardResults.push(Guard.againstNonUUID(id, "Recharge ID"));
    }
    if (createdAt !== undefined) {
      guardResults.push(Guard.againstNonDate(createdAt, "Recharge Created At"));
    }

    const combinedGuardResult = Guard.combineResults(guardResults);

    if (!combinedGuardResult.succeeded) {
      return left(DomainErrors.InvalidPropsError.create(combinedGuardResult.message));
    }

    return right(Result.pass());
  }

  public static create(rechargeProps: CreateRechargeProps): CreateRechargeResult {
    const guardResult = Recharge.guard(rechargeProps);

    if (guardResult.isLeft()) {
      const guardError = guardResult.value;

      return left(guardError);
    }

    const { id, amount, cardId, createdAt } = rechargeProps;

    const rechargeAmountOrError = RechargeAmount.create(amount);

    if (rechargeAmountOrError.isLeft()) {
      const rechargeAmountError = rechargeAmountOrError.value;

      return left(rechargeAmountError);
    }

    const rechargeAmountEntity: RechargeAmount = rechargeAmountOrError.value.getValue();
    const recharge = new Recharge(
      {
        amount: rechargeAmountEntity,
        cardId,
        createdAt: createdAt ?? new Date(),
      },
      id
    );

    return right(Result.ok(recharge));
  }
}
