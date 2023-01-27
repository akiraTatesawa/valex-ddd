import { randUuid, randNumber, randPastDate } from "@ngneat/falso";
import { Left, Right } from "@core/logic/either";
import { DomainErrors } from "@domain/errors/domain-error";
import { CreatePaymentProps, Payment } from "./payment";

describe("Payment Entity", () => {
  describe("Success", () => {
    it("Should be able to create a Payment Entity", () => {
      const paymentProps: CreatePaymentProps = {
        cardId: randUuid(),
        businessId: randUuid(),
        amount: randNumber({ min: 1 }),
      };

      const result = Payment.create(paymentProps);

      expect(result).toBeInstanceOf(Right);
      expect(result.isRight()).toEqual(true);
      expect(result.value.getError()).toBeNull();
      expect(result.value.getValue()).toBeInstanceOf(Payment);
      expect(result.value.getValue()).toHaveProperty("_id");
      expect(result.value.getValue()).toHaveProperty("createdAt");
      expect(result.value.getValue()).toHaveProperty("cardId", paymentProps.cardId);
      expect(result.value.getValue()).toHaveProperty("businessId", paymentProps.businessId);
      expect(result.value.getValue()).toHaveProperty("amount.value", paymentProps.amount);
    });

    it("Should be able to reconstitute a Payment Entity", () => {
      const paymentProps: CreatePaymentProps = {
        id: randUuid(),
        cardId: randUuid(),
        businessId: randUuid(),
        amount: randNumber({ min: 1 }),
        createdAt: randPastDate(),
      };

      const result = Payment.create(paymentProps);

      expect(result).toBeInstanceOf(Right);
      expect(result.isRight()).toEqual(true);
      expect(result.value.getError()).toBeNull();
      expect(result.value.getValue()).toBeInstanceOf(Payment);
      expect(result.value.getValue()).toHaveProperty("_id", paymentProps.id);
      expect(result.value.getValue()).toHaveProperty("createdAt", paymentProps.createdAt);
      expect(result.value.getValue()).toHaveProperty("cardId", paymentProps.cardId);
      expect(result.value.getValue()).toHaveProperty("businessId", paymentProps.businessId);
      expect(result.value.getValue()).toHaveProperty("amount.value", paymentProps.amount);
    });
  });

  describe("Fail", () => {
    it("Should return an error if the 'cardId' is not a valid UUID", () => {
      const paymentProps: CreatePaymentProps = {
        id: randUuid(),
        cardId: "invalid_id",
        businessId: randUuid(),
        amount: randNumber({ min: 1 }),
        createdAt: randPastDate(),
      };

      const result = Payment.create(paymentProps);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()).toHaveProperty("message", "Card ID must be a valid UUID");
    });

    it("Should return an error if the 'businessId' is not a valid UUID", () => {
      const paymentProps: CreatePaymentProps = {
        id: randUuid(),
        cardId: randUuid(),
        businessId: "invalid_id",
        amount: randNumber({ min: 1 }),
        createdAt: randPastDate(),
      };

      const result = Payment.create(paymentProps);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()).toHaveProperty("message", "Business ID must be a valid UUID");
    });

    it("Should return an error if the payment 'id' is not a valid UUID", () => {
      const paymentProps: CreatePaymentProps = {
        id: "invalid_id",
        cardId: randUuid(),
        businessId: randUuid(),
        amount: randNumber({ min: 1 }),
        createdAt: randPastDate(),
      };

      const result = Payment.create(paymentProps);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()).toHaveProperty("message", "Payment ID must be a valid UUID");
    });

    it("Should return an error if the payment 'createdAt' is not a valid Date", () => {
      const paymentProps: CreatePaymentProps = {
        id: randUuid(),
        cardId: randUuid(),
        businessId: randUuid(),
        amount: randNumber({ min: 1 }),
        createdAt: 1 as any,
      };

      const result = Payment.create(paymentProps);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()).toHaveProperty("message", "Payment CreatedAt must be a Date");
    });

    it("Should return an error if the payment 'amount' is invalid", () => {
      const paymentProps: CreatePaymentProps = {
        id: randUuid(),
        cardId: randUuid(),
        businessId: randUuid(),
        amount: randNumber({ min: 1, fraction: 3 }),
        createdAt: randPastDate(),
      };

      const result = Payment.create(paymentProps);

      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toEqual(true);
      expect(result.value).toBeInstanceOf(DomainErrors.InvalidPropsError);
      expect(result.value.getValue()).toBeNull();
      expect(result.value.getError()).toHaveProperty("message", "Amount must be an integer");
    });
  });
});
