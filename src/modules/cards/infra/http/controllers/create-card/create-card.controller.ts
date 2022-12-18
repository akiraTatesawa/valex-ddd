import { Request, Response } from "express";
import { DomainErrors } from "@domain/errors/domain-error";
import { BaseController } from "@core/infra/http/base-controller";
import { CreateCardUseCase } from "@modules/cards/app/use-cases/create-card/create-card";
import { GetCompanyErrors } from "@shared/modules/companies/app/services/get-company/get-company-errors/errors";
import { GetEmployeeErrors } from "@shared/modules/employees/app/services/get-employee/get-employee-errors/errors";
import { CreateCardErrors } from "@modules/cards/app/use-cases/create-card/create-card-errors/errors";
import { CardDTO } from "@modules/cards/dtos/card.dto";
import { CreateCardBody } from "./request";

export class CreateCardController extends BaseController {
  private readonly useCase: CreateCardUseCase;

  constructor(useCase: CreateCardUseCase) {
    super();
    this.useCase = useCase;
  }

  protected async handleImpl(req: Request, res: Response): Promise<any> {
    const { employeeId, type } = req.body as CreateCardBody;
    const apiKey = req.headers["x-api-key"] as string;

    const result = await this.useCase.execute({ apiKey, employeeId, type });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case DomainErrors.InvalidPropsError:
        case GetCompanyErrors.InvalidApiKeyError:
        case GetEmployeeErrors.InvalidEmployeeIdError:
          return this.badRequest(res, error.getError().message);
        case GetEmployeeErrors.NotFoundError:
        case GetCompanyErrors.NotFoundError:
          return this.notFound(res, error.getError().message);
        case CreateCardErrors.EmployeeNotBelongToCompanyError:
          return this.unprocessableEntity(res, error.getError().message);
        case CreateCardErrors.ConflictCardType:
          return this.conflict(res, error.getError().message);
        default:
          return this.fail(res, error.getError().message);
      }
    }

    return this.created<CardDTO>(res, result.value.getValue());
  }
}
