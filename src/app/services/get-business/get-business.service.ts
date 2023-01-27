import { BusinessRepository } from "@app/ports/repositories/business-repository";
import { Either, left, right } from "@core/logic/either";
import { Result } from "@core/logic/result";
import { Business } from "@domain/business/business";
import { GetBusinessErrors } from "./get-business-errors/errors";

type GetBusinessResponse = Either<GetBusinessErrors.NotFoundError, Result<Business, null>>;

export class GetBusinessService {
  private readonly businessRepository: BusinessRepository;

  constructor(businessRepository: BusinessRepository) {
    this.businessRepository = businessRepository;
  }

  public async getBusiness(businessId: string): Promise<GetBusinessResponse> {
    const business = await this.businessRepository.findById(businessId);

    if (!business) {
      return left(GetBusinessErrors.NotFoundError.create());
    }

    return right(Result.ok<Business>(business));
  }
}
