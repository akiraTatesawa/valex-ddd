import { PaymentDTO } from "@app/dtos/payment.dto";
import { CardUseCaseErrors } from "@app/errors/card-shared-errors";
import { PaymentErrors } from "@app/errors/payment-errors";
import { GetBusinessErrors } from "@app/services/get-business/get-business-errors/errors";
import { GetCardErrors } from "@app/services/get-card/get-card-errors/errors";
import { Either } from "@core/logic/either";
import { Result } from "@core/logic/result";
import { DomainErrors } from "@domain/errors/domain-error";

export type BuyOnlineResponse = Either<
  | DomainErrors.InvalidPropsError
  | GetCardErrors.NotFoundError
  | CardUseCaseErrors.InactiveCardError
  | CardUseCaseErrors.ExpiredCardError
  | CardUseCaseErrors.BlockedCardError
  | CardUseCaseErrors.IncorrectCVVError
  | GetBusinessErrors.NotFoundError
  | PaymentErrors.IncompatibleTypesError
  | PaymentErrors.InsufficientBalance,
  Result<PaymentDTO, null>
>;
