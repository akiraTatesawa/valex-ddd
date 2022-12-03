import { UseCase } from "@core/app/use-case";
import { CreateCardDTO } from "@modules/cards/dtos/create-card.dto";
import { GetCompanyService } from "@shared/modules/companies/app/services/get-company/get-company.interface";
import { GetEmployeeService } from "@shared/modules/employees/app/services/get-employee/get-employee.interface";
import { CardRepository } from "@modules/cards/app/ports/card-repository";
import { Card } from "@modules/cards/domain/card";
import { Result } from "@core/logic/result";
import { CardDTO } from "@modules/cards/dtos/card.dto";
import { CardMapper } from "@modules/cards/mappers/card-mapper";
import { CreateCardResponse } from "./create-card.response";
import { CreateCardErrors } from "./create-card-errors/errors";

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

    const companyOrError = await this.getCompanyService.getCompany(apiKey);
    const { error: companyError, value: company } = companyOrError;

    if (companyError) {
      return companyOrError;
    }

    const employeeOrError = await this.getEmployeeService.getEmployee(employeeId);
    const { error: employeeError, value: employee } = employeeOrError;

    if (employeeError) {
      return employeeOrError;
    }

    if (employee.companyId !== company._id) {
      return CreateCardErrors.EmployeeNotBelongToCompanyError.create();
    }

    const isCardUnique = await this.isUnique({ employeeId, type });

    if (!isCardUnique) {
      return CreateCardErrors.ConflictCardType.create(type);
    }

    const cardOrError = Card.create({
      employeeId: employee._id,
      cardholderName: employee.fullName.value,
      type,
    });
    const { error: cardError, value: card } = cardOrError;

    if (cardError) {
      return cardOrError;
    }

    await this.cardRepository.save(card);

    const cardDTO = CardMapper.toDTO(card);

    return Result.ok<CardDTO>(cardDTO);
  }
}
