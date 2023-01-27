import { randUuid } from "@ngneat/falso";
import { BusinessRepository } from "@app/ports/repositories/business-repository";
import { Left, Right } from "@core/logic/either";
import { Business } from "@domain/business/business";
import { InMemoryDatabase } from "@infra/data/databases/in-memory/in-memory.database";
import { InMemoryBusinessRepository } from "@infra/data/repositories/in-memory/in-memory-business-repository";
import { BusinessFactory } from "@tests/factories/business-factory";
import { GetBusinessService } from "./get-business.service";
import { GetBusinessErrors } from "./get-business-errors/errors";

describe("Get Business Service", () => {
  let inMemoryDatabase: InMemoryDatabase;
  let businessRepo: BusinessRepository;

  let sut: GetBusinessService;

  let business: Business;

  beforeEach(() => {
    inMemoryDatabase = new InMemoryDatabase();
    businessRepo = new InMemoryBusinessRepository(inMemoryDatabase);

    business = new BusinessFactory().generate();

    sut = new GetBusinessService(businessRepo);

    businessRepo.save(business);
  });

  describe("Success", () => {
    it("Should be able to get a business by id", async () => {
      const result = await sut.getBusiness(business._id);

      expect(result).toBeInstanceOf(Right);
      expect(result.value.getValue()).toBeInstanceOf(Business);
      expect(result.value.getValue()).toHaveProperty("_id", business._id);
    });
  });

  describe("Fail", () => {
    it("Should return an error if the business does not exist", async () => {
      const result = await sut.getBusiness(randUuid());

      expect(result).toBeInstanceOf(Left);
      expect(result.value).toBeInstanceOf(GetBusinessErrors.NotFoundError);
      expect(result.value.getError()).toHaveProperty("message", "Business not found");
    });
  });
});
