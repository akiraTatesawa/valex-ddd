import { UseCase } from "@core/app/use-case";
import { Card } from "@domain/card/card";
import { Result } from "@core/logic/result";
import { left, right } from "@core/logic/either";
import { CreateCardDTO } from "@app/dtos/create-card.dto";
import { GetCompanyService } from "@app/services/get-company/get-company.interface";
import { GetEmployeeService } from "@app/services/get-employee/get-employee.interface";
import { CardRepository } from "@app/ports/card-repository";
import { CreateCardErrors } from "@app/errors/create-card-errors";
import { CardAppMapper } from "@app/mappers/card-app-mapper";
import { CardDTO } from "@app/dtos/card.dto";
import { CreateCardResponse } from "./create-card.response";

export interface CreateCardUseCase extends UseCase<CreateCardDTO, CreateCardResponse> {}

type IsUniqueArgs = Omit<CreateCardDTO, "apiKey">;

export class CreateCardImpl implements CreateCardUseCase {
  private readonly getCompanyService: GetCompanyService;

  private readonly getEmployeeService: GetEmployeeService;

  private readonly cardRepository: CardRepository;

  constructor(
    getCompanyService: GetCompanyService,
    getEmployeeService: GetEmployeeService,
    cardRepository: CardRepository
  ) {
    this.getCompanyService = getCompanyService;
    this.getEmployeeService = getEmployeeService;
    this.cardRepository = cardRepository;
  }

  private async isUnique({ employeeId, type }: IsUniqueArgs): Promise<boolean> {
    const card = await this.cardRepository.findByType({ employeeId, type });

    if (!card) return true;

    return false;
  }

  public async execute(reqData: CreateCardDTO): Promise<CreateCardResponse> {
    const { apiKey, employeeId, type } = reqData;

    const getCompanyResult = await this.getCompanyService.getCompany(apiKey);

    if (getCompanyResult.isLeft()) {
      const getCompanyError = getCompanyResult.value;

      return left(getCompanyError);
    }

    const getEmployeeResult = await this.getEmployeeService.getEmployee(employeeId);

    if (getEmployeeResult.isLeft()) {
      const getEmployeeError = getEmployeeResult.value;

      return left(getEmployeeError);
    }

    const company = getCompanyResult.value.getValue();
    const employee = getEmployeeResult.value.getValue();

    if (employee.companyId !== company._id) {
      return left(CreateCardErrors.EmployeeNotBelongToCompanyError.create());
    }

    const isCardUnique = await this.isUnique({ employeeId, type });

    if (!isCardUnique) {
      return left(CreateCardErrors.ConflictCardType.create(type));
    }

    const cardEntityResult = Card.create({
      employeeId: employee._id,
      cardholderName: employee.fullName.value,
      type,
    });

    if (cardEntityResult.isLeft()) {
      const cardEntityError = cardEntityResult.value;

      return left(cardEntityError);
    }

    const card = cardEntityResult.value.getValue();

    await this.cardRepository.save(card);

    const cardDTO = CardAppMapper.toDTO(card);

    return right(Result.ok<CardDTO>(cardDTO));
  }
}
